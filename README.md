# SFMC Journey Extractor — Quick Reference

This repository provides simple DevTools snippets, visual mockups, and a short interactive demo to help non-technical users extract text from Salesforce Marketing Cloud (SFMC) Journey / Email / SMS analytics UIs and paste results into Google Sheets.

What’s in this repo

- `ver1-extract-journey.js` — Extract Journey Analytics (Email Delivery & Engagement card). Copies a two-row TSV (header + values) to clipboard.
- `ver2-extract-email.js` — Extract Email Analytics (block info: title, contexts, iframe src). Copies small key/value TSV to clipboard.
- `ver2-sms-extract-sms.js` — Extract SMS/MMS Analytics (KPIs + table). Copies combined TSV (KPIs then table) to clipboard.
- `ver3-extract-activity-names.js` — Extract Activity Names. Copies a newline list of activity names to clipboard.
- `ver1-mock.html`, `ver2-mock.html`, `ver2-sms-mock.html`, `ver3-mock.html` — visual mockups showing sample layouts and exact sample clipboard output.
- `demo.html` — a short, friendly animated HTML demonstration that visually walks users through running a snippet and pasting into Google Sheets (works in a browser — use it if you can’t provide a GIF).

Quick links

- Mockups:
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver1-mock.html
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver2-mock.html
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver2-sms-mock.html
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver3-mock.html

- Snippets:
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver1-extract-journey.js
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver2-extract-email.js
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver2-sms-extract-sms.js
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/ver3-extract-activity-names.js

- Interactive demo (open in browser):
  - https://github.com/kenxavierr/sfmc-journey-extractor/blob/main/demo.html

How to use the snippets (one-minute guide)

1. Open the SFMC page with the analytics UI in Chrome.
2. Press `F12` to open Chrome DevTools.
3. In DevTools go to **Sources → Snippets**.
4. Click **New snippet**, name it (e.g., `ver1-ExtractJourney`) and paste the corresponding `.js` file contents from this repo.
5. Save (Ctrl/Cmd+S). With the analytics page visible, right‑click the snippet → **Run**.
6. A confirmation alert appears and the result is copied to your clipboard. Paste into Google Sheets at cell A1.

Notes

- If the analytics card lives inside an iframe, use DevTools Console context selector (top-left) to switch to the frame, or open the iframe URL in a new tab and run the snippet there.
- If clipboard copy fails, check the DevTools Console — the script logs the TSV/text there so you can copy manually.

Want a GIF instead?

I included `demo.html` (a tiny animated walkthrough) as an HTML alternative to a GIF. If you prefer a real GIF file I can generate one and add it to the repo — tell me and I’ll produce it.

Contact / Next steps

If you want, I can:
- Produce a downloadable ZIP with all files (ready for distribution), or
- Create a short GIF demonstrating the exact steps and commit it to the repo, or
- Add a printable one‑page PDF quick sheet to the repo.

Reply which of those you want next.
