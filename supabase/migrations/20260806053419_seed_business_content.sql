insert into public.service_categories(slug,title,description,icon_key,display_order) values
('printing-photos','Printing, Photocopy & Photos','Colour and black-and-white printing, photocopy, scanning and passport-size photos.','printer',1),
('typing-online','Typing, CV & Online Applications','Urdu and English typing, CV preparation, online forms and applications.','file-text',2),
('documents','Agreements & Document Preparation','Document drafting, typing, formatting and printing assistance.','scroll-text',3),
('biometric','Biometric & NADRA e-Sahulat','Supported biometric and e-Sahulat services at the shop or by eligible appointment.','fingerprint',4),
('payments','Payments & Money Transfer','Supported deposit, withdrawal and domestic transfer services.','wallet-cards',5),
('tickets','Train, Bus & Airline Tickets','Ticket search and booking assistance for supported operators.','ticket',6),
('retail','Stationery & Mobile Accessories','Everyday stationery and selected mobile accessories.','shopping-bag',7),
('laptop','Laptop, Windows & Software Support','Windows setup, drivers, software and basic system troubleshooting.','laptop',8);

insert into public.services(category_id,slug,title,short_description,detailed_description,status,available_at_shop,whatsapp_request,pickup_available,delivery_available,doorstep_available,appointment_required,requirements,important_note,display_order,is_featured)
select id,'colour-black-white-printing','Colour & Black-and-White Printing','Send files on WhatsApp and collect ready prints or request eligible delivery.','Documents can be reviewed and prepared before collection so customers spend less time waiting.','active'::public.service_status,true,true,true,true,false,false,array['File or clear image','Page size','Colour preference','Number of copies'],'Final charges and delivery eligibility are confirmed before printing.',1,true from public.service_categories where slug='printing-photos'
union all
select id,'photocopy-scanning','Photocopy & Document Scanning','Photocopying, scanning and print-ready document support.','Available at the shop for everyday personal, education and business documents.','active'::public.service_status,true,true,false,false,false,false,array['Original document where applicable'],'Handle original documents carefully and verify every page before leaving.',2,false from public.service_categories where slug='printing-photos'
union all
select id,'passport-size-photos','Passport-Size Photos','Standard and urgent passport-size photo preparation.','Photo preparation is subject to customer presence, required background and requested size.','active'::public.service_status,true,true,false,false,false,false,array['Customer presence','Required size or application type'],'Confirm the required dimensions before preparation.',3,true from public.service_categories where slug='printing-photos'
union all
select id,'urdu-english-typing','Urdu & English Typing','Letters, applications, forms and general document typing.','Customers can send clear material on WhatsApp for preparation before visiting.','active'::public.service_status,true,true,true,true,false,false,array['Clear handwritten or digital content'],'Names, dates, CNIC numbers and other critical details must be reviewed by the customer.',1,true from public.service_categories where slug='typing-online'
union all
select id,'online-forms-applications','Online Forms & Applications','Government and private forms, job applications and online submissions.','Includes file resizing, document upload assistance and submission support where permitted.','active'::public.service_status,true,true,false,false,false,false,array['Required personal information','Relevant documents','Application or vacancy link'],'Customer approval is required before final submission.',2,true from public.service_categories where slug='typing-online'
union all
select id,'cv-preparation','CV Preparation','Professional CV preparation and formatting for job applications.','CV content is prepared from information supplied by the customer.','active'::public.service_status,true,true,true,true,false,false,array['Education and experience details','Contact information'],'Customers should verify all information before using the CV.',3,false from public.service_categories where slug='typing-online'
union all
select id,'fbr-registration-assistance','FBR Registration & Related Assistance','FBR profile setup, registration and procedural form-filling assistance.','Service availability depends on customer information and official systems.','active'::public.service_status,true,true,false,false,false,false,array['CNIC','Mobile number and email','Relevant business or income information'],'This is procedural assistance and does not guarantee filer status or official approval.',4,false from public.service_categories where slug='typing-online'
union all
select id,'agreements-document-preparation','Agreements & Document Preparation','Urdu and English sale, rent and other document preparation assistance.','Includes plot, shop, home and vehicle sale or rent agreements, undertakings, affidavits and applications.','active'::public.service_status,true,true,true,true,false,false,array['Parties’ details','CNIC details','Agreed terms, dates and amounts'],'Yaqoob Enterprises provides drafting, typing, formatting and printing assistance—not legal representation or legal advice.',1,true from public.service_categories where slug='documents'
union all
select id,'fbr-sales-tax-biometric','FBR Sales Tax Biometric','Supported FBR Sales Tax biometric verification.','Availability depends on identity requirements, official systems and service eligibility.','active'::public.service_status,true,true,false,false,true,true,array['Original valid CNIC','Required person’s presence','Relevant reference details'],'Completion cannot be guaranteed when official systems or identity verification are unavailable.',1,true from public.service_categories where slug='biometric'
union all
select id,'fbr-psw-biometric','FBR PSW Biometric','Supported FBR Pakistan Single Window biometric verification.','Shop and eligible doorstep appointments can be confirmed through WhatsApp.','active'::public.service_status,true,true,false,false,true,true,array['Original valid CNIC','Required person’s presence','Relevant PSW details'],'Exact eligibility is confirmed before booking.',2,false from public.service_categories where slug='biometric'
union all
select id,'eto-vehicle-biometric','ETO & Vehicle Biometric','Buyer, seller and supported ETO biometric verification.','Vehicle purchase and sale biometric assistance is available subject to official requirements.','active'::public.service_status,true,true,false,false,true,true,array['Original valid CNIC','Required buyer/seller presence','Vehicle transaction information'],'Official system availability and transaction rules apply.',3,true from public.service_categories where slug='biometric'
union all
select id,'general-biometric-esahulat','General Biometric & NADRA e-Sahulat','Available general biometric and NADRA e-Sahulat-related services.','The exact supported service is confirmed before the customer visits or books a doorstep appointment.','active'::public.service_status,true,true,false,false,true,true,array['Original identification','Required reference or application details'],'Only currently authorised and technically available services will be accepted.',4,false from public.service_categories where slug='biometric'
union all
select id,'cash-deposit-withdrawal-transfer','Cash Deposit, Withdrawal & Transfer','Supported cash deposit, withdrawal and domestic transfer services.','Transactions are completed through available authorised payment channels.','active'::public.service_status,true,true,false,false,false,false,array['Recipient/account details','Valid identification where required'],'Provider limits, identity rules, fees and system availability apply. Never share PINs or OTPs.',1,true from public.service_categories where slug='payments'
union all
select id,'railway-airline-bus-tickets','Railway, Airline & Bus Tickets','Search and booking assistance for supported routes and operators.','Share route, date, passenger count and preferred timing through WhatsApp or at the shop.','active'::public.service_status,true,true,false,false,false,false,array['Passenger names','Travel date and route','Valid identification where required'],'Fares, schedules, baggage rules, availability and cancellation terms are controlled by the operator.',1,true from public.service_categories where slug='tickets'
union all
select id,'stationery-mobile-accessories','Stationery & Mobile Accessories','Confirm availability on WhatsApp, then collect or request eligible delivery.','Stock and compatibility vary by item. Customers should confirm the exact product or device model.','active'::public.service_status,true,true,true,true,false,false,array['Item name or clear reference','Device model for accessories'],'Availability, compatibility and warranty terms are confirmed before purchase.',1,true from public.service_categories where slug='retail'
union all
select id,'windows-software-support','Laptop, Windows & Software Support','Windows installation, drivers, software setup and basic troubleshooting.','The device condition and requested work are reviewed before service begins.','active'::public.service_status,true,true,true,false,false,false,array['Laptop and charger','Required software details','Backup of important data'],'Customers should back up important data. Existing hardware faults and data recovery are not automatically covered.',1,true from public.service_categories where slug='laptop';

