"""Pre-render configurator options as real WebP images.

Run with the bundled/Pillow Python runtime from the repository root. The
website never colourises a shed in the browser: it only swaps these files.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "concepts"
OUTPUT = ROOT / "public" / "configurator"
SIZE = 720

COLOURS = {
    "monument": "#323333",
    "surfmist": "#D7D8CF",
    "woodland-grey": "#4C514B",
    "night-sky": "#16191B",
    "shale-grey": "#B4B4AC",
    "basalt": "#6D6E6C",
    "dune": "#B1A994",
    "pale-eucalypt": "#7C8B79",
    "ironstone": "#3E4B5B",
    "deep-ocean": "#254C62",
    "manor-red": "#6F3031",
    "classic-cream": "#D8CDA6",
}

PROFILES = ("corrugated", "trimdek", "architectural-panel")


def connected_border_background(rgb: np.ndarray) -> np.ndarray:
    """Find the pale studio backdrop connected to an image border."""
    high = rgb.max(axis=2)
    low = rgb.min(axis=2)
    candidate = (high > 166) & ((high - low) < 72)
    h, w = candidate.shape
    seen = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        if candidate[0, x]: queue.append((0, x))
        if candidate[h - 1, x]: queue.append((h - 1, x))
    for y in range(h):
        if candidate[y, 0]: queue.append((y, 0))
        if candidate[y, w - 1]: queue.append((y, w - 1))

    while queue:
        y, x = queue.popleft()
        if seen[y, x] or not candidate[y, x]:
            continue
        seen[y, x] = True
        if y: queue.append((y - 1, x))
        if y + 1 < h: queue.append((y + 1, x))
        if x: queue.append((y, x - 1))
        if x + 1 < w: queue.append((y, x + 1))
    return seen


def profile_shading(profile: str, h: int, w: int) -> np.ndarray:
    yy, xx = np.mgrid[:h, :w]
    if profile == "corrugated":
        shade = .94 + .09 * np.sin(xx * np.pi / 7.5)
    elif profile == "trimdek":
        rib = xx % 27
        shade = np.where(rib < 3, .79, np.where(rib < 6, 1.08, .97))
    else:
        seam = yy % 38
        shade = np.where(seam < 2, .79, np.where(seam < 5, 1.05, .98))
    return shade[..., None]


def prepare_source(source: Image.Image, profile: str) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    image = source.resize((SIZE, SIZE), Image.Resampling.LANCZOS).convert("RGB")
    rgb = np.asarray(image).astype(np.float32)
    backdrop = connected_border_background(rgb.astype(np.uint8))
    value = rgb.max(axis=2)
    saturation = value - rgb.min(axis=2)
    y = np.arange(SIZE)[:, None]

    # Studio concepts all contain a centred building. Restrict colour work to
    # the isolated subject and keep glazing/deep structural shadows intact.
    subject = ~backdrop
    finish = subject & (y > SIZE * .20) & (y < SIZE * .91) & (value > 48)
    finish &= (saturation < 150) | ((rgb[:, :, 2] - rgb[:, :, 0]) > 12)

    luminance = (.2126 * rgb[:, :, 0] + .7152 * rgb[:, :, 1] + .0722 * rgb[:, :, 2]) / 255
    feather = Image.fromarray((finish * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
    alpha = np.asarray(feather).astype(np.float32)[..., None] / 255
    return rgb, luminance, alpha, profile_shading(profile, SIZE, SIZE)


def render_variant(prepared: tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray], colour: str) -> Image.Image:
    rgb, luminance, alpha, shading = prepared
    target = np.array(tuple(int(colour[i:i + 2], 16) for i in (1, 3, 5)), dtype=np.float32)
    light = (.34 + luminance * .91)[..., None]
    coloured = np.clip(target[None, None, :] * light, 0, 255)
    coloured *= shading

    # Retain a small amount of the source's neutral texture so edges, seams,
    # reflections and natural shading remain photographic.
    neutral = np.repeat(luminance[..., None] * 255, 3, axis=2)
    coloured = coloured * .84 + neutral * .16
    result = rgb.copy()
    result = result * (1 - alpha) + coloured * alpha
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGB")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for source_path in sorted(SOURCE.glob("*.png")):
        purpose, style = source_path.stem.split("-", 1)
        source = Image.open(source_path)
        for profile in PROFILES:
            prepared = prepare_source(source, profile)
            folder = OUTPUT / purpose / style / profile
            folder.mkdir(parents=True, exist_ok=True)
            for slug, colour in COLOURS.items():
                destination = folder / f"{slug}.webp"
                if destination.exists():
                    total += 1
                    continue
                render_variant(prepared, colour).save(
                    destination, "WEBP", quality=74, method=2
                )
                total += 1
    print(f"Generated {total} configurator renders in {OUTPUT}")


if __name__ == "__main__":
    main()
