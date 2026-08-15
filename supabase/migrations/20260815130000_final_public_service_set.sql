-- Final main-website service lineup.
-- Existing services are preserved for admin/SEO; is_featured controls the main public showcase.

update public.services
set is_featured = false;

update public.services
set
  title = 'NADRA e-Sahulat Biometric Verifications',
  short_description = 'General biometric, FBR Sales Tax, PSW and Vehicle / ETO biometric verification assistance.',
  detailed_description = 'NADRA e-Sahulat biometric verification support covering general biometric verification and supported FBR Sales Tax, Pakistan Single Window (PSW), and Vehicle / ETO biometric cases. Confirm the exact case, required person, documents and current system availability before visiting.',
  is_featured = true,
  display_order = 1
where slug = 'general-biometric-esahulat';

update public.services
set
  title = 'Printing, Photocopy & Document Scanning',
  short_description = 'Colour and black-and-white printing, photocopying and document scanning for everyday requirements.',
  detailed_description = 'Printing, photocopy and document scanning for forms, applications, office papers, study material and other everyday documents. Send the file or bring the original and confirm paper size, colour and quantity before printing.',
  is_featured = true,
  display_order = 2
where slug = 'colour-black-white-printing';

update public.services
set
  is_featured = true,
  display_order = 3
where slug = 'passport-size-photos';

update public.services
set
  title = 'Online Jobs, Forms & Applications',
  short_description = 'Online job applications, admissions, registrations and other web-based forms and submissions.',
  detailed_description = 'Assistance with online job applications, admissions, registrations, portals and other web-based forms. Bring or send the required documents, contact details and any account or reference information needed for the application.',
  is_featured = true,
  display_order = 4
where slug = 'online-forms-applications';

update public.services
set
  title = 'Urdu & English Typing & CV Preparation',
  short_description = 'Urdu and English typing plus clean CV preparation for jobs, applications and documents.',
  detailed_description = 'Urdu and English typing, document formatting and CV preparation for jobs, applications and everyday professional use. Share your existing text, details or old CV and confirm the required format before work begins.',
  is_featured = true,
  display_order = 5
where slug = 'urdu-english-typing';

update public.services
set
  is_featured = true,
  display_order = 6
where slug = 'agreements-document-preparation';

update public.services
set
  title = 'Cash Deposit, Withdrawal & Money Transfer',
  is_featured = true,
  display_order = 7
where slug = 'cash-deposit-withdrawal-transfer';

update public.services
set
  is_featured = true,
  display_order = 8
where slug = 'railway-airline-bus-tickets';

update public.services
set
  is_featured = true,
  display_order = 9
where slug = 'stationery-mobile-accessories';

update public.services
set
  title = 'FBR Filer, NTN & Tax Return Assistance',
  short_description = 'FBR IRIS, NTN, filer registration and tax return filing assistance.',
  detailed_description = 'Assistance with FBR IRIS registration, NTN and filer-related processes, profile support and tax return filing based on the information and documents provided by the customer.',
  is_featured = false
where slug = 'fbr-registration-assistance';

insert into public.service_categories (
  slug,
  title,
  description,
  icon_key,
  display_order,
  is_active
)
select
  'web-development-seo',
  'Web Development & SEO',
  'Business websites, full-stack web development, website improvements and practical search optimization.',
  'laptop',
  9,
  true
where not exists (
  select 1 from public.service_categories where slug = 'web-development-seo'
);

insert into public.services (
  category_id,
  slug,
  title,
  short_description,
  detailed_description,
  status,
  available_at_shop,
  whatsapp_request,
  pickup_available,
  delivery_available,
  doorstep_available,
  appointment_required,
  requirements,
  important_note,
  display_order,
  is_featured,
  seo_title,
  seo_description
)
select
  category.id,
  'website-development-full-stack-seo',
  'Website Development, Full-Stack & SEO Services',
  'Business websites, full-stack development, redesign, maintenance and practical SEO support.',
  'Website development for businesses and professionals, including full-stack web applications, business websites, redesigns, maintenance and search optimization. Projects are scoped according to required pages, features, integrations, content, domain and hosting needs.',
  'active'::service_status,
  true,
  true,
  false,
  false,
  false,
  true,
  array[
    'Business or project goal',
    'Required pages and features',
    'Reference websites or preferred style, if any',
    'Domain and hosting details, if already purchased'
  ]::text[],
  'Project cost and delivery time depend on scope, integrations, content and revision requirements. Confirm the project scope before work begins.',
  10,
  true,
  'Website Developer & SEO Services Karachi | Yaqoob Enterprises',
  'Full-stack website development, business websites, redesign, maintenance and SEO services from Yaqoob Enterprises in Karachi. Discuss your project and requirements.'
from public.service_categories category
where category.slug = 'web-development-seo'
  and not exists (
    select 1 from public.services where slug = 'website-development-full-stack-seo'
  );

-- Keep the new web service featured if this migration is reapplied after it already exists.
update public.services
set
  title = 'Website Development, Full-Stack & SEO Services',
  short_description = 'Business websites, full-stack development, redesign, maintenance and practical SEO support.',
  is_featured = true,
  display_order = 10,
  seo_title = 'Website Developer & SEO Services Karachi | Yaqoob Enterprises',
  seo_description = 'Full-stack website development, business websites, redesign, maintenance and SEO services from Yaqoob Enterprises in Karachi. Discuss your project and requirements.'
where slug = 'website-development-full-stack-seo';
