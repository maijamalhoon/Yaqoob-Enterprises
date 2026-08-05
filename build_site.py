from pathlib import Path
from html import escape
from urllib.parse import quote
import json

ROOT = Path(__file__).resolve().parent
SITE_URL = "https://yaqoob-enterprises.vercel.app"
PHONE_DISPLAY = "+92 349 2568864"
PHONE_TEL = "+923492568864"
WHATSAPP = "https://wa.me/923492568864"
MAPS = "https://maps.app.goo.gl/hui54LEXRjMeWxme9"
ADDRESS = "Plot No. 7, Street No. 1, Sector B, Akhtar Colony, Karachi 75500, Pakistan"
MAP_EMBED = "https://www.google.com/maps?q=" + quote(ADDRESS) + "&output=embed"

SERVICES = [
    {
        "slug": "printing-photocopy",
        "title": "Printing & Photocopy",
        "short": "Black-and-white and colour printing, photocopying, document scanning and print-ready orders through WhatsApp.",
        "meta": "Photocopy, colour printing, document scanning and WhatsApp print orders in Akhtar Colony, Karachi. Pickup and delivery options available.",
        "h1": "Printing and photocopy services in Akhtar Colony, Karachi",
        "lead": "Send your documents on WhatsApp, confirm the print settings, and choose shop pickup or delivery where available.",
        "icon": "print",
        "keywords": "photocopy shop Akhtar Colony, colour printing Karachi, print shop near me, WhatsApp printing Karachi",
        "sections": [
            ("Printing that fits the job", [
                "Black-and-white and colour printing for documents, forms, notes, CVs, applications and general office work.",
                "Photocopying, scanning and document preparation for everyday personal and business requirements.",
                "Before printing, customers can confirm page size, colour mode, number of copies and finishing requirements on WhatsApp."
            ]),
            ("Order from home", [
                "Send the file and instructions through WhatsApp.",
                "We review the file, confirm availability and estimated charges.",
                "Collect from the shop or request delivery in eligible nearby areas."
            ]),
        ],
        "note": "Delivery depends on location, order size, timing and availability. Final charges are confirmed before work begins.",
        "faq": [
            ("Can I send a PDF or image on WhatsApp?", "Yes. Send the file with page size, colour preference, number of copies and pickup or delivery preference."),
            ("Can my prints be delivered?", "Delivery may be arranged in eligible nearby areas after confirming location, timing and charges."),
            ("Do you print job applications and online forms?", "Yes. We can help prepare, download and print forms and supporting documents."),
        ],
    },
    {
        "slug": "biometric-verification",
        "title": "Biometric Verification",
        "short": "NADRA e-Sahulat biometric verification at the shop and mobile visits by appointment for eligible services.",
        "meta": "NADRA e-Sahulat biometric verification in Akhtar Colony, Karachi, including mobile biometric visits by appointment for eligible services.",
        "h1": "NADRA e-Sahulat biometric verification in Karachi",
        "lead": "Visit the shop or request a mobile biometric appointment. We bring the biometric device and laptop for eligible services.",
        "icon": "fingerprint",
        "keywords": "NADRA e Sahulat biometric Karachi, biometric verification Akhtar Colony, mobile biometric service Karachi, vehicle biometric verification",
        "sections": [
            ("Shop and mobile biometric service", [
                "Biometric verification is available at Yaqoob Enterprises after opening.",
                "For customers who cannot conveniently visit, a mobile visit may be arranged by appointment in eligible areas.",
                "The biometric device and laptop are brought to the customer location, subject to service eligibility, network availability and verification requirements."
            ]),
            ("Vehicle buyer and seller verification", [
                "Assistance for buyer and seller biometric verification related to eligible vehicle transactions.",
                "Customers should confirm the required original documents and presence requirements before booking.",
                "We will explain the process and confirm what can be completed at the shop or at the customer location."
            ]),
        ],
        "note": "Biometric completion depends on valid identification, required persons, official system availability and the rules applicable to the requested service.",
        "faq": [
            ("Can you come to my home for biometric verification?", "Yes, mobile biometric visits can be arranged by appointment for eligible services and covered areas."),
            ("What should I send before booking?", "Send the service type, area, preferred time and basic requirement on WhatsApp. Do not send sensitive document details until requested through an appropriate channel."),
            ("Is completion guaranteed?", "No. Completion depends on valid documents, required persons, official system availability and service eligibility."),
        ],
    },
    {
        "slug": "online-forms-typing",
        "title": "Online Forms & Typing",
        "short": "Online applications, job forms, registrations, Urdu and English typing, document formatting and printing.",
        "meta": "Online form filling, job applications, Urdu and English typing and document formatting in Akhtar Colony, Karachi.",
        "h1": "Online forms, job applications and typing services",
        "lead": "Get help with online applications, registrations, document typing and print-ready formatting in English and Urdu.",
        "icon": "forms",
        "keywords": "online form filling Karachi, job application form shop, Urdu typing Akhtar Colony, English typing Karachi",
        "sections": [
            ("Online application assistance", [
                "Job vacancy applications, admissions, registrations and other public or private online forms.",
                "Uploading documents, resizing files and preparing supporting information where required.",
                "Customers remain responsible for reviewing and approving all submitted information before final submission."
            ]),
            ("Urdu and English typing", [
                "Letters, applications, lists, agreements, notices, forms and general documents.",
                "Basic formatting, page setup and print-ready preparation.",
                "Bring handwritten material or send clear content on WhatsApp for review."
            ]),
        ],
        "note": "We enter information provided by the customer. Customers should verify names, identification numbers, dates and other critical details before submission.",
        "faq": [
            ("Can you fill a job application for me?", "Yes. Bring or send the vacancy details and required documents. We will confirm the process and charges first."),
            ("Do you type Urdu documents?", "Yes. Urdu and English typing and basic document formatting are available."),
            ("Can you submit forms without me visiting?", "Some forms may be prepared remotely, but submissions requiring original documents, signatures, payments or personal verification may require your involvement."),
        ],
    },
    {
        "slug": "payments-utility-bills",
        "title": "Payments & Utility Bills",
        "short": "JazzCash, Easypaisa, utility bill payments and supported digital payment services at one counter.",
        "meta": "JazzCash, Easypaisa and utility bill payment services in Akhtar Colony, Karachi at Yaqoob Enterprises.",
        "h1": "JazzCash, Easypaisa and utility bill payments",
        "lead": "Complete supported payments at the shop with clear confirmation before leaving the counter.",
        "icon": "payments",
        "keywords": "JazzCash Akhtar Colony, Easypaisa shop Karachi, utility bills payment near me",
        "sections": [
            ("Everyday payment services", [
                "JazzCash and Easypaisa services supported by the active retailer setup.",
                "Utility bill payments and other available over-the-counter payment services.",
                "Transaction availability and limits depend on the relevant provider and account status."
            ]),
            ("Check before you leave", [
                "Confirm the recipient number, account reference and amount before authorising a transaction.",
                "Collect or save the transaction receipt and verify the status.",
                "Never share PINs or one-time passwords with anyone."
            ]),
        ],
        "note": "Provider limits, fees, system availability and identity requirements may apply to individual transactions.",
        "faq": [
            ("Can I pay utility bills here?", "Yes, supported utility bills can be paid at the shop after opening."),
            ("Do you provide JazzCash and Easypaisa services?", "Yes, available services will depend on the active retailer account and provider rules."),
            ("Should I share my PIN?", "No. Never share your PIN, password or one-time code with staff or any other person."),
        ],
    },
    {
        "slug": "agreements-documentation",
        "title": "Agreements & Documentation",
        "short": "Typing and preparation support for sale, rent, bayana, partial-payment and vehicle agreements on stamp paper.",
        "meta": "Typing and documentation support for rent, sale, bayana, partial payment and vehicle agreements in Akhtar Colony, Karachi.",
        "h1": "Stamp paper agreements and document preparation",
        "lead": "We prepare agreements from the information supplied by the parties and format them for stamp paper and printing.",
        "icon": "agreement",
        "keywords": "stamp paper agreement Karachi, rent agreement typing, bayana agreement Akhtar Colony, vehicle sale agreement",
        "sections": [
            ("Documents we can prepare", [
                "Sale, purchase, rent, bayana, partial-payment and vehicle-related agreements.",
                "Urdu or English typing, formatting and printing based on the details provided by the parties.",
                "Corrections can be made before final printing after both parties review the draft."
            ]),
            ("Review before signing", [
                "Names, identification details, amounts, dates, asset information and payment terms must be checked carefully.",
                "Both parties should understand the document before signing.",
                "For complex, disputed or high-value transactions, independent legal advice is recommended."
            ]),
        ],
        "note": "Yaqoob Enterprises provides typing and document preparation assistance, not legal representation or legal advice.",
        "faq": [
            ("Can you prepare a rent agreement?", "Yes. Provide the agreed terms and identification details for both parties. A draft should be reviewed before final printing."),
            ("Do you prepare vehicle sale agreements?", "Yes, vehicle sale and purchase documentation can be typed from the information provided by the parties."),
            ("Do you provide legal advice?", "No. We provide typing and documentation assistance. Seek a qualified lawyer for legal advice or disputed matters."),
        ],
    },
    {
        "slug": "ticket-booking",
        "title": "Ticket Booking",
        "short": "Train, bus and airline ticket booking assistance by phone, WhatsApp or at the shop.",
        "meta": "Train, bus and airline ticket booking assistance by phone, WhatsApp or in person in Akhtar Colony, Karachi.",
        "h1": "Train, bus and airline ticket booking assistance",
        "lead": "Call or message with your route, date and passenger details. We will review available options before booking.",
        "icon": "ticket",
        "keywords": "train ticket booking Karachi, bus ticket booking Akhtar Colony, airline ticket booking near me",
        "sections": [
            ("Book by phone, WhatsApp or in person", [
                "Share the departure city, destination, travel date, number of passengers and preferred timing.",
                "We review available options and confirm fare, operator, baggage or seat details before booking.",
                "The booking is completed only after the customer approves the selected option and payment terms."
            ]),
            ("Check passenger details carefully", [
                "Passenger names and identification details must match the relevant travel documents.",
                "Schedules, fares, availability and cancellation rules are controlled by the transport operator.",
                "Keep the final ticket and booking reference accessible while travelling."
            ]),
        ],
        "note": "Ticket prices, schedules, seat availability and cancellation rules can change and are controlled by the relevant airline, railway or bus operator.",
        "faq": [
            ("Can I book a ticket by phone?", "Yes. Call or message with your route and travel date. The booking is completed after you approve the available option."),
            ("Do you book train, bus and airline tickets?", "Yes, booking assistance is available for supported operators and routes."),
            ("Can ticket prices change?", "Yes. Fares and availability can change until a booking is confirmed and paid."),
        ],
    },
    {
        "slug": "stationery-mobile-accessories",
        "title": "Stationery & Mobile Accessories",
        "short": "Practical stationery, registers, journals, office supplies and selected everyday mobile accessories.",
        "meta": "Stationery, registers, journals, office supplies and selected mobile accessories in Akhtar Colony, Karachi.",
        "h1": "Stationery and mobile accessories in Akhtar Colony",
        "lead": "Find practical school, office and everyday supplies alongside selected mobile accessories.",
        "icon": "stationery",
        "keywords": "stationery shop Akhtar Colony, registers journals Karachi, mobile accessories near me",
        "sections": [
            ("Stationery and office supplies", [
                "Registers, journals, notebooks, files, paper and other general-use stationery.",
                "Useful supplies for students, homes, shops and offices.",
                "Stock will expand based on customer demand after opening."
            ]),
            ("Selected mobile accessories", [
                "Common everyday accessories selected for practical local demand.",
                "Availability, compatibility and warranty vary by item.",
                "Customers should confirm device model and compatibility before purchase."
            ]),
        ],
        "note": "Product availability can vary. Contact us before visiting when you need a specific item or device-compatible accessory.",
        "faq": [
            ("Do you sell school books?", "The main focus is stationery and general supplies such as registers, journals, notebooks and office items rather than a full bookshop range."),
            ("Can I ask about stock on WhatsApp?", "Yes. Send the item name or a clear reference and we will confirm current availability."),
            ("Do you sell mobile accessories?", "Yes, selected everyday mobile accessories will be available after opening."),
        ],
    },
]

