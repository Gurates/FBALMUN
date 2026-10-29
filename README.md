# FBALMUN

React/Vite conference website. Run `npm run dev` locally and `npm run build` for the Netlify production bundle.

## Applications → Google Sheets

The website has no admin panel or application email service. All five application forms send to `/api/applications`. The Netlify function validates the request and forwards it to a private Google Sheets receiver; local Vite uses the same handler.

The local environment is connected to the conference Google account. The Netlify environment must be switched separately; changing the local .env does not change Netlify settings. Configure the server environment separately when publishing or moving to the conference account; see [the Google Sheets setup guide](docs/GOOGLE_SHEETS_SETUP.md).

Run `node scripts/build-sheets-script.mjs` after changing the server field schema. Paste the generated `scripts/google-sheets/Code.gs` into the Google Apps Script project. The receiver creates separate Delegates, Delegations, Chairboard, Admin Staff, Press, and Song Requests tabs.

The shared secret is kept in server environment variables and Apps Script properties. The public site cannot read the sheet or request arbitrary columns. Duplicate retries reuse a submission ID and are deduplicated under a Google script lock. Cell values are protected from spreadsheet formula injection.

## Song requests

Choose Your Song posts a `song` payload to the same server-only `/api/applications` relay. The receiver writes the song name and optional artist to **Song Requests**, with server validation, authenticated forwarding, safe plain-text cells and retry deduplication. No database SDK or browser database credentials are required.

## Checks

- `npm run build`
- `node scripts/check-sheets-applications.mjs` checks server validation, receiver authorization, routing for all five forms, duplicate protection, formula safety, failure handling and secret redaction without accessing a Google account.
- `node scripts/check-api-security.mjs http://127.0.0.1:5173 SPREADSHEET_ID` probes the running local API and live receiver for unauthorized access, blocked source/secret paths and private exports of the specified spreadsheet. It never submits a valid new application.
