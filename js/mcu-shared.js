/* =========================================================================
   haug-it.eu — MCU tracker: shared state/data helpers.

   Loaded by both mcu/index.html and mcu/dashboard.html, before mcu.js /
   mcu-dashboard.js respectively, so both pages read and write the same
   localStorage shape the same way instead of drifting apart.

   No DOM access in this file — pure data functions only, so it's easy to
   reason about and easy to keep both pages consistent.
   ========================================================================= */

window.MCU_SHARED = (function () {
  "use strict";

  var PROGRESS_KEY = "haugit.mcu.progress";
  var TMDB_KEY_KEY = "haugit.mcu.tmdbKey";
  var LANG_KEY = "haugit.lang";
  var STATE_VERSION = 2;

  var STUDIO_LABELS = {
    "marvel-studios": "Marvel Studios",
    "sony-spiderverse": "Sony Pictures",
    "fox-x-men": "20th Century Fox",
    "blade-original": "New Line Cinema",
    "marvel-television-abc": "Marvel Television (ABC)",
    "marvel-netflix": "Marvel Television (Netflix)"
  };

  function readLang() {
    var v = null;
    try { v = window.localStorage.getItem(LANG_KEY); } catch (err) { v = null; }
    return (v === "de") ? "de" : "en";
  }

  function writeLang(lang) {
    try { window.localStorage.setItem(LANG_KEY, lang === "de" ? "de" : "en"); } catch (err) { /* ignore */ }
  }

  function defaultState() {
    return {
      version: STATE_VERSION,
      watched: {},
      watchedAt: {},
      filmProgress: {},
      options: { splitEpisodes: false, includeNonMcu: false, showPostCredit: false, unwatchedOnly: false },
      order: "release",
      groupBy: "none",
      view: "comfortable",
      filters: { categories: [], parts: [], studios: [] }
    };
  }

  function isPlainObject(v) { return !!v && typeof v === "object" && !Array.isArray(v); }

  function loadState() {
    var raw = null;
    try { raw = window.localStorage.getItem(PROGRESS_KEY); } catch (err) { raw = null; }
    var base = defaultState();
    if (!raw) { return base; }
    try {
      var parsed = JSON.parse(raw);
      if (!isPlainObject(parsed)) { return base; }

      if (isPlainObject(parsed.watched)) {
        Object.keys(parsed.watched).forEach(function (k) {
          if (typeof k === "string" && typeof parsed.watched[k] === "boolean") { base.watched[k] = parsed.watched[k]; }
        });
      }
      if (isPlainObject(parsed.watchedAt)) {
        Object.keys(parsed.watchedAt).forEach(function (k) {
          if (typeof k === "string" && typeof parsed.watchedAt[k] === "string" && !isNaN(Date.parse(parsed.watchedAt[k]))) {
            base.watchedAt[k] = parsed.watchedAt[k];
          }
        });
      }
      if (isPlainObject(parsed.filmProgress)) {
        Object.keys(parsed.filmProgress).forEach(function (k) {
          if (typeof k === "string" && typeof parsed.filmProgress[k] === "number" && parsed.filmProgress[k] >= 0) {
            base.filmProgress[k] = parsed.filmProgress[k];
          }
        });
      }
      if (isPlainObject(parsed.options)) {
        Object.keys(base.options).forEach(function (k) {
          if (typeof parsed.options[k] === "boolean") { base.options[k] = parsed.options[k]; }
        });
      }
      if (typeof parsed.order === "string") { base.order = parsed.order; }
      if (typeof parsed.groupBy === "string") { base.groupBy = parsed.groupBy; }
      if (parsed.view === "compact" || parsed.view === "comfortable") { base.view = parsed.view; }
      if (isPlainObject(parsed.filters)) {
        ["categories", "parts", "studios"].forEach(function (k) {
          if (Array.isArray(parsed.filters[k])) {
            base.filters[k] = parsed.filters[k].filter(function (v) { return typeof v === "string"; });
          }
        });
      }
      return base;
    } catch (err) {
      return base;
    }
  }

  function saveState(state) {
    try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state)); } catch (err) { /* private mode / quota: progress just won't persist */ }
  }

  function readTmdbKey() {
    try { return window.localStorage.getItem(TMDB_KEY_KEY) || ""; } catch (err) { return ""; }
  }
  function writeTmdbKey(key) {
    try { if (key) { window.localStorage.setItem(TMDB_KEY_KEY, key); } else { window.localStorage.removeItem(TMDB_KEY_KEY); } } catch (err) { /* ignore */ }
  }

  function episodeKey(id, season, ep) { return id + "::s" + season + "e" + ep; }

  function allEntries(data, includeNonMcu) {
    var list = data.core.slice();
    if (includeNonMcu) { list = list.concat(data.nonMcu); }
    return list;
  }

  function getStudio(entry) {
    if (!entry.isNonMCU) { return "marvel-studios"; }
    return entry.nonMCUGroup || "marvel-studios";
  }
  function getStudioLabel(studioId) { return STUDIO_LABELS[studioId] || studioId; }

  /* Approximate, not live availability — see mcu/methodology.html. Returns a short code;
     each page's own i18n resolves the code to display text. */
  function getPlatformCode(entry) {
    if (!entry.released) { return "SOON"; }
    if (!entry.isNonMCU) { return (entry.id === "incredible-hulk") ? "RENT" : "DPLUS"; }
    if (entry.nonMCUGroup === "marvel-netflix") { return "DPLUS"; }
    return "RENT";
  }

  /* Episode/season helpers shared by list rendering (mcu.js) and dashboard totals (mcu-dashboard.js). */
  function seasonEpisodeCount(season) { return typeof season.episodes === "number" ? season.episodes : 0; }

  function totalEpisodes(entry) {
    if (entry.category !== "series" || !Array.isArray(entry.seasons)) { return 0; }
    var total = 0;
    entry.seasons.forEach(function (s) { total += seasonEpisodeCount(s); });
    return total;
  }

  function totalRuntimeMinutes(entry) {
    if (entry.runtimeMinutes) { return entry.runtimeMinutes; }
    if (entry.category === "series" && Array.isArray(entry.seasons)) {
      var total = 0;
      entry.seasons.forEach(function (s) { total += seasonEpisodeCount(s) * (s.avgEpisodeMinutes || 0); });
      return total;
    }
    return 0;
  }

  /* true | false | "partial" */
  function isWatched(state, entry) {
    if (entry.category === "series" && Array.isArray(entry.seasons)) {
      var total = 0, watched = 0;
      entry.seasons.forEach(function (s) {
        var count = seasonEpisodeCount(s);
        for (var e = 1; e <= count; e++) {
          total++;
          if (state.watched[episodeKey(entry.id, s.season, e)]) { watched++; }
        }
      });
      if (total === 0) { return !!state.watched[entry.id]; }
      if (watched === total) { return true; }
      return watched > 0 ? "partial" : false;
    }
    if (entry.category === "film" || entry.category === "special") {
      var mins = totalRuntimeMinutes(entry);
      if (state.watched[entry.id]) { return true; }
      if (mins && state.filmProgress[entry.id] > 0 && state.filmProgress[entry.id] < mins) { return "partial"; }
      return false;
    }
    return !!state.watched[entry.id];
  }

  function watchedEpisodeCount(state, entry) {
    if (entry.category !== "series" || !Array.isArray(entry.seasons)) { return 0; }
    var watched = 0;
    entry.seasons.forEach(function (s) {
      var count = seasonEpisodeCount(s);
      for (var e = 1; e <= count; e++) { if (state.watched[episodeKey(entry.id, s.season, e)]) { watched++; } }
    });
    return watched;
  }

  return {
    PROGRESS_KEY: PROGRESS_KEY, TMDB_KEY_KEY: TMDB_KEY_KEY, LANG_KEY: LANG_KEY, STATE_VERSION: STATE_VERSION,
    readLang: readLang, writeLang: writeLang,
    defaultState: defaultState, loadState: loadState, saveState: saveState,
    readTmdbKey: readTmdbKey, writeTmdbKey: writeTmdbKey,
    episodeKey: episodeKey, allEntries: allEntries,
    getStudio: getStudio, getStudioLabel: getStudioLabel, getPlatformCode: getPlatformCode,
    seasonEpisodeCount: seasonEpisodeCount, totalEpisodes: totalEpisodes, totalRuntimeMinutes: totalRuntimeMinutes,
    isWatched: isWatched, watchedEpisodeCount: watchedEpisodeCount
  };
})();