ICONS = {
    "whatsapp": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.4L3 20.3l1.3-4.6A8.5 8.5 0 1 1 20.5 11.6Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.2 7.7c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.9 1.3 1.7 2.2 2.2.3.2.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.6 0 .6-.3 1.5-.9 2-.6.5-1.5.8-2.4.6-1.1-.2-2.5-.8-4.2-2.3-1.4-1.3-2.4-2.8-2.8-4-.3-.9-.2-1.8.2-2.5Z" fill="currentColor"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 9.6 8c.3.5.2 1.1-.2 1.5l-1.2 1.2a15.2 15.2 0 0 0 5.1 5.1l1.2-1.2c.4-.4 1-.5 1.5-.2l4.2 2.4c.5.3.8.9.6 1.5l-.6 2c-.2.6-.7 1-1.3 1C10 21.3 2.7 14 2.7 5.1c0-.6.4-1.1 1-1.3l2-.6c.6-.2 1.2.1 1.5.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    "map": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    "print": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 14h10v7H7z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="11" r=".8" fill="currentColor"/></svg>',
    "fingerprint": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.8 10.5a7.3 7.3 0 0 1 14.4 0M7.3 13.6v-2.4a4.7 4.7 0 0 1 9.4 0v3.2M9.5 17v-5.7a2.5 2.5 0 0 1 5 0v4.1c0 2.2-.6 4.1-1.4 5.6M5.6 14.2v-3a6.4 6.4 0 0 1 12.8 0v4.4c0 1.7-.3 3.4-.8 4.9M8 20.4c.7-1.4 1-3 1-4.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    "forms": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 3v4h4M9 11h6M9 15h6M9 19h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "payments": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 9h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "agreement": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 3v4h4M9 11h6M9 15h6M9 19h3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m14.5 18.5 1.4 1.4 3.1-3.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "ticket": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5v7" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 2"/></svg>',
    "stationery": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10v16H5zM15 7h4v13h-4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h4M8 12h4M8 16h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    "home": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "clock": '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
}


