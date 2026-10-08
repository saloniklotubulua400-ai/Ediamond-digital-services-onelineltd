# Ediamond Ltd website (Next.js)

## Run it (one command)

    npm install && npm run dev

Open http://localhost:3000

## Pages

| URL | What it is |
|---|---|
| `/` | Home: hero, services overview, how it works, contact call-to-action |
| `/services` | All 19 services grouped by category |
| `/services/[slug]` | One page per service (e.g. `/services/web-development`) |
| `/request` | Customer request form (`/request?service=api-integration` pre-selects a service) |
| `/contact` | WhatsApp and request links |
| `/signup` and `/login` | Customer accounts |
| `/account` | Customer's own requests with a progress tracker (Received, In progress, Completed) |
| `/account/requests/[id]` | One request with its status and a WhatsApp button |
| `/admin/login` | Staff sign in (separate from customer accounts) |
| `/admin` | Dashboard: see, search and filter customer requests, download CSV |
| `/admin/requests/[id]` | One request: contact the customer, change status, add notes, delete |

## Before you go live

1. Open `.env.local` and change `ADMIN_PASSWORD` and `AUTH_SECRET`, then restart.
2. Check the WhatsApp number in `lib/config.js` (currently 0108 770 168 as on the poster).
3. Requests are saved in `data/requests.json` and customer accounts in `data/users.json`. This works on a VPS or your own computer.
   On Vercel the disk is read-only, so replace the functions in `lib/store.js` with a database
   (PostgreSQL, Supabase, MongoDB, etc.): `lib/store.js` for requests and `lib/users.js` for accounts.
4. Login cookies are marked Secure in production, so serve the live site over HTTPS.

## How customers track progress

A customer signs up, then sends requests while logged in. Each request is linked to their account.
When you change its status in `/admin`, they see it update in `/account`. Requests sent without an account
still reach your dashboard, but the customer cannot track them.

## Edit content

- Services, descriptions and the lists of what you build: `lib/services.js`
- Phone number and company text: `lib/config.js`
- Colours and fonts: top of `app/globals.css`
- Logo: `components/Logo.js` (swap the SVG for your own logo file in `public/` if you like)
# Ediamond-digital-services-onelineltd
# Ediamond-digital-services-onelineltd
