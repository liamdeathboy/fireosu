/* Fire OSU Coaches: analytics
   1) Pick a provider and paste your ID below. Nothing loads until you do.
      Recommended: Plausible (cookie-free, no consent banner needed).
        provider: 'plausible', id: 'fireosucoaches.com'
      Or Google Analytics 4:
        provider: 'ga4', id: 'G-XXXXXXXXXX'
   2) Key actions are tracked as events automatically (see EVENTS in README). */
window.FOC_ANALYTICS = { provider: 'none', id: '' };

(function () {
  var cfg = window.FOC_ANALYTICS, q = [];
  window.FOC_track = function (name, props) { q.push([name, props || {}]); };
  if (!cfg.id || cfg.provider === 'none') return;
  var s = document.createElement('script'); s.defer = true;
  if (cfg.provider === 'plausible') {
    s.src = 'https://plausible.io/js/script.outbound-links.js'; s.setAttribute('data-domain', cfg.id);
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    window.FOC_track = function (n, p) { window.plausible(n, { props: p || {} }); };
  } else if (cfg.provider === 'ga4') {
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.id);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', cfg.id, { anonymize_ip: true });
    window.FOC_track = function (n, p) { window.gtag('event', n.toLowerCase().replace(/[^a-z0-9]+/g, '_'), p || {}); };
  }
  document.head.appendChild(s);
  q.forEach(function (e) { window.FOC_track(e[0], e[1]); });
})();