def icon(name: str, cls: str = "icon") -> str:
    svg = ICONS[name]
    return svg.replace('<svg ', f'<svg class="{cls}" ', 1)


def whatsapp_link(message: str) -> str:
    return WHATSAPP + "?text=" + quote(message)


def schema_data(page_url: str, description: str):
    return {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Store"],
        "name": "Yaqoob Enterprises",
        "url": page_url,
        "image": f"{SITE_URL}/assets/og-image.png",
        "telephone": PHONE_TEL,
        "description": description,
        "hasMap": MAPS,
        "priceRange": "PKR",
        "currenciesAccepted": "PKR",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Plot No. 7, Street No. 1, Sector B",
            "addressLocality": "Akhtar Colony",
            "addressRegion": "Sindh",
            "postalCode": "75500",
            "addressCountry": "PK",
        },
        "areaServed": [
            {"@type": "Place", "name": "Akhtar Colony, Karachi"},
            {"@type": "City", "name": "Karachi"},
        ],
        "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "07:00",
            "closes": "22:00",
        }],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": PHONE_TEL,
            "contactType": "customer service",
            "availableLanguage": ["English", "Urdu"],
        },
    }


def head(title: str, description: str, path: str, keywords: str = "") -> str:
    url = SITE_URL + path
    schema = json.dumps(schema_data(url, description), ensure_ascii=False, separators=(",", ":"))
    kw = f'\n  <meta name="keywords" content="{escape(keywords)}">' if keywords else ""
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(title)}</title>
  <meta name="description" content="{escape(description)}">{kw}
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#0d1b2a">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_PK">
  <meta property="og:site_name" content="Yaqoob Enterprises">
  <meta property="og:title" content="{escape(title)}">
  <meta property="og:description" content="{escape(description)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE_URL}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{escape(title)}">
  <meta name="twitter:description" content="{escape(description)}">
  <meta name="twitter:image" content="{SITE_URL}/assets/og-image.png">
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">{schema}</script>
  <script src="/assets/script.js" defer></script>
