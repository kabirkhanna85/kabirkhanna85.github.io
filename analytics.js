(() => {
  'use strict';
  const measurementId = 'G-0K67X8HZ11';
  const preferenceKey = 'kabir-analytics-choice-v1';
  const choiceLifetime = 180 * 24 * 60 * 60 * 1000;
  const liveHost = ['kabir-khanna.com', 'www.kabir-khanna.com'].includes(location.hostname);
  const disableKey = 'ga-disable-' + measurementId;
  let tagLoaded = false;
  window[disableKey] = true;

  function readChoice() {
    try {
      const choice = JSON.parse(localStorage.getItem(preferenceKey));
      if (choice && ['accepted', 'declined'].includes(choice.value) &&
          Number.isFinite(choice.expiresAt) && choice.expiresAt > Date.now()) return choice.value;
    } catch (_) {}
    return null;
  }

  function clearAnalyticsCookies() {
    const domains = ['', location.hostname, '.' + location.hostname, 'kabir-khanna.com', '.kabir-khanna.com'];
    const paths = ['/', '/news', '/news/', '/privacy', '/privacy/'];
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
      for (const domain of new Set(domains)) {
        for (const path of paths) {
          document.cookie = name + '=; Max-Age=0; Path=' + path +
            (domain ? '; Domain=' + domain : '') + '; SameSite=Lax';
        }
      }
    }
  }

  function startAnalytics() {
    if (!liveHost || tagLoaded) return;
    tagLoaded = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    tag.dataset.siteAnalytics = 'true';
    document.head.append(tag);
  }

  const banner = document.createElement('section');
  banner.className = 'analytics-choice';
  banner.setAttribute('aria-label', 'Optional analytics');
  banner.innerHTML = '<div class="analytics-choice-copy"><strong>Optional analytics</strong>' +
    '<p>May I use Google Analytics to understand visits to this site? ' +
    'It runs only if you accept. <a href="/privacy/">Privacy details</a></p></div>' +
    '<div class="analytics-choice-actions">' +
    '<button type="button" data-analytics-choice="accepted">Accept analytics</button>' +
    '<button type="button" data-analytics-choice="declined">Decline</button></div>';
  banner.id = 'analytics-choice';
  document.body.append(banner);

  const preferences = document.createElement('button');
  preferences.type = 'button';
  preferences.className = 'analytics-preferences';
  preferences.textContent = 'Analytics preferences';
  preferences.setAttribute('aria-controls', banner.id);
  const privacy = document.createElement('a');
  privacy.href = '/privacy/';
  privacy.textContent = 'Privacy';
  const footerLinks = document.createElement('div');
  footerLinks.className = 'analytics-footer-links';
  footerLinks.append(privacy, preferences);
  const footer = document.querySelector('footer');
  (footer || document.body).append(footerLinks);

  function showBanner(open, focus) {
    banner.hidden = !open;
    preferences.setAttribute('aria-expanded', String(open));
    if (open && focus) banner.querySelector('[data-analytics-choice="declined"]').focus();
  }

  function choose(value) {
    try {
      localStorage.setItem(preferenceKey, JSON.stringify({ value, expiresAt: Date.now() + choiceLifetime }));
    } catch (_) {}
    const restoreFocus = banner.contains(document.activeElement);
    showBanner(false);
    if (restoreFocus) preferences.focus();
    if (value === 'accepted') {
      startAnalytics();
    } else {
      window[disableKey] = true;
      clearAnalyticsCookies();
      if (tagLoaded) location.reload();
    }
  }

  for (const button of banner.querySelectorAll('[data-analytics-choice]')) {
    button.addEventListener('click', () => choose(button.dataset.analyticsChoice));
  }
  preferences.addEventListener('click', () => showBanner(banner.hidden, banner.hidden));
  window.addEventListener('storage', (event) => {
    if (event.key !== preferenceKey) return;
    const choice = readChoice();
    if (choice === 'accepted') startAnalytics();
    else {
      window[disableKey] = true;
      clearAnalyticsCookies();
      if (tagLoaded) location.reload();
    }
    showBanner(!choice);
  });

  const choice = readChoice();
  if (choice === 'accepted') startAnalytics();
  else clearAnalyticsCookies();
  showBanner(!choice);
})();
