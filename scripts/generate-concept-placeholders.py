"""Generate the 20 temporary shed-builder concept images.

Each file is a 900 x 900 WebP. Replace it with a SketchUp render using the
same filename and dimensions; no code changes are required.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "concepts"
SIZE = 900

PURPOSES = {
    "home": "HOME / GARAGE & WORKSHOP",
    "farm": "FARM / MACHINERY",
    "business": "BUSINESS / COMMERCIAL",
    "other": "OTHER / SPECIAL-PURPOSE",
}

STYLES = {
    "gable": "GABLE",
    "skillion": "SKILLION",
    "barn": "AUSTRALIAN AMERICAN BARN",
    "open": "OPEN-FRONT",
    "custom": "BESPOKE FORM",
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


def line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], width: int = 7) -> None:
    draw.line(points, fill="#16394a", width=width, joint="curve")


def draw_grid(draw: ImageDraw.ImageDraw) -> None:
    for x in range(50, SIZE, 50):
        draw.line((x, 205, x, 760), fill="#dce8ed", width=1)
    for y in range(210, 761, 50):
        draw.line((40, y, 860, y), fill="#dce8ed", width=1)


def draw_building(draw: ImageDraw.ImageDraw, style: str) -> None:
    wall = "#dce8ec"
    side = "#c5d7de"
    roof = "#9cb5c0"
    dark = "#16394a"
    shadow = "#b7cbd3"

    draw.ellipse((135, 635, 790, 710), fill="#d4e1e6")

    if style == "barn":
        # Australian American barn: raised central bay plus a lean-to on each side.
        front = [(155, 470), (250, 425), (330, 335), (410, 425), (515, 470), (515, 650), (155, 650)]
        depth = (245, -80)
        side_face = [(515, 470), (760, 390), (760, 570), (515, 650)]
        roof_face = [(330, 335), (575, 275), (655, 355), (410, 425)]
        right_lean = [(410, 425), (655, 355), (760, 390), (515, 470)]
        left_lean = [(155, 470), (250, 425), (495, 365), (400, 410)]
        draw.polygon(side_face, fill=side)
        draw.polygon(roof_face, fill=roof)
        draw.polygon(right_lean, fill="#aec3cb")
        draw.polygon(left_lean, fill="#b9cbd2")
        draw.polygon(front, fill=wall)
        line(draw, front + [front[0]])
        line(draw, side_face + [side_face[0]])
        line(draw, roof_face + [roof_face[0]])
        line(draw, right_lean)
        line(draw, left_lean)
        line(draw, [(250, 425), (250, 650)])
        line(draw, [(410, 425), (410, 650)])
        draw.rectangle((280, 475, 382, 650), fill=shadow, outline=dark, width=7)
        for y in range(495, 650, 23):
            draw.line((286, y, 376, y), fill="#7f9aa5", width=3)
        return

    front_left, front_right = 175, 465
    front_floor = 650
    side_end = (745, 560)

    if style == "gable":
        front = [(front_left, 430), (320, 335), (front_right, 430), (front_right, front_floor), (front_left, front_floor)]
        side_face = [(front_right, 430), (745, 350), side_end, (front_right, front_floor)]
        roof_face = [(320, 335), (600, 270), (745, 350), (front_right, 430)]
    elif style == "skillion":
        front = [(front_left, 360), (front_right, 415), (front_right, front_floor), (front_left, front_floor)]
        side_face = [(front_right, 415), (745, 335), side_end, (front_right, front_floor)]
        roof_face = [(front_left, 360), (455, 290), (745, 335), (front_right, 415)]
    elif style == "open":
        front = [(front_left, 430), (320, 335), (front_right, 430), (front_right, front_floor), (front_left, front_floor)]
        side_face = [(front_right, 430), (745, 350), side_end, (front_right, front_floor)]
        roof_face = [(320, 335), (600, 270), (745, 350), (front_right, 430)]
    else:
        front = [(front_left, 405), (340, 330), (front_right, 390), (front_right, front_floor), (front_left, front_floor)]
        side_face = [(front_right, 390), (745, 315), side_end, (front_right, front_floor)]
        roof_face = [(front_left, 405), (455, 300), (745, 315), (front_right, 390)]

    draw.polygon(side_face, fill=side)
    draw.polygon(roof_face, fill=roof)
    draw.polygon(front, fill=wall)
    line(draw, front + [front[0]])
    line(draw, side_face + [side_face[0]])
    line(draw, roof_face + [roof_face[0]])

    if style == "open":
        draw.polygon([(195, 445), (320, 370), (445, 445), (445, 625), (195, 625)], fill=dark)
        line(draw, [(195, 625), (195, 445), (320, 370), (445, 445), (445, 625)])
        line(draw, [(320, 370), (320, 625)], width=5)
    else:
        draw.rectangle((220, 470, 395, 650), fill=shadow, outline=dark, width=7)
        for y in range(493, 650, 25):
            draw.line((227, y, 388, y), fill="#7f9aa5", width=3)

    line(draw, [(555, 405), (555, 620)], width=4)
    line(draw, [(650, 380), (650, 590)], width=4)


def create_placeholder(purpose: str, style: str) -> Image.Image:
    image = Image.new("RGB", (SIZE, SIZE), "#edf4f7")
    draw = ImageDraw.Draw(image)
    draw_grid(draw)
    draw.rectangle((0, 0, SIZE, 16), fill="#19a7d5")
    draw.text((46, 49), "SKETCHUP MASTER PLACEHOLDER", fill="#1189b2", font=font(18, True))
    draw.text((46, 82), PURPOSES[purpose], fill="#16394a", font=font(27, True))
    draw.text((46, 122), STYLES[style], fill="#16394a", font=font(43, True))
    draw_building(draw, style)
    filename = f"{purpose}-{style}.webp"
    draw.rounded_rectangle((45, 780, 855, 855), radius=8, fill="#0a2635")
    draw.text((72, 799), "REPLACE WITH YOUR 900 × 900 WEBP", fill="#ffffff", font=font(20, True))
    right = draw.textbbox((0, 0), filename, font=font(18))[2]
    draw.text((825 - right, 803), filename, fill="#91d9ef", font=font(18))
    return image


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for purpose in PURPOSES:
        for style in STYLES:
            destination = OUTPUT / f"{purpose}-{style}.webp"
            create_placeholder(purpose, style).save(destination, "WEBP", quality=90, method=6)
    print(f"Generated 20 placeholders in {OUTPUT}")


if __name__ == "__main__":
    main()
