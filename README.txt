FIRE OSU COACHES (fireosucoaches.com)
Static site, no build step. Upload everything in this folder to the root of any static host
(Netlify, Cloudflare Pages, GitHub Pages, Vercel) and point the domain at it.

  /              The Case (home)
  /timeline/     The Timeline (filterable)
  /hires/        The Hires
  /numbers/      The Numbers
  /faq/          FAQ
  /take-action/  Take Action (personal letter, email, contacts, share)
  /sources/      Sources
  /assets/       Shared styles and scripts (edit once, applies everywhere)

Preview locally: run "python3 -m http.server" in this folder, then open http://localhost:8000.

Analytics (assets/analytics.js):
  Off until you add an ID. Open assets/analytics.js and set ONE line:
    Plausible (recommended, cookie-free, no consent banner):
      window.FOC_ANALYTICS = { provider: 'plausible', id: 'fireosucoaches.com' };
      Then add the site in your Plausible dashboard.
    Google Analytics 4:
      window.FOC_ANALYTICS = { provider: 'ga4', id: 'G-XXXXXXXXXX' };
  Events tracked automatically:
    Letter Emailed, Letter Copied, Email Prompt Opened (with "personalized" true/false)
    CTA: Send Letter, CTA: Nav, CTA: Sticky Bar
    Share, Hashtag Copied, Timeline Filter, Source Clicked
  In Plausible, add these as Goals (Settings > Goals > Custom event) to see conversion rates.

Sitemap: /sitemap.xml and /robots.txt are included. After the site is live, submit
https://fireosucoaches.com/sitemap.xml in Google Search Console and Bing Webmaster Tools.
If your domain isn't fireosucoaches.com, change DOMAIN in sitemap.xml, robots.txt and the
canonical tags (search and replace "fireosucoaches.com").

Before publishing:
- Add a published recap with the Oregon 41-28 final score to the Sources page when one is available.
- The Michigan countdown on the home page targets Nov. 28, 2026 and hides itself after that date.
- The share text in Take Action assumes the domain https://fireosucoaches.com/. Change it if yours differs.