</head>'''


def header(current: str = "") -> str:
    nav = [
        ("Home", "/", "home"),
        ("Services", "/#services", "services"),
        ("How it works", "/#how-it-works", "how"),
        ("Contact", "/contact/", "contact"),
    ]
    desktop = "".join(
        f'<a href="{href}"' + (' aria-current="page"' if current == key else '') + f'>{label}</a>'
        for label, href, key in nav
    )
    mobile = "".join(
        f'<a href="{href}"' + (' aria-current="page"' if current == key else '') + f'>{label}</a>'
        for label, href, key in nav
    )
    return f'''<body>
<a class="skip-link" href="#main-content">Skip to main content</a>
<div class="opening-strip">
  <div class="container"><span class="opening-dot" aria-hidden="true"></span><span data-opening-status>Opening 10 August 2026 · Daily 7:00 AM to 10:00 PM</span></div>
</div>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="Yaqoob Enterprises home">
      <span class="brand-mark" aria-hidden="true">YE</span>
      <span class="brand-copy"><span class="brand-name">Yaqoob Enterprises</span><span class="brand-subtitle">Everyday services, made easier</span></span>
    </a>
    <nav class="desktop-nav" aria-label="Primary navigation">{desktop}</nav>
    <div class="header-actions">
      <a class="btn btn-secondary btn-small" href="tel:{PHONE_TEL}">{icon('phone')} Call</a>
      <a class="btn btn-primary btn-small" href="{whatsapp_link('Hello Yaqoob Enterprises, I need help with a service.')}" target="_blank" rel="noopener">{icon('whatsapp')} WhatsApp</a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-menu" aria-label="Mobile navigation" data-mobile-menu data-open="false">{mobile}</nav>'''


def footer() -> str:
    service_links = "".join(f'<a href="/services/{s["slug"]}/">{escape(s["title"])}</a>' for s in SERVICES)
    return f'''<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">YE</span><span class="brand-copy"><span class="brand-name">Yaqoob Enterprises</span><span class="brand-subtitle">Akhtar Colony, Karachi</span></span></a>
        <p>Printing, biometric verification, online forms, typing, payments, documentation, ticket booking, stationery and selected mobile accessories—supported from one local service centre.</p>
      </div>
      <div class="footer-column">
        <h2>Services</h2>
        <div class="footer-links">{service_links}</div>
      </div>
      <div class="footer-column">
        <h2>Contact</h2>
        <div class="footer-links">
          <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>
          <a href="{WHATSAPP}" target="_blank" rel="noopener">WhatsApp us</a>
          <a href="{MAPS}" target="_blank" rel="noopener">Get directions</a>
          <span>Daily · 7:00 AM–10:00 PM</span>
          <a href="/privacy/">Privacy</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom"><span>© <span data-current-year>2026</span> Yaqoob Enterprises.</span><span>Built for speed, accessibility and local search.</span></div>
  </div>
</footer>
<div class="mobile-action-bar" aria-label="Quick contact actions">
  <a href="{whatsapp_link('Hello Yaqoob Enterprises, I need help with a service.')}" target="_blank" rel="noopener">WhatsApp</a>
  <a href="tel:{PHONE_TEL}">Call</a>
  <a href="{MAPS}" target="_blank" rel="noopener">Directions</a>
</div>
</body>
</html>'''