insert into public.coverage_areas(name,delivery_available,doorstep_biometric_available,pickup_available,extra_charge_may_apply,display_order) values
('DHA Karachi — all phases',true,true,false,true,1),
('PECHS',true,true,false,true,2),
('SMCHS',true,true,false,true,3),
('Karsaz',true,true,false,true,4),
('Stadium Road and nearby areas',true,true,false,true,5),
('Dhoraji',true,true,false,true,6),
('KDA Scheme 1',true,true,false,true,7),
('KAMCHS',true,true,false,true,8),
('Other nearby Karachi South areas',true,true,false,true,9);

insert into public.site_sections(section_key,title,subtitle,body,content) values
('home_hero','Everyday services. One reliable place.','Printing, documents, biometric, payments and more—at the shop or through WhatsApp.','Send your requirement first. We will confirm availability, requirements, service mode and charges before work begins.','{}'),
('coverage','Delivery and selected doorstep services in Karachi South','Share your location pin on WhatsApp to confirm coverage.','','{}'),
('pricing','Clear confirmation before work begins','','Hamari service charges kaam ki type, quantity, urgency, delivery location aur applicable official fees ke mutabiq vary karti hain. Exact quotation kaam shuru hone se pehle WhatsApp ya shop par confirm ki jati hai.','{}');
