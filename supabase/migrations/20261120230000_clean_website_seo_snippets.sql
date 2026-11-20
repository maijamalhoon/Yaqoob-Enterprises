-- Keep a user-edited SEO title/description untouched.
-- Only shorten the exact long values found in the November 2026 live audit.
update public.services
set seo_title = 'Web Design & SEO Karachi | Yaqoob Enterprises',
    seo_description = 'Websites, web apps, redesign, maintenance and SEO from Yaqoob Enterprises in Karachi. Discuss your project and request a quote.'
where slug = 'website-development-full-stack-seo'
  and seo_title = 'Website Developer & SEO Services Karachi | Yaqoob Enterprises'
  and seo_description = 'Full-stack website development, business websites, redesign, maintenance and SEO services from Yaqoob Enterprises in Karachi. Discuss your project and requirements.';