def service_card(service: dict) -> str:
    return f'''<a class="service-card reveal" href="/services/{service['slug']}/">
  <span class="service-icon">{icon(service['icon'])}</span>
  <h3>{escape(service['title'])}</h3>
  <p>{escape(service['short'])}</p>
  <span class="card-link">View service</span>
</a>'''


def faq_block(items):
    return "".join(f'<details><summary>{escape(q)}</summary><p>{escape(a)}</p></details>' for q, a in items)


def home_page() -> str:
    description = "Yaqoob Enterprises in Akhtar Colony, Karachi provides printing, NADRA e-Sahulat biometric verification, online forms, typing, payments, agreements, ticket booking, stationery and mobile accessories."
    cards = "".join(service_card(s) for s in SERVICES)
    return f'''{head('Yaqoob Enterprises | Printing, Biometric & Online Services in Karachi', description, '/', 'copy shop Akhtar Colony, print shop Karachi, NADRA e Sahulat biometric, online forms, JazzCash, Easypaisa')}
{header('home')}
<main id="main-content">
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy reveal">
        <span class="eyebrow">Akhtar Colony, Karachi</span>
        <h1>Essential services. One reliable place.</h1>
        <p class="lead">Printing, biometric verification, online forms, payments, documentation and ticket bookings—handled through the shop, WhatsApp, phone or an eligible home visit.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="{whatsapp_link('Hello Yaqoob Enterprises, I would like help with: ')}" target="_blank" rel="noopener">{icon('whatsapp')} Start on WhatsApp</a>
          <a class="btn btn-secondary" href="tel:{PHONE_TEL}">{icon('phone')} Call {PHONE_DISPLAY}</a>
          <a class="btn btn-secondary" href="{MAPS}" target="_blank" rel="noopener">{icon('map')} Get directions</a>
        </div>
        <div class="hero-proof" aria-label="Service highlights">
          <span class="proof-item"><span class="proof-check">✓</span>Daily 7 AM–10 PM</span>
          <span class="proof-item"><span class="proof-check">✓</span>Shop pickup or delivery</span>
          <span class="proof-item"><span class="proof-check">✓</span>Mobile biometric appointments</span>
        </div>
      </div>
      <aside class="hero-panel reveal" aria-label="How to request a service">
        <span class="panel-kicker">Simple service request</span>
        <h2 class="panel-title">Tell us what you need. We will review the best available option.</h2>
        <ol class="process-list">
          <li><span class="process-number">1</span><span class="process-copy"><strong>Send the requirement</strong><span>Message, call or visit the shop.</span></span></li>
          <li><span class="process-number">2</span><span class="process-copy"><strong>Confirm the details</strong><span>We explain requirements, availability and estimated charges.</span></span></li>
          <li><span class="process-number">3</span><span class="process-copy"><strong>Choose the service mode</strong><span>Shop visit, pickup, delivery, remote support or eligible home visit.</span></span></li>
        </ol>
      </aside>
    </div>
  </section>

  <section class="quick-actions" aria-label="Contact options">
    <div class="container quick-grid">
      <a class="quick-card reveal" href="{whatsapp_link('Hello Yaqoob Enterprises, I need help with: ')}" target="_blank" rel="noopener"><span class="quick-icon">{icon('whatsapp')}</span><span class="quick-copy"><strong>WhatsApp your requirement</strong><span>Send files, details or a service request</span></span></a>
      <a class="quick-card reveal" href="tel:{PHONE_TEL}"><span class="quick-icon">{icon('phone')}</span><span class="quick-copy"><strong>Call for booking</strong><span>Ticket booking and service enquiries</span></span></a>
      <a class="quick-card reveal" href="{MAPS}" target="_blank" rel="noopener"><span class="quick-icon">{icon('map')}</span><span class="quick-copy"><strong>Visit the shop</strong><span>Plot No. 7, Sector B, Akhtar Colony</span></span></a>
    </div>
  </section>

  <section class="section section-alt" id="services">
    <div class="container">
      <div class="section-head-row">
        <div class="section-head reveal">
          <span class="eyebrow">Services</span>
          <h2>Everyday work, organised under one roof.</h2>
          <p class="lead">Clear service pages help customers find the right option and help search engines understand exactly what Yaqoob Enterprises provides.</p>
        </div>
      </div>
      <div class="services-grid">{cards}</div>
    </div>
  </section>

  <section class="section" id="how-it-works">
    <div class="container feature-grid">
      <div class="feature-copy reveal">
        <span class="eyebrow">Flexible service</span>
        <h2>Start from home. Finish in the most practical way.</h2>
        <p class="lead">Contact us with your requirement. We will review the available options and help complete eligible services remotely or at your location wherever possible.</p>
        <ul class="feature-list">
          <li>Send documents on WhatsApp for printing, then collect from the shop or request delivery.</li>
          <li>Book train, bus or airline tickets by phone or WhatsApp after reviewing available options.</li>
          <li>Request a mobile biometric visit with the device and laptop for eligible NADRA e-Sahulat services.</li>
          <li>Prepare forms, applications and typed documents before visiting when physical verification is required.</li>
        </ul>
        <div><a class="btn btn-primary" href="/contact/">Request a service</a></div>
      </div>
      <div class="mode-grid reveal" aria-label="Service modes">
        <article class="mode-card"><span class="service-icon">{icon('whatsapp')}</span><strong>WhatsApp support</strong><p>Send files and requirements before visiting.</p></article>
        <article class="mode-card"><span class="service-icon">{icon('home')}</span><strong>Home visit</strong><p>Available by appointment for eligible mobile biometric services.</p></article>
        <article class="mode-card"><span class="service-icon">{icon('print')}</span><strong>Pickup or delivery</strong><p>Choose shop collection or delivery where available.</p></article>
        <article class="mode-card"><span class="service-icon">{icon('phone')}</span><strong>Phone booking</strong><p>Discuss travel dates and available ticket options by call.</p></article>
      </div>
    </div>
  </section>

  <section class="section section-dark" aria-label="Business information">
    <div class="container stats-grid">
      <div class="stat reveal"><strong>7 days</strong><span>Open every day after launch</span></div>
      <div class="stat reveal"><strong>7 AM</strong><span>Daily opening time</span></div>
      <div class="stat reveal"><strong>10 PM</strong><span>Daily closing time</span></div>
      <div class="stat reveal"><strong>1 place</strong><span>Multiple everyday services</span></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal"><span class="eyebrow">Common questions</span><h2>Know what to expect before you contact us.</h2></div>
      <div class="faq-list reveal">
        {faq_block([
          ('Can I send documents on WhatsApp for printing?', 'Yes. Send the file and printing instructions. We will confirm the details, estimated charges and pickup or delivery option before printing.'),
          ('Do you provide biometric service at home?', 'Mobile biometric visits can be arranged by appointment for eligible services and covered areas, subject to document requirements and official system availability.'),
          ('Can I book a train, bus or airline ticket by phone?', 'Yes. Share the route, travel date and passenger requirement. We will review available options before completing any booking.'),
          ('Will every service be available from opening day?', 'The listed services are planned for launch. Individual services may depend on system activation, stock, provider availability and official requirements.'),
        ])}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container cta-panel reveal">
      <div><h2>Not sure which service you need?</h2><p>Send a short message with the task, location and preferred timing. We will tell you the practical next step.</p></div>
      <div class="cta-actions"><a class="btn btn-primary" href="{whatsapp_link('Hello Yaqoob Enterprises, I am not sure which service I need. My requirement is: ')}" target="_blank" rel="noopener">WhatsApp us</a><a class="btn btn-secondary" href="/contact/">Contact details</a></div>
    </div>
  </section>
</main>
{footer()}'''


