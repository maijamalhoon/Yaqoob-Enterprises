from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


def resolve_internal_link(source: Path, href: str) -> Path | None:
    if href.startswith(("http://", "https://", "tel:", "mailto:", "#")):
        return None
    path = href.split("#", 1)[0].split("?", 1)[0]
    if not path:
        return None
    target = ROOT / path.lstrip("/") if path.startswith("/") else source.parent / path
    if path.endswith("/") or target.is_dir():
        target /= "index.html"
    return target


def main() -> None:
    html_files = sorted(ROOT.rglob("*.html"))
    assert len(html_files) >= 10, "Expected homepage, contact, privacy and service pages"

    titles: dict[str, Path] = {}
    errors: list[str] = []

    for page in html_files:
        soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
        title = soup.title.get_text(strip=True) if soup.title else ""
        if not title:
            errors.append(f"{page}: missing title")
        elif title in titles:
            errors.append(f"{page}: duplicate title also used by {titles[title]}")
        else:
            titles[title] = page

        if len(soup.find_all("h1")) != 1:
            errors.append(f"{page}: must contain exactly one h1")
        if not soup.find("meta", attrs={"name": "description"}):
            errors.append(f"{page}: missing meta description")
        if not soup.find("link", rel="canonical"):
            errors.append(f"{page}: missing canonical link")
        if not soup.find("script", attrs={"type": "application/ld+json"}):
            errors.append(f"{page}: missing JSON-LD")
        if not soup.find("a", class_="skip-link"):
            errors.append(f"{page}: missing skip link")

        for link in soup.find_all("a", href=True):
            target = resolve_internal_link(page, link["href"])
            if target is not None and not target.exists():
                errors.append(f"{page}: broken link {link['href']} -> {target}")

    contact = BeautifulSoup((ROOT / "contact/index.html").read_text(encoding="utf-8"), "html.parser")
    form = contact.find("form", attrs={"data-whatsapp-form": True})
    if not form:
        errors.append("contact page: WhatsApp request form missing")
    for field_id in ("name", "service", "mode", "details"):
        if not contact.find(id=field_id):
            errors.append(f"contact page: missing field {field_id}")

    if errors:
        raise AssertionError("\n".join(errors))

    print(f"PASS: {len(html_files)} HTML pages validated; internal links, SEO basics and contact form are present.")


if __name__ == "__main__":
    main()
