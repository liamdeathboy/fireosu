/* Take Action: personalized letter builder */
(function () {
  var nameI = document.getElementById('fName'), whoI = document.getElementById('fWho'), lineI = document.getElementById('fLine');
  var out = document.getElementById('letterPreview');
  if (!out) return;
  var SUBJECT = 'Ohio State football needs accountability';
  /* RECIPIENTS: add confirmed addresses here and they auto-fill the To and CC lines.
     Example: var TO = ['name.1@osu.edu']; var CC = ['office@osu.edu'];
     Leave empty until confirmed; a wrong address bounces every fan's letter. */
  var TO = ['athletic_director@osu.edu'];
  var CC = ['board@osu.edu'];
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build(html) {
    var name = nameI.value.trim(), who = whoI.value.trim(), line = lineI.value.trim();
    function m(v, ph) { return html ? (v ? '<mark>' + esc(v) + '</mark>' : '<mark>' + ph + '</mark>') : (v || ph); }
    var intro = 'I am writing as an Ohio State fan' + (who ? ' (' + (html ? '<mark>' + esc(who) + '</mark>' : who) + ')' : '') + ' to ask for real accountability in our football program.';
    var parts = [
      'Dear Athletic Director Bjork,',
      intro,
      'Since 2019, Ohio State has lost 15 games under Ryan Day. In seven of them we held the lead and lost it, including 23-3 at Texas and 14-0 against Oregon this season. We lost four straight games to Michigan from 2021 to 2024. The one national title came in 2024, the season Coach Day handed play-calling to Chip Kelly.',
      'The staff changes have not fixed it. Ohio State is 6-3 in 2026, with losses at Texas, at USC and at home to Oregon.'
    ];
    if (line) parts.push(html ? '<mark>' + esc(line) + '</mark>' : line);
    parts.push('I am asking you to part ways with Ryan Day. At the very least, I ask that the coaches responsible for these results, including offensive coordinator Arthur Smith, defensive coordinator Matt Patricia and offensive line coach Tyler Bowen, be replaced.');
    parts.push('Thank you for your time and for your work on behalf of Ohio State.');
    parts.push('Respectfully,\n' + m(name ? (html ? name : name) : '', html ? '[Your name]' : '[Your name]'));
    return parts.join('\n\n');
  }
  function render() { out.innerHTML = build(true).replace(/\n/g, '<br>'); }
  [nameI, whoI, lineI].forEach(function (i) { i.addEventListener('input', render); });
  render();

  var done = document.getElementById('sentNote');
  function markDone(msg) { if (done) { done.hidden = false; done.querySelector('span').textContent = msg; } }

  document.getElementById('copyLetter').addEventListener('click', function () {
    var b = this, text = 'Subject: ' + SUBJECT + '\n\n' + build(false);
    FOC.copyText(text, function () { var o = b.textContent; b.textContent = 'Copied!'; FOC.say('Letter copied to clipboard.'); FOC.track('Letter Copied', { personalized: !!lineI.value.trim() }); markDone('Copied. Paste it into an email or the contact form.'); setTimeout(function () { b.textContent = o; }, 1800); },
      function () { FOC.say('Could not copy automatically. Select the letter text and copy it.'); });
  });

  var box = document.getElementById('emailConsent'), eb = document.getElementById('emailBtn');
  var rcpt = document.getElementById('consentRcpt');
  if (rcpt) rcpt.textContent = TO.length
    ? 'It will be addressed to ' + TO.join(', ') + (CC.length ? ', with ' + CC.join(', ') + ' copied' : '') + '.'
    : 'Add the recipient\'s address from the contacts below.';
  eb.addEventListener('click', function () { FOC.track('Email Prompt Opened'); box.hidden = false; eb.setAttribute('aria-expanded', 'true'); document.getElementById('consentYes').focus(); });
  function closeBox() { box.hidden = true; eb.setAttribute('aria-expanded', 'false'); eb.focus(); }
  document.getElementById('consentNo').addEventListener('click', closeBox);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeBox(); });
  document.getElementById('consentYes').addEventListener('click', function () {
    var body = build(false);
    FOC.copyText('Subject: ' + SUBJECT + '\n\n' + body, function () {}, function () {});
    box.hidden = true; eb.setAttribute('aria-expanded', 'false');
    FOC.track('Letter Emailed', { personalized: !!lineI.value.trim() });
    markDone('Your email app should be open. Review it and press send.');
    var href = 'mailto:' + TO.join(',') + '?' + (CC.length ? 'cc=' + CC.join(',') + '&' : '') +
      'subject=' + encodeURIComponent(SUBJECT) + '&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n'));
    window.location.href = href;
  });
})();