def service_page(service: dict) -> str:
    page_path = f"/services/{service['slug']}/"
    other_links = "".join(
        f'<a href="/services/{s["slug"]}/"' + (' aria-current="page"' if s['slug'] == service['slug'] else '') + f'>{escape(s["title"])}</a>'
        for s in SERVICES
    )
    section_html = ""
    for heading, paragraphs in service["sections"]:
        section_html += f'<h2>{escape(heading)}</h2>'
        if heading.lower().startswith(("order", "book", "check", "review")):
            section_html += '<ol>' + ''.join(f'<li>{escape(p)}</li>' for p in paragraphs) + '</ol>'
        else:
            section_html += ''.join(f'<p>{escape(p)}</p>' for p in paragraphs)
    contact_message = f"Hello Yaqoob Enterprises, I need help with {service['title']}. My requirement is: "
    return f'''{head(f"{service['title']} in Akhtar Colony, Karachi | Yaqoob Enterprises", service['meta'], page_path, service['keywords'])}
{header('services')}
<main id="main-content">
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#services">Services</a><span>/</span><span>{escape(service['title'])}</span></nav>
      <span class="eyebrow">Yaqoob Enterprises</span>
      <h1>{escape(service['h1'])}</h1>
      <p class="lead">{escape(service['lead'])}</p>
      <div class="hero-actions"><a class="btn btn-primary" href="{whatsapp_link(contact_message)}" target="_blank" rel="noopener">{icon('whatsapp')} Ask on WhatsApp</a><a class="btn btn-secondary" href="tel:{PHONE_TEL}">{icon('phone')} Call now</a></div>
    </div>
  </section>
  <section class="section">
    <div class="container content-grid">
      <article class="prose reveal">
        {section_html}
        <div class="info-box"><strong>Important</strong><p>{escape(service['note'])}</p></div>
        <h2>Frequently asked questions</h2>
        <div class="faq-list">{faq_block(service['faq'])}</div>
      </article>
      <aside class="sidebar-card reveal">
        <h2>Request this service</h2>
        <p>Send your requirement first so we can confirm the right documents, availability and service mode.</p>
        <div class="sidebar-actions"><a class="btn btn-primary" href="{whatsapp_link(contact_message)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-secondary" href="tel:{PHONE_TEL}">Call {PHONE_DISPLAY}</a><a class="btn btn-secondary" href="{MAPS}" target="_blank" rel="noopener">Get directions</a></div>
        <nav class="service-nav" aria-label="Other services">{other_links}</nav>
      </aside>
    </div>
  </section>
  <section class="section">
    <div class="container cta-panel reveal"><div><h2>Need help before visiting?</h2><p>Tell us the service, location and preferred timing. We will explain the practical next step.</p></div><div class="cta-actions"><a class="btn btn-primary" href="{whatsapp_link(contact_message)}" target="_blank" rel="noopener">Start on WhatsApp</a><a class="btn btn-secondary" href="/contact/">Contact page</a></div></div>
  </section>
</main>
{footer()}'''


