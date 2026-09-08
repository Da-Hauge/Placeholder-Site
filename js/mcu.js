/* =========================================================================
   haug-it.eu — MCU tracker application logic.

   Progressive enhancement, same spirit as js/main.js: the #mcu-app section
   stays [hidden] until this file has actually built the UI, so a visitor
   without JS only ever sees the <noscript> notice, never a broken shell.

   Storage (see docs/verarbeitung.md V5/V6 and privacy-policy.html):
     haugit.mcu.progress  — watched map + your filter/option preferences.
                             Written only as you use the checkboxes/toggles.
     haugit.mcu.tmdbKey   — OPTIONAL. Only exists if you paste your own TMDb
                             API key in Settings. Never sent anywhere except
                             to TMDb, and only to fetch the item currently
                             rendered on screen.
     haugit.lang          — the same language key the rest of the site uses
                             (see js/lang.js). This page's DE/EN button
                             writes it too; no separate key for this page.

   No inline script (CSP forbids it). No eval, no innerHTML with anything
   that was not built through textContent/createElement, so imported JSON
   or a manipulated localStorage value can never become markup.
   ========================================================================= */

(function () {
  "use strict";

  var PROGRESS_KEY = "haugit.mcu.progress";
  var TMDB_KEY_KEY = "haugit.mcu.tmdbKey";
  var LANG_KEY = "haugit.lang";
  var STATE_VERSION = 1;

  var DATA = window.MCU_DATA;
  var I18N = window.MCU_I18N;

  if (!DATA || !I18N) { return; } // data files failed to load — leave the noscript message visible

  var TIER_RANK = { essential: 0, recommended: 1, optional: 2, skippable: 3 };
  var CATEGORY_ORDER = ["film", "series", "special", "short"];

  // ---- 0. Language --------------------------------------------------------

  function readLang() {
    var v = null;
    try { v = window.localStorage.getItem(LANG_KEY); } catch (err) { v = null; }
    return (v === "de") ? "de" : "en";
  }

  function writeLang(lang) {
    try {
      if (lang === "de") { window.localStorage.setItem(LANG_KEY, "de"); }
      else { window.localStorage.setItem(LANG_KEY, "en"); }
    } catch (err) { /* private mode: keep going without persistence */ }
  }

  var lang = readLang();
  function t(key) { return I18N[lang][key]; }

  // ---- 1. Load / save state ------------------------------------------------

  function defaultState() {
    return {
      version: STATE_VERSION,
      watched: {},
      options: { splitEpisodes: false, includeNonMcu: false, showPostCredit: false, unwatchedOnly: false },
      order: "release"
    };
  }

  function loadState() {
    var raw = null;
    try { raw = window.localStorage.getItem(PROGRESS_KEY); } catch (err) { raw = null; }
    if (!raw) { return defaultState(); }
    try {
      var parsed = JSON.parse(raw);
      var base = defaultState();
      if (parsed && typeof parsed === "object") {
        if (parsed.watched && typeof parsed.watched === "object") {
          Object.keys(parsed.watched).forEach(function (k) {
            if (typeof k === "string" && typeof parsed.watched[k] === "boolean") {
              base.watched[k] = parsed.watched[k];
            }
          });
        }
        if (parsed.options && typeof parsed.options === "object") {
          Object.keys(base.options).forEach(function (k) {
            if (typeof parsed.options[k] === "boolean") { base.options[k] = parsed.options[k]; }
          });
        }
        if (typeof parsed.order === "string") { base.order = parsed.order; }
      }
      return base;
    } catch (err) {
      return defaultState();
    }
  }

  var state = loadState();
  var filters = { categories: new Set(), parts: new Set(), search: "" };

  function saveState() {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
    } catch (err) { /* private mode / quota: progress just won't persist */ }
  }

  function readTmdbKey() {
    try { return window.localStorage.getItem(TMDB_KEY_KEY) || ""; } catch (err) { return ""; }
  }
  function writeTmdbKey(key) {
    try {
      if (key) { window.localStorage.setItem(TMDB_KEY_KEY, key); }
      else { window.localStorage.removeItem(TMDB_KEY_KEY); }
    } catch (err) { /* ignore */ }
  }

  // ---- 2. Derived dataset ---------------------------------------------------

  function allEntries() {
    var list = DATA.core.slice();
    if (state.options.includeNonMcu) { list = list.concat(DATA.nonMcu); }
    return list;
  }

  function episodeKey(id, season, ep) { return id + "::s" + season + "e" + ep; }

  function isWatched(entry) {
    if (entry.category === "series" && Array.isArray(entry.seasons) && state.options.splitEpisodes) {
      var total = 0, watched = 0;
      entry.seasons.forEach(function (s) {
        for (var e = 1; e <= s.episodes; e++) {
          total++;
          if (state.watched[episodeKey(entry.id, s.season, e)]) { watched++; }
        }
      });
      if (total === 0) { return false; }
      return watched === total ? true : (watched > 0 ? "partial" : false);
    }
    return !!state.watched[entry.id];
  }

  function setWatched(entry, value) {
    if (entry.category === "series" && Array.isArray(entry.seasons) && state.options.splitEpisodes) {
      entry.seasons.forEach(function (s) {
        for (var e = 1; e <= s.episodes; e++) { state.watched[episodeKey(entry.id, s.season, e)] = value; }
      });
    } else {
      state.watched[entry.id] = value;
    }
    saveState();
  }

  // ---- 3. Filtering & sorting ------------------------------------------------

  function matches(entry) {
    if (filters.categories.size && !filters.categories.has(entry.category)) { return false; }
    if (filters.parts.size) {
      var hit = (entry.parts || []).some(function (p) { return filters.parts.has(p); });
      if (!hit) { return false; }
    }
    if (filters.search) {
      if (entry.title.toLowerCase().indexOf(filters.search) === -1) { return false; }
    }
    if (state.options.unwatchedOnly && isWatched(entry) === true) { return false; }
    return true;
  }

  function sortValue(entry) {
    switch (state.order) {
      case "timeline": return entry.timelineOrder;
      case "title": return entry.title.toLowerCase();
      case "critic": return -(typeof entry.criticScore === "number" ? entry.criticScore : -1);
      case "importance": return TIER_RANK[entry.essentialTier] != null ? TIER_RANK[entry.essentialTier] : 9;
      case "release":
      default: return entry.releaseDate || "9999";
    }
  }

  function visibleEntries() {
    var list = allEntries().filter(matches);
    list.sort(function (a, b) {
      var av = sortValue(a), bv = sortValue(b);
      if (av < bv) { return -1; }
      if (av > bv) { return 1; }
      return a.title < b.title ? -1 : 1;
    });
    return list;
  }

  // ---- 4. Rendering: filter controls -----------------------------------------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") { node.textContent = attrs[k]; }
        else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") { node.addEventListener(k.slice(2), attrs[k]); }
        else { node.setAttribute(k, attrs[k]); }
      });
    }
    (children || []).forEach(function (c) { if (c) { node.appendChild(c); } });
    return node;
  }

  function renderCategoryFilters() {
    var host = document.getElementById("mcu-category-filters");
    host.textContent = "";
    CATEGORY_ORDER.forEach(function (cat) {
      var id = "mcu-cat-" + cat;
      var input = el("input", { type: "checkbox", id: id, value: cat });
      input.checked = filters.categories.has(cat);
      input.addEventListener("change", function () {
        if (input.checked) { filters.categories.add(cat); } else { filters.categories.delete(cat); }
        render();
      });
      var label = el("label", { "for": id, "class": "mcu-check" }, [input, el("span", { text: t("categories")[cat] })]);
      host.appendChild(label);
    });
  }

  function renderPartFilters() {
    var host = document.getElementById("mcu-part-filters");
    host.textContent = "";
    (DATA.meta.partsVocab || []).forEach(function (part) {
      var id = "mcu-part-" + part.id;
      var input = el("input", { type: "checkbox", id: id, value: part.id });
      input.checked = filters.parts.has(part.id);
      input.addEventListener("change", function () {
        if (input.checked) { filters.parts.add(part.id); } else { filters.parts.delete(part.id); }
        render();
      });
      var label = el("label", { "for": id, "class": "mcu-check" }, [input, el("span", { text: part.label[lang] || part.label.en })]);
      host.appendChild(label);
    });
  }

  // ---- 5. Rendering: list -----------------------------------------------------

  function formatYear(dateStr) {
    if (!dateStr) { return "—"; }
    return dateStr.slice(0, 4);
  }

  function scoreRow(entry) {
    var parts = [];
    if (typeof entry.criticScore === "number") {
      parts.push(el("span", { "class": "mcu-item__score" }, [document.createTextNode("RT "), el("strong", { text: entry.criticScore + "%" })]));
    }
    if (typeof entry.imdbRating === "number") {
      parts.push(el("span", { "class": "mcu-item__score" }, [document.createTextNode("IMDb "), el("strong", { text: entry.imdbRating.toFixed(1) })]));
    }
    if (!parts.length) { return null; }
    return el("div", { "class": "mcu-item__scores" }, parts);
  }

  function postCreditRow(entry) {
    if (!state.options.showPostCredit || !entry.postCredit) { return null; }
    var text;
    if (entry.postCredit.mid && entry.postCredit.end) { text = t("postCreditYesBoth"); }
    else if (entry.postCredit.mid) { text = t("postCreditYesMid"); }
    else if (entry.postCredit.end) { text = t("postCreditYesEnd"); }
    else { text = t("postCreditNo"); }
    return el("p", { "class": "mcu-item__postcredit" }, [document.createTextNode(text)]);
  }

  function episodesBlock(entry) {
    if (!state.options.splitEpisodes || entry.category !== "series" || !Array.isArray(entry.seasons)) { return null; }
    var wrap = el("div", { "class": "mcu-item__episodes" });
    entry.seasons.forEach(function (s) {
      var seasonLabel = el("strong", { text: t("seasonLabel")(s.season) });
      wrap.appendChild(seasonLabel);
      for (var e = 1; e <= s.episodes; e++) {
        (function (season, ep) {
          var key = episodeKey(entry.id, season, ep);
          var cbId = "mcu-ep-" + key;
          var cb = el("input", { type: "checkbox", id: cbId });
          cb.checked = !!state.watched[key];
          cb.addEventListener("change", function () {
            state.watched[key] = cb.checked;
            saveState();
            renderItem(entry);
            renderSummary();
          });
          var row = el("label", { "class": "mcu-episode", "for": cbId }, [cb, el("span", { text: t("episodeLabel")(season, ep) })]);
          wrap.appendChild(row);
        })(s.season, e);
      }
    });
    return wrap;
  }

  var itemNodes = {}; // entry.id -> <li> element, so single-item updates skip a full re-render

  function buildItem(entry, index) {
    var watched = isWatched(entry);
    var cbId = "mcu-watched-" + entry.id;
    var cb = el("input", { type: "checkbox", id: cbId, "class": "mcu-item__watched" });
    cb.checked = watched === true;
    cb.indeterminate = watched === "partial";
    cb.setAttribute("aria-label", t("watchedLabel")(entry.title));
    cb.addEventListener("change", function () {
      setWatched(entry, cb.checked);
      renderItem(entry);
      renderSummary();
    });

    var badges = [el("span", { "class": "mcu-badge mcu-badge--" + entry.category, text: t("categories")[entry.category] })];
    if (entry.essentialTier) {
      badges.push(el("span", { "class": "mcu-badge mcu-badge--essential", text: t("tiers")[entry.essentialTier] }));
    }
    if (entry.isNonMCU) {
      badges.push(el("span", { "class": "mcu-badge mcu-badge--nonmcu", text: (I18N[lang].nonMcuGroups[entry.nonMCUGroup] || "") }));
    }
    if (entry.released === false) {
      badges.push(el("span", { "class": "mcu-badge mcu-badge--unreleased", text: t("unreleasedBadge") }));
    }

    var title = el("p", { "class": "mcu-item__title" }, [
      el("span", { "class": "mcu-item__index", text: String(index + 1) + "." }),
      el("label", { "for": cbId, text: entry.title })
    ]);

    var meta = el("p", { "class": "mcu-item__meta" }, [
      el("span", { text: formatYear(entry.releaseDate) }),
      entry.runtimeMinutes ? el("span", { text: entry.runtimeMinutes + " min" }) : null
    ]);

    var li = el("li", { "class": "mcu-item", "data-id": entry.id }, [
      cb,
      el("div", {}, [title, meta, scoreRow(entry), postCreditRow(entry), episodesBlock(entry)].filter(Boolean)),
      el("div", { "class": "mcu-item__badges" }, badges)
    ]);

    itemNodes[entry.id] = li;
    return li;
  }

  function renderItem(entry) {
    var old = itemNodes[entry.id];
    if (!old || !old.parentNode) { return; }
    var index = Array.prototype.indexOf.call(old.parentNode.children, old);
    var fresh = buildItem(entry, index);
    old.parentNode.replaceChild(fresh, old);
  }

  function renderList() {
    var host = document.getElementById("mcu-list");
    var empty = document.getElementById("mcu-empty");
    host.textContent = "";
    itemNodes = {};
    var entries = visibleEntries();
    entries.forEach(function (entry, i) { host.appendChild(buildItem(entry, i)); });
    empty.hidden = entries.length > 0;
    document.getElementById("mcu-results-count").textContent = t("resultsCount")(entries.length, allEntries().length);
  }

  function renderSummary() {
    var entries = allEntries().filter(function (e) { return e.released !== false; });
    var total = 0, watched = 0, next = null;
    entries
      .slice()
      .sort(function (a, b) { return (a.releaseDate || "") < (b.releaseDate || "") ? -1 : 1; })
      .forEach(function (entry) {
        var w = isWatched(entry);
        total++;
        if (w === true) { watched++; }
        else if (!next) { next = entry; }
      });
    var pct = total ? Math.round((watched / total) * 100) : 0;
    document.getElementById("mcu-progressbar").setAttribute("aria-valuenow", String(pct));
    document.getElementById("mcu-progressbar-fill").style.width = pct + "%";
    document.getElementById("mcu-progress-text").textContent = t("progressText")(watched, total, pct);
    document.getElementById("mcu-progress-next").textContent = next ? t("progressNext")(next.title) : t("progressNextNone");
  }

  function render() {
    renderCategoryFilters();
    renderPartFilters();
    renderList();
    renderSummary();
  }

  // ---- 6. i18n for static markup ---------------------------------------------

  function applyStaticI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var val = I18N[lang][key];
      if (typeof val === "string") { node.textContent = val; }
    });
    var asOf = document.getElementById("mcu-data-asof");
    if (asOf && DATA.meta && DATA.meta.dataAsOf) {
      asOf.textContent = (lang === "de" ? "Datenstand: " : "Data as of: ") + DATA.meta.dataAsOf;
    }
    var langBtn = document.getElementById("mcu-lang-toggle");
    if (langBtn) {
      langBtn.textContent = lang === "de" ? "EN" : "DE";
      langBtn.setAttribute("lang", lang === "de" ? "en" : "de");
    }
  }

  // ---- 7. Export / import -----------------------------------------------------

  function exportProgress() {
    try {
      var payload = { version: STATE_VERSION, exportedAt: new Date().toISOString(), watched: state.watched, options: state.options, order: state.order };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "mcu-tracker-progress.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (err) {
      alert(t("exportError"));
    }
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || typeof parsed.watched !== "object") { throw new Error("shape"); }
        var count = 0;
        Object.keys(parsed.watched).forEach(function (k) {
          if (typeof k === "string" && typeof parsed.watched[k] === "boolean") {
            state.watched[k] = parsed.watched[k];
            count++;
          }
        });
        saveState();
        render();
        alert(t("importSuccess")(count));
      } catch (err) {
        alert(t("importError"));
      }
    };
    reader.onerror = function () { alert(t("importError")); };
    reader.readAsText(file);
  }

  // ---- 8. Settings dialog ------------------------------------------------------

  function openSettings() {
    var backdrop = document.getElementById("mcu-settings-backdrop");
    backdrop.hidden = false;
    document.getElementById("mcu-tmdb-key").value = readTmdbKey();
    document.getElementById("mcu-settings-close").focus();
    document.addEventListener("keydown", onSettingsKeydown);
  }
  function closeSettings() {
    var backdrop = document.getElementById("mcu-settings-backdrop");
    backdrop.hidden = true;
    document.removeEventListener("keydown", onSettingsKeydown);
    document.getElementById("mcu-settings-open").focus();
  }
  function onSettingsKeydown(ev) { if (ev.key === "Escape") { closeSettings(); } }

  function verifyTmdbKey(key) {
    var status = document.getElementById("mcu-tmdb-status");
    if (!key) { writeTmdbKey(""); status.textContent = t("tmdbStatusCleared"); return; }
    fetch("https://api.themoviedb.org/3/authentication?api_key=" + encodeURIComponent(key))
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error("http")); })
      .then(function (json) {
        if (json && json.success) {
          writeTmdbKey(key);
          status.textContent = t("tmdbStatusSaved");
        } else {
          status.textContent = t("tmdbStatusError");
        }
      })
      .catch(function () { status.textContent = t("tmdbStatusError"); });
  }

  // ---- 9. Wire everything up ----------------------------------------------------

  function wireOptionToggle(elId, key) {
    var input = document.getElementById(elId);
    input.checked = state.options[key];
    input.addEventListener("change", function () {
      state.options[key] = input.checked;
      saveState();
      render();
    });
  }

  function init() {
    applyStaticI18n();

    document.getElementById("mcu-order").value = state.order;
    document.getElementById("mcu-order").addEventListener("change", function (ev) {
      state.order = ev.target.value;
      saveState();
      render();
    });

    document.getElementById("mcu-search").addEventListener("input", function (ev) {
      filters.search = ev.target.value.trim().toLowerCase();
      render();
    });

    wireOptionToggle("mcu-opt-episodes", "splitEpisodes");
    wireOptionToggle("mcu-opt-nonmcu", "includeNonMcu");
    wireOptionToggle("mcu-opt-postcredit", "showPostCredit");
    wireOptionToggle("mcu-opt-unwatched", "unwatchedOnly");

    document.getElementById("mcu-export").addEventListener("click", exportProgress);
    document.getElementById("mcu-import").addEventListener("change", function (ev) {
      if (ev.target.files && ev.target.files[0]) { importProgress(ev.target.files[0]); }
      ev.target.value = "";
    });

    document.getElementById("mcu-lang-toggle").addEventListener("click", function () {
      lang = (lang === "de") ? "en" : "de";
      writeLang(lang);
      applyStaticI18n();
      render();
    });

    document.getElementById("mcu-settings-open").addEventListener("click", openSettings);
    document.getElementById("mcu-settings-close").addEventListener("click", closeSettings);
    document.getElementById("mcu-settings-backdrop").addEventListener("click", function (ev) {
      if (ev.target === ev.currentTarget) { closeSettings(); }
    });
    document.getElementById("mcu-tmdb-save").addEventListener("click", function () {
      verifyTmdbKey(document.getElementById("mcu-tmdb-key").value.trim());
    });
    document.getElementById("mcu-tmdb-clear").addEventListener("click", function () {
      document.getElementById("mcu-tmdb-key").value = "";
      writeTmdbKey("");
      document.getElementById("mcu-tmdb-status").textContent = t("tmdbStatusCleared");
    });
    document.getElementById("mcu-reset-progress").addEventListener("click", function () {
      if (window.confirm(t("resetConfirm"))) {
        state.watched = {};
        saveState();
        render();
      }
    });

    render();
    document.getElementById("mcu-app").hidden = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
