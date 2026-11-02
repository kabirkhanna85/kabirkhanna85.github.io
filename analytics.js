(() => {
  'use strict';
  const measurementId = 'G-0K67X8HZ11';
  const liveHost = ['kabir-khanna.com', 'www.kabir-khanna.com'].includes(location.hostname);
  if (!liveHost || document.querySelector('script[data-site-analytics]')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
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
})();
