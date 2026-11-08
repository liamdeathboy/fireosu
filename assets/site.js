/* Fire OSU Coaches: shared behavior */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) doc.classList.add('no-motion');
  var live = document.getElementById('sr-status');
  function say(msg) { if (live) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); } }

  function copyText(text, ok, fail) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      try {
        var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', '');
        t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
        var r = document.execCommand('copy'); document.body.removeChild(t); r ? ok() : (fail && fail());
      } catch (e) { fail && fail(); }
    }
  }
  function track(n, p) { try { if (window.FOC_track) window.FOC_track(n, p); } catch (e) {} }
  window.FOC = { copyText: copyText, say: say, track: track };

  /* generic click tracking: data-track="Event name" */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]'); if (t) track(t.getAttribute('data-track'), { page: location.pathname });
    var a = e.target.closest('a.src, .src-list a'); if (a) track('Source Clicked', { url: a.href });
  });

  /* nav */
  var toggle = document.getElementById('menuToggle'), nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    function close() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) close(); });
  }

  /* reveal + count-up */
  var rv = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  var groups = new Map();
  rv.forEach(function (el) {
    var p = el.parentElement, n = groups.get(p) || 0; groups.set(p, n + 1);
    if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(n, 6) * 0.09 + 's');
  });
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
    if (reduce || isNaN(end)) { el.textContent = pre + end + suf; return; }
    var t0 = null, dur = 1300;
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function reveal(el) {
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (el.matches('[data-count]')) countUp(el);
  }
  var chart = document.querySelectorAll('.chart');
  if (!('IntersectionObserver' in window) || reduce) {
    rv.forEach(reveal); chart.forEach(function (c) { c.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
    chart.forEach(function (c) { io.observe(c); });
    setTimeout(function () { rv.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight && !el.classList.contains('in')) reveal(el); }); }, 1600);
  }

  /* home hero drift */
  var hero = document.querySelector('[data-parallax]');
  if (hero && !reduce) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = window.scrollY, h = hero.offsetHeight;
        if (y < h * 1.3) { var p = Math.min(y / (h * .9), 1);
          hero.style.opacity = String(1 - p * .8);
          hero.style.transform = 'translate3d(0,' + (y * .16) + 'px,0) scale(' + (1 - p * .04) + ')'; }
        tick = false;
      });
    }, { passive: true });
  }

  /* sticky mobile CTA */
  var sticky = document.getElementById('stickyCta');
  if (sticky && 'IntersectionObserver' in window) {
    var hideFor = document.querySelectorAll('[data-hide-sticky]'), visible = new Set();
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
      sticky.classList.toggle('show', visible.size === 0);
      sticky.setAttribute('aria-hidden', visible.size === 0 ? 'false' : 'true');
      sticky.querySelector('a').tabIndex = visible.size === 0 ? 0 : -1;
    });
    hideFor.forEach(function (el) { so.observe(el); });
  }

  /* countdown */
  document.querySelectorAll('[data-countdown]').forEach(function (el) {
    var target = new Date(el.getAttribute('data-countdown')), days = Math.ceil((target - new Date()) / 86400000);
    var wrap = el.closest('[data-countdown-wrap]');
    if (days < 0) { if (wrap) wrap.hidden = true; return; }
    el.textContent = days === 0 ? 'today' : days === 1 ? '1 day' : days + ' days';
  });

  /* share */
  document.querySelectorAll('[data-share]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = b.getAttribute('data-url') || location.href.split('#')[0];
      var data = { title: 'Fire OSU Coaches', text: b.getAttribute('data-text') || '15 losses. Same ending. The record, sourced. #FireOSUCoaches', url: url };
      track('Share', { page: location.pathname, method: navigator.share ? 'native' : 'copy' });
      if (navigator.share) { navigator.share(data).catch(function () {}); }
      else copyText(data.text + ' ' + url, function () { var o = b.innerHTML; b.textContent = 'Link copied!'; say('Link copied to clipboard.'); setTimeout(function () { b.innerHTML = o; }, 1800); },
        function () { say('Could not copy. Copy the address bar instead.'); });
    });
  });

  /* hashtags */
  document.querySelectorAll('.tag-big').forEach(function (b) {
    b.addEventListener('click', function () {
      copyText(b.getAttribute('data-tag'), function () { b.classList.add('copied'); track('Hashtag Copied', { tag: b.getAttribute('data-tag') }); say(b.getAttribute('data-tag') + ' copied.'); setTimeout(function () { b.classList.remove('copied'); }, 1600); });
    });
  });
  var all = document.getElementById('copyAllTags');
  if (all) all.addEventListener('click', function () {
    var t = Array.prototype.map.call(document.querySelectorAll('.tag-big'), function (b) { return b.getAttribute('data-tag'); }).join(' ');
    copyText(t, function () { var o = all.textContent; all.textContent = 'Copied!'; track('Hashtag Copied', { tag: 'all' }); say('All hashtags copied.'); setTimeout(function () { all.textContent = o; }, 1600); });
  });

  /* timeline filters */
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    var items = document.querySelectorAll('.tl-item[data-tags]');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        var f = c.getAttribute('data-filter'), n = 0;
        items.forEach(function (it) { var show = f === 'all' || it.getAttribute('data-tags').split(' ').indexOf(f) > -1; it.hidden = !show; if (show) { n++; it.classList.add('in'); } });
        say('Showing ' + n + ' games.'); track('Timeline Filter', { filter: f });
      });
    });
  }
})();
