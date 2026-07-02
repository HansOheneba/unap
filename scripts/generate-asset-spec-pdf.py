#!/usr/bin/env python3
"""Generate Unapologetic client asset specification PDF."""

from pathlib import Path

from fpdf import FPDF

OUTPUT = Path(__file__).resolve().parent.parent / "docs" / "Unapologetic_Asset_Specifications.pdf"


class SpecPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(30, 30, 30)
        self.cell(0, 8, "Unapologetic - Creative Asset Specifications", align="L")
        self.ln(10)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def section_title(self, title: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(0, 0, 0)
        self.cell(0, 8, title)
        self.ln(8)

    def body(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def table_header(self, widths, headers):
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(240, 240, 240)
        self.set_text_color(0, 0, 0)
        for w, h in zip(widths, headers):
            self.cell(w, 8, h, border=1, fill=True)
        self.ln()

    def table_row(self, widths, cells):
        self.set_font("Helvetica", "", 9)
        self.set_text_color(40, 40, 40)
        for w, c in zip(widths, cells):
            self.cell(w, 8, c, border=1)
        self.ln()


def build_pdf() -> None:
    pdf = SpecPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    pdf.body(
        "Document purpose: Define required video and photography assets for the "
        "Unapologetic storefront home page and collections experience. "
        "All assets listed below are required for launch-ready presentation."
    )

    pdf.section_title("1. Hero Videos")

    pdf.body("1.1 Home Page Hero (full viewport)")
    pdf.table_header([52, 138], ["Specification", "Requirement"])
    for row in [
        ("Placement", "Home page, full-screen section (100vh x 100vw)"),
        ("Quantity", "3 clips (rotating sequence)"),
        ("Format", "MP4, H.264 codec"),
        ("Dimensions", "1920 x 1080 px minimum (16:9)"),
        ("Recommended", "2560 x 1440 px (16:9)"),
        ("Duration", "5 to 15 seconds per clip"),
        ("Audio", "None (muted playback)"),
        ("File size", "5 to 15 MB per clip (web-optimized)"),
        ("Display mode", "object-cover (edges cropped on some viewports)"),
        ("Framing", "Subject centered in middle 60% of frame"),
    ]:
        pdf.table_row([52, 138], row)

    pdf.ln(4)
    pdf.body("1.2 Collections Page Hero (cinematic strip)")
    pdf.table_header([52, 138], ["Specification", "Requirement"])
    for row in [
        ("Placement", "Collections overview page top strip (~52vh x 100vw)"),
        ("Quantity", "1 clip (looping)"),
        ("Format", "MP4, H.264 codec"),
        ("Dimensions", "1920 x 1080 px minimum (16:9)"),
        ("Recommended", "2560 x 1080 px (21:9) or 2560 x 1440 px (16:9)"),
        ("Duration", "5 to 15 seconds (seamless loop preferred)"),
        ("Audio", "None (muted playback)"),
        ("File size", "5 to 15 MB (web-optimized)"),
        ("Display mode", "object-cover (wide crop)"),
        ("Framing", "Horizontal and vertical center; avoid tall compositions"),
    ]:
        pdf.table_row([52, 138], row)

    pdf.ln(4)
    pdf.body("1.3 Video delivery filenames")
    pdf.table_header([95, 95], ["Filename", "Usage"])
    for row in [
        ("home-hero-01.mp4", "Home page hero, clip 1"),
        ("home-hero-02.mp4", "Home page hero, clip 2"),
        ("home-hero-03.mp4", "Home page hero, clip 3"),
        ("collections-hero.mp4", "Collections page hero strip"),
    ]:
        pdf.table_row([95, 95], row)

    pdf.add_page()
    pdf.section_title("2. Collection Banner Images")

    pdf.body("2.1 Global image specifications (all collections)")
    pdf.table_header([52, 138], ["Specification", "Requirement"])
    for row in [
        ("Placement", "Collections overview + individual collection pages"),
        ("Quantity", "1 hero image per collection (7 total)"),
        ("Format", "JPEG or WebP"),
        ("Dimensions", "1920 x 1080 px minimum (16:9)"),
        ("Recommended", "2560 x 1440 px (16:9)"),
        ("Retina option", "2880 x 1620 px or 3200 x 1800 px (16:9)"),
        ("Orientation", "Landscape only"),
        ("Quality", "80 to 85% compression"),
        ("Display mode", "object-cover with text and gradient overlays"),
        ("Overview height", "~78vh full width"),
        ("Collection page height", "~65vh full width"),
        ("Framing", "Keep bottom 30% clear for title, tagline, CTA"),
        ("Framing", "Avoid key detail in bottom corners (gradient zones)"),
    ]:
        pdf.table_row([52, 138], row)

    pdf.ln(4)
    pdf.section_title("2.2 Required collection banners")

    pdf.table_header(
        [12, 32, 48, 38, 60],
        ["#", "Collection", "Campaign Title", "Dimensions", "Filename"],
    )
    collections = [
        ("1", "Underwear", "The Second Skin", "2560 x 1440 px", "01-underwear.jpg"),
        ("2", "Tops", "The Anti-Uniform", "2560 x 1440 px", "02-tops.jpg"),
        ("3", "Bottoms", "Grounded Power", "2560 x 1440 px", "03-bottoms.jpg"),
        ("4", "Tracksuits", "Street Sovereign", "2560 x 1440 px", "04-tracksuits.jpg"),
        ("5", "Active Wear", "No Retreat", "2560 x 1440 px", "05-active-wear.jpg"),
        ("6", "Sunglasses", "The Eclipse Edit", "2560 x 1440 px", "06-sunglasses.jpg"),
        ("7", "Accessories", "Bold Society", "2560 x 1440 px", "07-accessories.jpg"),
    ]
    for row in collections:
        pdf.table_row([12, 32, 48, 38, 60], row)

    pdf.ln(4)
    pdf.section_title("2.3 Collection reference (creative direction)")

    pdf.table_header([38, 55, 97], ["Collection", "Campaign Title", "Tagline"])
    taglines = [
        ("Underwear", "The Second Skin", "What you wear underneath sets the tone for everything above it."),
        ("Tops", "The Anti-Uniform", "Move in silence. Let the fabric do the talking."),
        ("Bottoms", "Grounded Power", "Every step is a statement. Every stride is intentional."),
        ("Tracksuits", "Street Sovereign", "Built for motion. Designed for presence."),
        ("Active Wear", "No Retreat", "Performance without apology. Movement without compromise."),
        ("Sunglasses", "The Eclipse Edit", "The world looks different when you stop apologizing for the view."),
        ("Accessories", "Bold Society", "The details that finish the statement."),
    ]
    for row in taglines:
        pdf.table_row([38, 55, 97], row)

    pdf.ln(6)
    pdf.section_title("3. Delivery Summary")

    pdf.table_header([95, 95], ["Asset", "Quantity"])
    for row in [
        ("Home page hero videos", "3"),
        ("Collections page hero video", "1"),
        ("Collection banner images", "7"),
        ("Total video files", "4"),
        ("Total image files", "7"),
    ]:
        pdf.table_row([95, 95], row)

    pdf.ln(4)
    pdf.section_title("4. Folder Structure")

    pdf.set_font("Courier", "", 9)
    pdf.set_text_color(40, 40, 40)
    structure = (
        "unapologetic-assets/\n"
        "  videos/\n"
        "    home-hero-01.mp4\n"
        "    home-hero-02.mp4\n"
        "    home-hero-03.mp4\n"
        "    collections-hero.mp4\n"
        "  collection-banners/\n"
        "    01-underwear.jpg\n"
        "    02-tops.jpg\n"
        "    03-bottoms.jpg\n"
        "    04-tracksuits.jpg\n"
        "    05-active-wear.jpg\n"
        "    06-sunglasses.jpg\n"
        "    07-accessories.jpg"
    )
    pdf.multi_cell(0, 5, structure)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT))
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build_pdf()