def contact_page() -> str:
    description = "Contact Yaqoob Enterprises in Akhtar Colony, Karachi by phone or WhatsApp for printing, biometric verification, online forms, payments, agreements and ticket booking."
    return f'''{head('Contact Yaqoob Enterprises | Akhtar Colony, Karachi', description, '/contact/', 'Yaqoob Enterprises contact, copy shop Akhtar Colony, biometric service Karachi')}
{header('contact')}
<main id="main-content">
  <section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Contact</span></nav><span class="eyebrow">Contact</span><h1>Tell us what you need.</h1><p class="lead">Use the form to prepare a clear WhatsApp request, call directly, or visit the shop in Akhtar Colony.</p></div></section>
  <section class="section">
    <div class="container contact-grid">
      <div class="contact-card reveal">
        <span class="eyebrow">Business details</span><h2>Yaqoob Enterprises</h2>
        <div class="contact-stack">
          <div class="contact-item"><span class="contact-item-icon">{icon('phone')}</span><span><strong>Phone and WhatsApp</strong><a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a></span></div>
          <div class="contact-item"><span class="contact-item-icon">{icon('map')}</span><span><strong>Address</strong><a href="{MAPS}" target="_blank" rel="noopener">{escape(ADDRESS)}</a></span></div>
          <div class="contact-item"><span class="contact-item-icon">{icon('clock')}</span><span><strong>Business hours</strong><span data-opening-status>Opening 10 August 2026 · Daily 7:00 AM to 10:00 PM</span></span></div>
        </div>
      </div>
      <div class="form-card reveal">
        <span class="eyebrow">WhatsApp request</span><h2>Prepare your message</h2>
        <form class="form-grid" data-whatsapp-form>
          <div class="field"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="service">Service</label><select id="service" name="service" required><option value="">Select a service</option>{''.join(f'<option>{escape(s["title"])}</option>' for s in SERVICES)}<option>Other service</option></select></div>
          <div class="field"><label for="mode">Preferred option</label><select id="mode" name="mode" required><option value="">Select an option</option><option>Visit the shop</option><option>Shop pickup</option><option>Delivery</option><option>Remote assistance</option><option>Home biometric visit</option><option>Not sure</option></select></div>
          <div class="field"><label for="details">Requirement</label><textarea id="details" name="details" placeholder="Explain the task, location and preferred timing." required></textarea><span class="field-help">This form does not upload or store your data. It opens WhatsApp with the message you prepare.</span></div>
          <button class="btn btn-primary" type="submit">{icon('whatsapp')} Open in WhatsApp</button>
        </form>
      </div>
    </div>
  </section>
  <section class="section section-alt"><div class="container"><iframe class="map-frame reveal" src="{MAP_EMBED}" title="Map showing Yaqoob Enterprises in Akhtar Colony, Karachi" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div style="margin-top:1rem"><a class="btn btn-secondary" href="{MAPS}" target="_blank" rel="noopener">Open directions in Google Maps</a></div></div></section>
</main>
{footer()}'''


