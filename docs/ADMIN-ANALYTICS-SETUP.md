# Admin Analytics and Google Insights Setup

This integration is server-side. Never add Google client secrets or refresh tokens to source code, a `NEXT_PUBLIC_*` variable, a browser request, or a chat message.

## What the dashboard reads

- First-party website events: page views, device type, approximate country/city, referrer/UTM source, contact clicks, and service-catalogue searches.
- Google Search Console: organic search queries, clicks, impressions, landing pages, countries, and devices. Search Console can suppress low-volume queries and report with a delay.
- Google Business Profile: Search/Maps impression metrics, call-button clicks, direction requests, website/message clicks, monthly search keywords, average rating, review count, and recent reviews.
- Website UTM attribution is shown separately from official Google Business Profile metrics. They are different data sources and must not be added together as if they were the same metric.

Website search terms are only recorded after the visitor pauses typing. Likely email addresses and long digit strings are excluded. The existing analytics endpoint honours Do Not Track and Global Privacy Control and ignores authenticated admins.

## Google Cloud setup

1. Sign in to [Google Cloud Console](https://console.cloud.google.com/) with the Google account that manages the business profile.
2. Select or create a project.
3. Enable these APIs in **APIs & Services → Library**:
   - Business Profile Performance API
   - My Business API (used for the reviews endpoint)
   - Search Console API
   - Business Profile Account Management API
   - Business Profile Business Information API
4. In **Google Auth Platform / OAuth consent screen**, configure the app. If the app is in Testing mode, add the Google account that owns/manages the profile as a test user.
5. Create an OAuth client ID. Use a secure web-application client and keep its client secret private.
6. Generate an OAuth refresh token while signed in as the profile owner/manager. The authorization must include both scopes:
   - `https://www.googleapis.com/auth/business.manage`
   - `https://www.googleapis.com/auth/webmasters.readonly`
7. Google may require additional Business Profile API access approval or a non-zero quota. Enabling an API alone does not guarantee that the project can call it.

## Vercel environment variables

Add the following server-side variables to the Vercel project. Apply them to **Preview** first, then **Production** after preview validation.

| Variable | Value |
| --- | --- |
| `GOOGLE_BUSINESS_CLIENT_ID` | OAuth client ID from Google Cloud |
| `GOOGLE_BUSINESS_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_BUSINESS_REFRESH_TOKEN` | Refresh token with both scopes listed above |
| `GOOGLE_BUSINESS_ACCOUNT_ID` | Business Profile account ID (the route accepts the ID or `accounts/ID`) |
| `GOOGLE_BUSINESS_LOCATION_ID` | Verified business location ID (the route accepts the ID or `locations/ID`) |
| `GOOGLE_SEARCH_CONSOLE_PROPERTY_URL` | Exact verified Search Console property, e.g. `https://yaqoob-enterprises.vercel.app/` or the exact `sc-domain:` property |

Do not add `NEXT_PUBLIC_` to any of these names.

### Find account and location IDs

With the OAuth account authorized, use the Google API Explorer for the Business Profile Account Management API to list accounts:

`GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts`

Then use the Business Profile Business Information API to list locations for the correct account:

`GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/ACCOUNT_ID/locations?readMask=name,title,storeCode&pageSize=100`

Use the account resource ID and the location resource ID for **Yaqoob Enterprises, Karachi**. Do not guess IDs from the public share link.

## Search Console property

Verify the exact production website property in [Google Search Console](https://search.google.com/search-console). The property configured in Vercel must match it exactly, including the trailing slash for a URL-prefix property. A Domain property uses its exact `sc-domain:example.com` form.

The current public URL is `https://yaqoob-enterprises.vercel.app/`. If you later move to a custom domain, update the property variable after verifying the new property.

## Reporting limits

- Location data on the website dashboard is approximate request metadata, not GPS or a visitor's street address.
- Google Business Profile search keywords are monthly aggregates; some counts may be thresholded rather than exact.
- Google Search Console may omit some low-volume queries for privacy and may take several days to finalize reporting.
- Google Profile calls are button-click counts, not proof that a phone conversation connected.
- Google Maps direction requests are requests, not proof that the person visited the shop.
- If an API is unavailable or permission is missing, the dashboard shows a connection/error state instead of invented metrics.
