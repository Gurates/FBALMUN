# Conference account connection

Target spreadsheet: https://docs.google.com/spreadsheets/d/1rw6qiINYAwYZiVZthHyCtq7CbIrnFBlYMj-Phw5z3EU/edit

Account: fbalmun2027@gmail.com

Receiver: https://script.google.com/macros/s/AKfycbxng_FPI1L-lQuY0Uiph0N1_KotWdCiRz9fipGNqTGZ-0ltX7Gji-tmAJL5jfII0-vh/exec

## Confirmed

- Five application types received successful write and retry confirmations from the conference receiver.
- Song requests received successful write and retry confirmations after enabling song support.
- Receiver version marker: `fbalmun-sheets-song-v2`.
- Local `.env` now uses this receiver and spreadsheet ID; the shared secret is unchanged and is not stored in this document.
- Local API forwarding was confirmed with an existing synthetic song request ID, without adding a duplicate test row.
- 29 live HTTP security checks passed against the local API and conference target. Anonymous spreadsheet export, query and publish endpoints returned HTTP 401.
- Tests use clearly marked `[TEST]` records, not real applicant information. Tests confirm receiver acknowledgements; no authenticated visual inspection of the private conference sheet was available.

## Deferred by user

The Netlify production environment has not been changed. Update `APPLICATIONS_WEBHOOK_URL` there to the receiver above and redeploy when ready. If the existing Netlify secret already matches the current local secret, it stays unchanged. Changing the local `.env` or pushing GitHub code does not update Netlify environment variables.

The old personal-account test spreadsheet and receiver have been preserved for rollback. No existing records were copied or deleted.