def privacy_page() -> str:
    description = "Privacy information for the Yaqoob Enterprises website."
    return f'''{head('Privacy | Yaqoob Enterprises', description, '/privacy/')}
{header('')}
<main id="main-content">
  <section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Privacy</span></nav><span class="eyebrow">Privacy</span><h1>Privacy information</h1><p class="lead">A plain-language explanation of what this website does and does not collect.</p></div></section>
  <section class="section"><div class="container content-grid"><article class="prose reveal">
    <h2>Information submitted through this website</h2><p>The service request form on the contact page does not submit information to a website database. It prepares a message on your device and opens WhatsApp. The message is sent only when you choose to send it in WhatsApp.</p>
    <h2>Third-party services</h2><p>Links to WhatsApp, telephone services and Google Maps are operated by their respective providers. Their privacy practices and terms apply when you use those services.</p>
    <h2>Cookies and tracking</h2><p>This version of the website does not use advertising cookies or behavioural tracking. Basic hosting logs may be processed by the hosting provider for security and reliability.</p>
    <h2>Sensitive information</h2><p>Do not send passwords, PINs or one-time verification codes. Share identification documents only when they are genuinely required for a service and after confirming the appropriate process.</p>
    <h2>Contact</h2><p>Questions about this website can be raised by calling or messaging Yaqoob Enterprises at {PHONE_DISPLAY}.</p>
  </article><aside class="sidebar-card reveal"><h2>Need assistance?</h2><p>Contact Yaqoob Enterprises directly for service and privacy questions.</p><div class="sidebar-actions"><a class="btn btn-primary" href="{WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-secondary" href="tel:{PHONE_TEL}">Call</a></div></aside></div></section>
</main>
{footer()}'''


def not_found_page() -> str:
    return f'''{head('Page not found | Yaqoob Enterprises', 'The requested page could not be found.', '/404.html')}
{header('')}
<main id="main-content"><section class="page-hero"><div class="container"><span class="eyebrow">404</span><h1>That page could not be found.</h1><p class="lead">Return to the homepage or contact Yaqoob Enterprises for assistance.</p><div class="hero-actions"><a class="btn btn-primary" href="/">Go to homepage</a><a class="btn btn-secondary" href="/contact/">Contact us</a></div></div></section></main>
{footer()}'''


def write(path: str, content: str):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def build():
    write("index.html", home_page())
    for service in SERVICES:
        write(f"services/{service['slug']}/index.html", service_page(service))
    write("contact/index.html", contact_page())
    write("privacy/index.html", privacy_page())
    write("404.html", not_found_page())

    paths = ["/", "/contact/", "/privacy/"] + [f"/services/{s['slug']}/" for s in SERVICES]
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(
        f"  <url><loc>{SITE_URL}{p}</loc><changefreq>{'weekly' if p == '/' else 'monthly'}</changefreq><priority>{'1.0' if p == '/' else '0.8'}</priority></url>" for p in paths
    ) + "\n</urlset>\n"
    write("sitemap.xml", sitemap)
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap.xml\n")
    write("site.webmanifest", json.dumps({
        "name": "Yaqoob Enterprises",
        "short_name": "Yaqoob",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#f7f7f5",
        "theme_color": "#0d1b2a",
        "icons": [{"src": "/assets/favicon.svg", "sizes": "any", "type": "image/svg+xml"}],
    }, indent=2))
    write("vercel.json", json.dumps({
        "cleanUrls": True,
        "trailingSlash": True,
        "headers": [
            {"source": "/assets/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]},
            {"source": "/(.*)", "headers": [
                {"key": "X-Content-Type-Options", "value": "nosniff"},
                {"key": "X-Frame-Options", "value": "DENY"},
                {"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains"},
                {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
                {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"},
                {"key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src https://www.google.com; connect-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"}
            ]}
        ]
    }, indent=2))

    write("assets/favicon.svg", '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0f3557"/><stop offset="1" stop-color="#0b7a75"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#g)"/><path d="M15 18h8l9 13 9-13h8L36 37v10h-8V37z" fill="#fff" opacity=".96"/></svg>''')

    readme = f'''# Yaqoob Enterprises Website\n\nStatic, responsive local-business website for Yaqoob Enterprises in Akhtar Colony, Karachi.\n\n## Included\n\n- English-first responsive website\n- Seven SEO-focused service pages\n- WhatsApp, call and directions actions\n- WhatsApp request form with no database\n- LocalBusiness structured data\n- Sitemap, robots.txt and web manifest\n- Accessibility and reduced-motion support\n- Security headers for Vercel\n\n## Business details used\n\n- Phone/WhatsApp: {PHONE_DISPLAY}\n- Address: {ADDRESS}\n- Hours: Daily 7:00 AM–10:00 PM\n- Opening date: 10 August 2026\n\n## Preview locally\n\n```bash\nnpx http-server . -p 8080\n```\n\nOpen `http://localhost:8080`.\n\n## Before production launch\n\n1. Replace the temporary site URL `{SITE_URL}` in `build_site.py` with the final domain.\n2. Run `python build_site.py` again.\n3. Add real shop photos after the shop is ready.\n4. Confirm every listed service is active and officially available.\n5. Connect the final domain to Google Search Console and the Google Business Profile.\n'''
    write("README.md", readme)

if __name__ == "__main__":
    build()
