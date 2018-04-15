const TrackConfig = require('track-config');

TrackConfig.configure((c) => {
  c.relativeUrlRoot = '/my-app';
  c.localeLoader = ((lang) => require(`./locales/${lang}.yml`));
  c.localeSelector = (() => 'en');
});
