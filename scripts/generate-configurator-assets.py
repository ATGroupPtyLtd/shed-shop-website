"""Generate high-quality shed configurator renders from the concept masters.

The images in ``public/concepts`` are the visual source of truth. This script
preserves their camera, geometry, lighting, openings and structural detail.
Only painted metal cladding is recoloured. Source-aware protection mattes keep
roller doors, personnel doors, windows, glazing, open bays and skylights intact.

Profiles are handled as materials rather than browser overlays:

* Corrugated retains the excellent native fine-rib texture.
* Trimdek removes the native fine ribs and rebuilds broader trapezoidal ribs.
* Architectural Panel removes the native rib texture entirely, producing a
  smooth, wide-format panel finish without fake horizontal lines over vertical
  corrugations.

Run a single preview first, then generate all 720 catalogue images:

    python scripts/generate-configurator-assets.py \
      --purpose business --style skillion \
      --profile architectural-panel --colour manor-red --show

    python scripts/generate-configurator-assets.py
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path
from typing import Sequence

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "concepts"
OUTPUT = ROOT / "public" / "configurator"
SIZE = 720

COLOURS = {
    "monument": "#323333",
    "surfmist": "#E4E2D5",
    "woodland-grey": "#4B4C46",
    "night-sky": "#000000",
    "shale-grey": "#BDBFBA",
    "basalt": "#6D6C6E",
    "dune": "#B1ADA3",
    "pale-eucalypt": "#7C846A",
    "ironstone": "#3E434C",
    "deep-ocean": "#364152",
    "manor-red": "#5E1D0E",
    "classic-cream": "#E9DCB8",
}

PURPOSES = ("home", "farm", "business", "custom")
STYLES = ("gable", "skillion", "barn", "open", "custom")
PROFILES = ("corrugated", "trimdek", "architectural-panel")

Point = tuple[int, int]
Polygon = tuple[Point, ...]


def rectangle(left: int, top: int, right: int, bottom: int) -> Polygon:
    return ((left, top), (right, top), (right, bottom), (left, bottom))


# Protected regions are deliberately source-specific. A roller door is a door,
# not "dark cladding"; no colour threshold can infer that reliably across all
# twenty concepts. Coordinates use the final 720x720 render space.
PROTECTED_REGIONS: dict[str, tuple[Polygon, ...]] = {
    "business-barn": (
        rectangle(72, 332, 238, 495),
        rectangle(261, 373, 312, 501),
        rectangle(394, 386, 438, 432),
        rectangle(480, 382, 526, 427),
        rectangle(570, 377, 616, 422),
        rectangle(372, 239, 417, 292),
        rectangle(474, 252, 520, 304),
        rectangle(570, 265, 615, 316),
    ),
    "business-custom": (
        ((14, 280), (304, 211), (394, 258), (394, 503), (14, 482)),
        rectangle(425, 326, 509, 470),
        rectangle(527, 416, 556, 485),
        rectangle(563, 402, 596, 486),
    ),
    "business-gable": (
        rectangle(398, 331, 516, 492),
        rectangle(525, 343, 617, 491),
        rectangle(625, 382, 660, 491),
        ((66, 285), (177, 257), (206, 268), (95, 299)),
        ((230, 244), (340, 217), (370, 229), (260, 257)),
        ((394, 207), (466, 190), (492, 201), (420, 220)),
    ),
    "business-open": (
        ((15, 281), (397, 211), (414, 500), (18, 483)),
        rectangle(440, 382, 482, 489),
    ),
    "business-skillion": (
        ((70, 262), (398, 313), (398, 340), (70, 330)),
        rectangle(78, 325, 211, 507),
        rectangle(214, 428, 256, 525),
    ),
    "custom-barn": (
        rectangle(82, 282, 302, 355),
        rectangle(68, 347, 302, 516),
        rectangle(315, 400, 378, 535),
        rectangle(415, 294, 470, 365),
        rectangle(514, 307, 565, 375),
        rectangle(595, 321, 642, 384),
    ),
    "custom-custom": (
        rectangle(34, 345, 177, 510),
        rectangle(181, 397, 231, 515),
        ((231, 258), (492, 190), (679, 281), (679, 526), (231, 521)),
    ),
    "custom-gable": (
        rectangle(78, 340, 286, 527),
        rectangle(321, 398, 375, 529),
        rectangle(421, 381, 461, 469),
        rectangle(493, 392, 535, 474),
        rectangle(579, 400, 617, 478),
    ),
    "custom-open": (
        ((14, 279), (219, 157), (678, 282), (680, 487), (14, 486)),
    ),
    "custom-skillion": (
        ((103, 319), (396, 344), (396, 379), (103, 371)),
        rectangle(91, 349, 310, 514),
        rectangle(324, 413, 388, 535),
        rectangle(479, 390, 514, 481),
        rectangle(545, 397, 580, 484),
        rectangle(611, 405, 646, 487),
    ),
    "farm-barn": (
        rectangle(89, 266, 140, 329),
        ((62, 326), (326, 352), (326, 539), (62, 488)),
        rectangle(378, 407, 435, 545),
        rectangle(463, 390, 502, 457),
        rectangle(535, 378, 573, 448),
        rectangle(603, 366, 638, 438),
        rectangle(273, 165, 321, 221),
        rectangle(426, 172, 475, 227),
    ),
    "farm-custom": (
        rectangle(24, 357, 73, 416),
        rectangle(94, 372, 141, 431),
        rectangle(161, 382, 208, 442),
        rectangle(217, 385, 264, 515),
        rectangle(281, 390, 363, 462),
        rectangle(381, 405, 435, 520),
        rectangle(451, 420, 511, 495),
        ((589, 296), (704, 321), (704, 492), (589, 508)),
        rectangle(542, 204, 575, 246),
    ),
    "farm-gable": (
        ((8, 292), (391, 209), (421, 512), (8, 494)),
        ((426, 330), (516, 315), (516, 492), (426, 512)),
        rectangle(526, 382, 572, 505),
        rectangle(589, 352, 631, 420),
        rectangle(642, 338, 680, 404),
        ((493, 187), (544, 178), (573, 188), (522, 199)),
        ((587, 190), (635, 187), (662, 198), (614, 202)),
    ),
    "farm-open": (
        ((8, 290), (169, 216), (679, 280), (681, 493), (8, 493)),
    ),
    "farm-skillion": (
        ((8, 264), (126, 205), (436, 286), (436, 526), (8, 493)),
        rectangle(456, 403, 500, 533),
        rectangle(523, 380, 564, 447),
        rectangle(578, 386, 617, 451),
        rectangle(632, 392, 670, 455),
        ((464, 218), (514, 225), (540, 237), (490, 230)),
        ((555, 234), (604, 242), (630, 253), (580, 247)),
    ),
    "home-barn": (
        rectangle(66, 347, 288, 547),
        rectangle(339, 397, 395, 541),
        rectangle(439, 386, 490, 474),
        rectangle(550, 388, 601, 476),
    ),
    "home-custom": (
        rectangle(60, 273, 259, 493),
        ((275, 235), (485, 159), (668, 221), (668, 519), (275, 513)),
    ),
    "home-gable": (
        rectangle(76, 339, 295, 536),
        rectangle(344, 390, 399, 535),
        rectangle(442, 377, 493, 471),
        rectangle(565, 379, 616, 472),
    ),
    "home-open": (
        ((7, 224), (180, 144), (405, 205), (405, 508), (7, 493)),
        rectangle(438, 289, 500, 507),
        rectangle(541, 297, 598, 405),
    ),
    "home-skillion": (
        rectangle(61, 337, 288, 537),
        rectangle(337, 388, 395, 535),
        rectangle(449, 376, 503, 474),
        rectangle(573, 379, 625, 475),
    ),
}

# Glass and open interiors can contain bright reflections, so luminance alone
# cannot protect them. These tighter mattes are always preserved in full.
FULL_PROTECTED_REGIONS: dict[str, tuple[Polygon, ...]] = {
    "business-barn": (
        rectangle(103, 348, 242, 526),
        rectangle(394, 386, 438, 432),
        rectangle(480, 382, 526, 427),
        rectangle(570, 377, 616, 422),
        rectangle(372, 239, 417, 292),
        rectangle(474, 252, 520, 304),
        rectangle(570, 265, 615, 316),
    ),
    "business-custom": (
        ((14, 280), (304, 211), (394, 258), (394, 503), (14, 482)),
        rectangle(440, 348, 511, 508),
    ),
    "business-gable": (
        rectangle(370, 356, 493, 516),
        rectangle(513, 364, 611, 516),
        ((115, 290), (168, 267), (189, 272), (137, 301)),
        ((193, 278), (249, 253), (277, 258), (220, 290)),
        ((287, 264), (344, 237), (374, 243), (315, 276)),
    ),
    "business-open": (
        ((15, 281), (397, 211), (414, 500), (18, 483)),
    ),
    "business-skillion": (
        ((72, 264), (397, 314), (397, 337), (72, 328)),
        rectangle(77, 344, 213, 509),
    ),
    "custom-barn": (
        rectangle(160, 282, 303, 357),
        rectangle(136, 375, 305, 552),
        rectangle(443, 295, 470, 363),
        rectangle(540, 309, 565, 373),
        rectangle(620, 324, 642, 382),
    ),
    "custom-custom": (
        rectangle(71, 347, 181, 516),
        ((239, 267), (460, 199), (570, 247), (570, 528), (239, 523)),
    ),
    "custom-gable": (
        rectangle(126, 363, 291, 552),
        rectangle(447, 394, 462, 471),
        rectangle(516, 404, 536, 475),
        rectangle(601, 411, 618, 479),
    ),
    "custom-open": (
        ((14, 281), (219, 190), (412, 236), (412, 503), (14, 486)),
    ),
    "custom-skillion": (
        ((110, 319), (320, 338), (320, 370), (110, 367)),
        rectangle(127, 379, 298, 576),
        rectangle(493, 404, 515, 488),
        rectangle(558, 412, 580, 491),
        rectangle(625, 419, 646, 494),
    ),
    "farm-barn": (
        rectangle(89, 266, 140, 329),
        ((145, 350), (260, 367), (260, 536), (145, 511)),
        rectangle(463, 390, 502, 457),
        rectangle(535, 378, 573, 448),
        rectangle(603, 366, 638, 438),
        rectangle(273, 165, 321, 221),
        rectangle(426, 172, 475, 227),
    ),
    "farm-custom": (
        rectangle(24, 357, 73, 416),
        rectangle(94, 372, 141, 431),
        rectangle(161, 382, 208, 442),
        rectangle(281, 390, 363, 462),
        rectangle(451, 420, 511, 495),
        ((589, 296), (704, 321), (704, 492), (589, 508)),
        rectangle(542, 204, 575, 246),
    ),
    "farm-gable": (
        ((8, 326), (169, 270), (393, 333), (393, 512), (8, 494)),
        rectangle(426, 349, 518, 494),
        rectangle(589, 352, 631, 420),
        rectangle(642, 338, 680, 404),
        ((493, 187), (544, 178), (573, 188), (522, 199)),
        ((587, 190), (635, 187), (662, 198), (614, 202)),
    ),
    "farm-open": (),
    "farm-skillion": (
        ((8, 278), (126, 244), (436, 305), (436, 526), (8, 493)),
        rectangle(523, 380, 564, 447),
        rectangle(578, 386, 617, 451),
        rectangle(632, 392, 670, 455),
        ((464, 218), (514, 225), (540, 237), (490, 230)),
        ((555, 234), (604, 242), (630, 253), (580, 247)),
    ),
    "home-barn": (
        rectangle(91, 375, 291, 575),
        rectangle(451, 389, 489, 466),
        rectangle(568, 391, 606, 469),
    ),
    "home-custom": (
        rectangle(78, 296, 258, 493),
        ((292, 235), (485, 159), (638, 221), (638, 519), (292, 513)),
    ),
    "home-gable": (
        rectangle(96, 342, 306, 566),
        rectangle(464, 379, 527, 471),
        rectangle(605, 383, 656, 470),
    ),
    "home-open": (
        ((7, 251), (180, 200), (405, 220), (405, 508), (7, 493)),
        rectangle(542, 301, 596, 399),
    ),
    "home-skillion": (
        rectangle(99, 341, 321, 589),
        rectangle(463, 378, 507, 470),
        rectangle(587, 381, 630, 472),
    ),
}

# These are genuine glass/open-interior areas whose highlights may be as light
# as the wall cladding. Everything else in FULL_PROTECTED_REGIONS is filtered
# by luminance so an imprecise rectangle can never leave a white box behind.
ALWAYS_PROTECTED_REGIONS: dict[str, tuple[Polygon, ...]] = {
    "business-barn": (
        rectangle(103, 348, 242, 526),
    ),
    "business-custom": (
        ((14, 280), (304, 211), (394, 258), (394, 503), (14, 482)),
        rectangle(440, 348, 511, 508),
    ),
    "business-gable": (
        rectangle(370, 356, 493, 516),
        rectangle(513, 364, 611, 516),
        ((115, 290), (168, 267), (189, 272), (137, 301)),
        ((193, 278), (249, 253), (277, 258), (220, 290)),
        ((287, 264), (344, 237), (374, 243), (315, 276)),
    ),
    "business-open": (
        ((78, 302), (397, 254), (414, 510), (78, 500)),
    ),
    "business-skillion": (
        ((74, 264), (396, 314), (396, 326), (74, 319)),
        rectangle(88, 344, 203, 509),
    ),
    "custom-barn": (
        rectangle(160, 282, 303, 357),
        rectangle(136, 375, 305, 552),
    ),
    "custom-custom": (
        rectangle(71, 347, 181, 516),
        ((239, 267), (460, 199), (570, 247), (570, 528), (239, 523)),
    ),
    "custom-gable": (
        rectangle(126, 363, 291, 552),
        rectangle(447, 394, 462, 471),
        rectangle(516, 404, 536, 475),
        rectangle(601, 411, 618, 479),
    ),
    "custom-open": (
        ((14, 294), (219, 209), (412, 250), (412, 520), (14, 502)),
    ),
    "custom-skillion": (
        ((110, 319), (320, 338), (320, 370), (110, 367)),
        rectangle(127, 379, 298, 576),
        rectangle(493, 404, 515, 488),
        rectangle(558, 412, 580, 491),
        rectangle(625, 419, 646, 494),
    ),
    "farm-barn": (
        ((145, 378), (260, 388), (260, 540), (145, 514)),
    ),
    "farm-gable": (
        ((45, 333), (127, 355), (127, 475), (45, 457)),
        ((135, 355), (223, 382), (223, 505), (135, 484)),
        ((231, 382), (334, 416), (334, 534), (231, 516)),
        rectangle(426, 349, 518, 494),
    ),
    "farm-custom": (
        rectangle(589, 296, 704, 510),
        rectangle(542, 204, 575, 246),
    ),
    "farm-open": (
        ((27, 275), (476, 343), (476, 540), (27, 510)),
    ),
    "farm-skillion": (
        ((73, 276), (445, 404), (445, 540), (73, 422)),
    ),
    "home-custom": (
        rectangle(78, 296, 258, 493),
        ((292, 235), (485, 159), (638, 221), (638, 519), (292, 513)),
    ),
    "home-barn": (
        rectangle(91, 375, 291, 575),
    ),
    "home-gable": (
        rectangle(96, 342, 306, 566),
    ),
    "home-open": (
        ((42, 249), (405, 235), (405, 520), (42, 504)),
    ),
    "home-skillion": (
        rectangle(99, 341, 321, 589),
    ),
}

# Personnel doors are isolated separately from wall/roof trim. Their darker
# blue shading must survive even when the source cladding is replaced.
DOOR_REGIONS: dict[str, tuple[Polygon, ...]] = {
    "business-barn": (rectangle(260, 370, 314, 528),),
    "business-custom": (rectangle(526, 398, 599, 520),),
    "business-gable": (rectangle(624, 378, 663, 510),),
    "business-open": (rectangle(438, 378, 485, 515),),
    "business-skillion": (rectangle(212, 425, 258, 532),),
    "custom-barn": (rectangle(314, 397, 381, 558),),
    "custom-custom": (rectangle(180, 394, 233, 528),),
    "custom-gable": (rectangle(320, 394, 378, 550),),
    "custom-skillion": (rectangle(322, 410, 391, 550),),
    "farm-barn": (rectangle(376, 402, 438, 560),),
    "farm-custom": (rectangle(214, 380, 268, 530),),
    "farm-gable": (rectangle(524, 378, 575, 520),),
    "farm-skillion": (rectangle(453, 399, 503, 545),),
    "home-barn": (rectangle(336, 392, 399, 555),),
    "home-gable": (rectangle(341, 386, 402, 550),),
    "home-open": (rectangle(435, 284, 504, 530),),
    "home-skillion": (rectangle(334, 384, 399, 550),),
}

# Some very light cladding is connected to the near-white studio backdrop in
# the source render and therefore cannot be recovered by flood fill alone.
# These small, source-specific silhouette repairs only add known wall area;
# the semantic protection masks below still cut the glazing and doors out.
FORCED_FINISH_REGIONS: dict[str, tuple[Polygon, ...]] = {
    "business-skillion": (
        ((55, 226), (400, 284), (400, 516), (55, 513)),
    ),
    "farm-barn": (
        rectangle(92, 318, 262, 372),
    ),
}


def connected_border_background(rgb: np.ndarray) -> np.ndarray:
    """Locate the pale studio background connected to an image border."""

    high = rgb.max(axis=2)
    low = rgb.min(axis=2)
    candidate = (high > 164) & ((high - low) < 74)
    height, width = candidate.shape
    seen = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[0, x]:
            queue.append((0, x))
        if candidate[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if candidate[y, 0]:
            queue.append((y, 0))
        if candidate[y, width - 1]:
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if seen[y, x] or not candidate[y, x]:
            continue
        seen[y, x] = True
        if y:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))
        if x:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))
    return seen


def orthogonal_subject_hull(foreground: np.ndarray) -> np.ndarray:
    """Repair pale walls that the background flood can enter through.

    A horizontal and vertical scan-line hull is conservative around a centred
    studio object while filling holes inside the building silhouette. Openings
    are subtracted later using explicit semantic mattes.
    """

    height, width = foreground.shape
    horizontal = np.zeros_like(foreground)
    vertical = np.zeros_like(foreground)

    for y in range(height):
        xs = np.flatnonzero(foreground[y])
        if xs.size >= 5:
            horizontal[y, xs[0] : xs[-1] + 1] = True

    for x in range(width):
        ys = np.flatnonzero(foreground[:, x])
        if ys.size >= 5:
            vertical[ys[0] : ys[-1] + 1, x] = True

    repaired = foreground | (horizontal & vertical)
    # Above the ground line, a studio shed is a single horizontal silhouette.
    # Using the scan-line hull here recovers pale cladding and prevents the
    # rectangular backdrop holes that used to appear around openings. The
    # lower 30% remains conservative so cast shadows/floor are never painted.
    upper_start = int(height * 0.32)
    upper_limit = int(height * 0.70)
    repaired[upper_start:upper_limit] |= horizontal[upper_start:upper_limit]
    return repaired


def protected_mask(source_key: str) -> np.ndarray:
    image = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(image)
    for region in PROTECTED_REGIONS.get(source_key, ()):
        draw.polygon(region, fill=255)
    # A tiny expansion protects antialiased door/window frames as well.
    image = image.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.65))
    return np.asarray(image).astype(np.float32) / 255


def full_protected_mask(source_key: str) -> np.ndarray:
    image = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(image)
    for region in FULL_PROTECTED_REGIONS.get(source_key, ()):
        draw.polygon(region, fill=255)
    image = image.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.55))
    return np.asarray(image).astype(np.float32) / 255


def always_protected_mask(source_key: str) -> np.ndarray:
    image = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(image)
    for region in ALWAYS_PROTECTED_REGIONS.get(source_key, ()):
        draw.polygon(region, fill=255)
    image = image.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.55))
    return np.asarray(image).astype(np.float32) / 255


def door_region_mask(source_key: str) -> np.ndarray:
    image = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(image)
    for region in DOOR_REGIONS.get(source_key, ()):
        draw.polygon(region, fill=255)
    return np.asarray(image).astype(np.float32) / 255


def forced_finish_mask(source_key: str) -> np.ndarray:
    image = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(image)
    for region in FORCED_FINISH_REGIONS.get(source_key, ()):
        draw.polygon(region, fill=255)
    image = image.filter(ImageFilter.GaussianBlur(0.55))
    return np.asarray(image).astype(np.float32) / 255


def smoothed_luminance(luminance: np.ndarray, radius: float) -> np.ndarray:
    image = Image.fromarray(np.clip(luminance * 255, 0, 255).astype(np.uint8))
    image = image.filter(ImageFilter.GaussianBlur(radius))
    return np.asarray(image).astype(np.float32) / 255


def trimdek_shading(height: int, width: int) -> np.ndarray:
    """Broad, restrained trapezoidal ribs without the source corrugations."""

    _, x = np.mgrid[:height, :width]
    rib = x % 31
    shade = np.ones((height, width), dtype=np.float32)
    shade = np.where(rib < 2, 0.86, shade)
    shade = np.where((rib >= 2) & (rib < 5), 1.075, shade)
    shade = np.where((rib >= 5) & (rib < 9), 0.975, shade)
    return shade


def prepare_source(
    source: Image.Image, profile: str, source_key: str
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    image = source.resize((SIZE, SIZE), Image.Resampling.LANCZOS).convert("RGB")
    rgb = np.asarray(image).astype(np.float32)
    rgb8 = rgb.astype(np.uint8)
    backdrop = connected_border_background(rgb8)
    foreground = orthogonal_subject_hull(~backdrop)
    value = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    saturation = value - minimum
    y = np.arange(SIZE)[:, None]

    luminance = (
        0.2126 * rgb[:, :, 0]
        + 0.7152 * rgb[:, :, 1]
        + 0.0722 * rgb[:, :, 2]
    ) / 255

    # Protect the signature blue trims automatically. Their hue is structural
    # detailing in the masters, not the user's selected wall finish.
    blue_detail = (
        (rgb[:, :, 2] > rgb[:, :, 0] + 28)
        & (rgb[:, :, 1] > rgb[:, :, 0] + 14)
        & (saturation > 55)
        & (value > 170)
    )
    # Semantic search regions are filtered by luminance so the door/window is
    # retained without preserving nearby pale cladding. Bright glass and open
    # interiors use tighter unconditional regions defined above.
    semantic_region = full_protected_mask(source_key)
    opening_strength = np.clip((122 - value) / 14, 0, 1)
    protected = semantic_region * opening_strength
    protected = np.maximum(protected, always_protected_mask(source_key))
    protected = np.maximum(protected, blue_detail.astype(np.float32))
    door_region = door_region_mask(source_key)
    door_blue = (
        (rgb[:, :, 2] > rgb[:, :, 0] + 9)
        & (rgb[:, :, 1] > rgb[:, :, 0] + 4)
        & (saturation > 16)
    )
    protected = np.maximum(
        protected, door_region * door_blue.astype(np.float32)
    )

    # Non-native profiles must also replace the dark valleys of the source
    # corrugation; excluding them is what created the old mixed vertical bars.
    value_floor = 30 if profile == "corrugated" else 8
    finish = (
        foreground
        & (y > SIZE * 0.14)
        & (y < SIZE * 0.82)
        & (value > value_floor)
    )
    finish_alpha = np.maximum(
        finish.astype(np.float32), forced_finish_mask(source_key)
    ) * (1 - protected)
    finish_alpha = np.asarray(
        Image.fromarray(np.clip(finish_alpha * 255, 0, 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(0.85)
        )
    ).astype(np.float32) / 255

    if profile == "corrugated":
        # The masters already contain the best-looking fine corrugation.
        material_luminance = luminance
        profile_shade = np.ones_like(luminance)
    elif profile == "trimdek":
        material_luminance = smoothed_luminance(luminance, 4.5)
        profile_shade = trimdek_shading(SIZE, SIZE)
    else:
        # Remove the native vertical ribs. Smooth architectural panels are far
        # more convincing than crossing those ribs with artificial seams.
        material_luminance = smoothed_luminance(luminance, 11.0)
        profile_shade = np.ones_like(luminance)

    return rgb, material_luminance, finish_alpha[..., None] * profile_shade[..., None]


def render_variant(
    prepared: tuple[np.ndarray, np.ndarray, np.ndarray], colour: str
) -> Image.Image:
    rgb, luminance, material_alpha = prepared
    target = np.array(
        tuple(int(colour[index : index + 2], 16) for index in (1, 3, 5)),
        dtype=np.float32,
    )

    # Low-frequency source luminance retains the expensive render's lighting
    # and volume. A small neutral contribution keeps highlights photographic.
    neutral = np.repeat(luminance[..., None] * 255, 3, axis=2)
    if colour.upper() == "#000000":
        # COLORBOND Night Sky is genuinely near-black. A photographic tonal
        # floor keeps the profile, seams and form readable without turning the
        # selected finish grey or changing the official UI swatch.
        night_value = 10 + luminance[..., None] * 52
        coloured = np.repeat(night_value, 3, axis=2)
        coloured += np.array([0, 1.5, 3.0], dtype=np.float32)
    else:
        light = (0.40 + luminance * 0.88)[..., None]
        coloured = np.clip(target[None, None, :] * light, 0, 255)
        coloured = coloured * 0.90 + neutral * 0.10

    result = rgb * (1 - material_alpha) + coloured * material_alpha
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGB").filter(
        ImageFilter.UnsharpMask(radius=0.8, percent=28, threshold=4)
    )


def selected(value: str | None, values: Sequence[str]) -> Sequence[str]:
    return (value,) if value else values


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate protected, high-quality shed catalogue renders."
    )
    parser.add_argument("--purpose", choices=PURPOSES)
    parser.add_argument("--style", choices=STYLES)
    parser.add_argument("--profile", choices=PROFILES)
    parser.add_argument("--colour", choices=tuple(COLOURS))
    parser.add_argument("--quality", type=int, default=86)
    parser.add_argument("--method", type=int, choices=range(7), default=3)
    parser.add_argument(
        "--show", action="store_true", help="Open the first generated image."
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    purposes = selected(args.purpose, PURPOSES)
    styles = selected(args.style, STYLES)
    profiles = selected(args.profile, PROFILES)
    colours = selected(args.colour, tuple(COLOURS))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    generated: list[Path] = []

    for purpose in purposes:
        for style in styles:
            source_key = f"{purpose}-{style}"
            source_path = SOURCE / f"{source_key}.png"
            if not source_path.exists():
                raise FileNotFoundError(f"Missing concept master: {source_path}")
            source = Image.open(source_path)
            for profile in profiles:
                prepared = prepare_source(source, profile, source_key)
                folder = OUTPUT / purpose / style / profile
                folder.mkdir(parents=True, exist_ok=True)
                for slug in colours:
                    destination = folder / f"{slug}.webp"
                    render_variant(prepared, COLOURS[slug]).save(
                        destination,
                        "WEBP",
                        quality=max(1, min(100, args.quality)),
                        method=args.method,
                    )
                    generated.append(destination)

    print(f"Generated {len(generated)} protected catalogue render(s) in {OUTPUT}")
    if args.show and generated:
        Image.open(generated[0]).show()


if __name__ == "__main__":
    main()
