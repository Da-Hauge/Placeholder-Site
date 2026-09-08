/* =========================================================================
   haug-it.eu — MCU tracker application logic.

   Progressive enhancement, same spirit as js/main.js: the #mcu-app section
   stays [hidden] until this file has actually built the UI, so a visitor
   without JS only ever sees the <noscript> notice, never a broken shell.

   Storage (see docs/verarbeitung.md V5/V6 and privacy-policy.html):
     haugit.mcu.progress  — watched map, per-item watch timestamps, partial
                             film-minute progress, and your filter/view
                             preferences. Written only as you use the
                             controls. Shape/versioning lives in
                             js/mcu-shared.js so this page and the
                             dashboard page read it identically.
     haugit.mcu.tmdbKey   — OPTIONAL, only if you add your own TMDb key.
     haugit.lang          — the same language key the rest of the site uses.

   No inline script (CSP forbids it). No eval, no innerHTML with anything
   that was not built through textContent/createElement.
   ========================================================================= */

(function () {
  "use strict";

  var SHARED = window.MCU_SHARED;
  var DATA = window.MCU_DATA;
  var I18N = window.MCU_I18N;
  var EXTRAS = window.MCU_EXTRAS || {};

  if (!DATA || !I18N || !SHARED) { return; } // a data file failed to load — leave the noscript message visible

  var TIER_RANK = { essential: 0, recommended: 1, optional: 2, skippable: 3 };
  var CATEGORY_ORDER = ["film", "series", "special", "short"];
  var STUDIO_ORDER = ["marvel-studios", "sony-spiderverse", "fox-x-men", "blade-original", "marvel-television-abc", "marvel-netflix"];

  var lang = SHARED.readLang();
  function t(key) { return I18N[lang][key]; }

  var state = SHARED.loadState();
  var filters = {
    search: "",
    categories: new Set(state.filters.categories),
    parts: new Set(state.filters.parts),
    studios: new Set(state.filters.studios)
  };

  function saveState() { SHARED.saveState(state); }
  function persistFilters() {
    state.filters = { categories: Array.from(filters.categories), parts: Array.from(filters.parts), studios: Array.from(filters.studios) };
    saveState();
  }

  // ---- Data helpers -----------------------------------------------------

  function allEntries() { return SHARED.allEntries(DATA, state.options.includeNonMcu); }
  function episodeKey(id, s, e) { return SHARED.episodeKey(id, s, e); }
  function isWatched(entry) { return SHARED.isWatched(state, entry); }

  function markWatchedKey(key, value) {
    if (value) { state.watched[key] = true; state.watchedAt[key] = new Date().toISOString(); }
    else { delete state.watched[key]; delete state.watchedAt[key]; }
  }

  function setWatched(entry, value) {
    if (entry.category === "series" && Array.isArray(entry.seasons)) {
      entry.seasons.forEach(function (s) {
        var count = SHARED.seasonEpisodeCount(s);
        for (var e = 1; e <= count; e++) { markWatchedKey(episodeKey(entry.id, s.season, e), value); }
      });
    } else {
      markWatchedKey(entry.id, value);
      if (value) {
        var mins = SHARED.totalRuntimeMinutes(entry);
        if (mins) { state.filmProgress[entry.id] = mins; }
      } else {
        delete state.filmProgress[entry.id];
      }
    }
    saveState();
  }

  function setEpisodeWatched(entry, season, ep, value) {
    markWatchedKey(episodeKey(entry.id, season, ep), value);
    saveState();
  }

  function setFilmProgress(entry, minutes) {
    var total = SHARED.totalRuntimeMinutes(entry);
    minutes = Math.max(0, Math.min(total, minutes));
    if (minutes <= 0) { delete state.filmProgress[entry.id]; }
    else { state.filmProgress[entry.id] = minutes; }
    if (total && minutes >= total) { markWatchedKey(entry.id, true); }
    else { delete state.watched[entry.id]; delete state.watchedAt[entry.id]; }
    saveState();
  }

  // ---- Timeline expansion (per-episode split) --------------------------

  function episodeOverride(season, ep) {
    if (!season.episodeTimeline) { return null; }
    for (var i = 0; i < season.episodeTimeline.length; i++) {
      if (season.episodeTimeline[i].episode === ep) { return season.episodeTimeline[i]; }
    }
    return null;
  }

  /* Each row is either {kind:'item', entry} or {kind:'episode', entry, season, episode, timelineOrder, note}.
     Episodes only become their own rows when splitting is on AND the sort is by timeline — see optSplitHelp. */
  function buildRows(list) {
    var interleave = state.options.splitEpisodes && state.order === "timeline";
    var rows = [];
    list.forEach(function (entry) {
      if (interleave && entry.category === "series" && Array.isArray(entry.seasons)) {
        entry.seasons.forEach(function (s) {
          var count = SHARED.seasonEpisodeCount(s);
          if (!count) { rows.push({ kind: "item", entry: entry }); return; }
          for (var e = 1; e <= count; e++) {
            var ov = episodeOverride(s, e);
            rows.push({ kind: "episode", entry: entry, season: s.season, episode: e, timelineOrder: ov ? ov.timelineOrder : entry.timelineOrder, note: ov ? ov.note : null });
          }
        });
      } else {
        rows.push({ kind: "item", entry: entry });
      }
    });
    return rows;
  }

  // ---- Filtering & sorting ------------------------------------------------

  function matchesEntry(entry) {
    if (filters.categories.size && !filters.categories.has(entry.category)) { return false; }
    if (filters.studios.size && !filters.studios.has(SHARED.getStudio(entry))) { return false; }
    if (filters.parts.size) {
      var hit = (entry.parts || []).some(function (p) { return filters.parts.has(p); });
      if (!hit) { return false; }
    }
    if (filters.search && entry.title.toLowerCase().indexOf(filters.search) === -1) { return false; }
    if (state.options.unwatchedOnly && isWatched(entry) === true) { return false; }
    return true;
  }

  function rowSortValue(row) {
    var entry = row.entry;
    if (row.kind === "episode" && state.order === "timeline") { return row.timelineOrder; }
    switch (state.order) {
      case "timeline": return entry.timelineOrder;
      case "title": return entry.title.toLowerCase();
      case "critic": return -(typeof entry.criticScore === "number" ? entry.criticScore : -1);
      case "importance": return TIER_RANK[entry.essentialTier] != null ? TIER_RANK[entry.essentialTier] : 9;
      case "release":
      default: return entry.releaseDate || "9999";
    }
  }

  function visibleRows() {
    var entries = allEntries().filter(matchesEntry);
    var rows = buildRows(entries);
    rows.sort(function (a, b) {
      var av = rowSortValue(a), bv = rowSortValue(b);
      if (av < bv) { return -1; }
      if (av > bv) { return 1; }
      var at = a.entry.title, bt = b.entry.title;
      if (at !== bt) { return at < bt ? -1 : 1; }
      if (a.kind === "episode" && b.kind === "episode") { return (a.season - b.season) || (a.episode - b.episode); }
      return 0;
    });
    return rows;
  }

  function groupKeyFor(entry) {
    switch (state.groupBy) {
      case "studio": return SHARED.getStudio(entry);
      case "category": return entry.category;
      case "phase": return entry.phase != null ? ("phase-" + entry.phase) : "phase-unknown";
      default: return "all";
    }
  }
  function groupLabelFor(key) {
    if (state.groupBy === "studio") { return I18N[lang].studios[key] || key; }
    if (state.groupBy === "category") { return t("categories")[key]; }
    if (state.groupBy === "phase") {
      if (key === "phase-unknown") { return lang === "de" ? "Ohne Phase" : "No phase"; }
      return (lang === "de" ? "Phase " : "Phase ") + key.replace("phase-", "");
    }
    return "";
  }
  function groupOrderKey(key) {
    if (state.groupBy === "studio") { return STUDIO_ORDER.indexOf(key); }
    if (state.groupBy === "category") { return CATEGORY_ORDER.indexOf(key); }
    if (state.groupBy === "phase") { return key === "phase-unknown" ? 999 : parseInt(key.replace("phase-", ""), 10); }
    return 0;
  }

  // ---- DOM helpers --------------------------------------------------------

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

  // ---- Multi-select dropdown component -------------------------------------

  var openDropdown = null;
  function closeOpenDropdown() {
    if (openDropdown) { openDropdown.panel.hidden = true; openDropdown.btn.setAttribute("aria-expanded", "false"); openDropdown = null; }
  }
  document.addEventListener("click", function (ev) {
    if (openDropdown && !openDropdown.root.contains(ev.target)) { closeOpenDropdown(); }
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { closeOpenDropdown(); } });

  function buildMultiSelect(opts) {
    // opts: { id, label, options: [{id,label}], selected: Set, onChange }
    var root = el("div", { "class": "mcu-msel", id: opts.id });
    var btn = el("button", { type: "button", "class": "mcu-msel__btn", "aria-haspopup": "listbox", "aria-expanded": "false" });
    var btnLabel = el("span", { text: opts.label });
    var btnCount = el("span", { "class": "mcu-msel__count" });
    btn.appendChild(btnLabel);
    btn.appendChild(btnCount);

    var panel = el("div", { "class": "mcu-msel__panel", role: "listbox", "aria-multiselectable": "true", hidden: "" });
    var actions = el("div", { "class": "mcu-msel__actions" });
    var allBtn = el("button", { type: "button", "class": "mcu-msel__mini", text: t("mselAll") });
    var clearBtn = el("button", { type: "button", "class": "mcu-msel__mini", text: t("mselClear") });
    actions.appendChild(allBtn);
    actions.appendChild(clearBtn);
    panel.appendChild(actions);

    function updateCount() {
      btnCount.textContent = opts.selected.size ? String(opts.selected.size) : t("mselNone");
    }

    var checks = [];
    opts.options.forEach(function (o) {
      var cbId = opts.id + "-" + o.id;
      var cb = el("input", { type: "checkbox", id: cbId, value: o.id });
      cb.checked = opts.selected.has(o.id);
      cb.addEventListener("change", function () {
        if (cb.checked) { opts.selected.add(o.id); } else { opts.selected.delete(o.id); }
        updateCount();
        opts.onChange();
      });
      checks.push(cb);
      var label = el("label", { "class": "mcu-check" }, [cb, el("span", { text: o.label })]);
      panel.appendChild(label);
    });

    allBtn.addEventListener("click", function () {
      checks.forEach(function (cb) { cb.checked = true; opts.selected.add(cb.value); });
      updateCount(); opts.onChange();
    });
    clearBtn.addEventListener("click", function () {
      checks.forEach(function (cb) { cb.checked = false; });
      opts.selected.clear();
      updateCount(); opts.onChange();
    });

    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (openDropdown && openDropdown.root === root) { closeOpenDropdown(); return; }
      closeOpenDropdown();
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      openDropdown = { root: root, btn: btn, panel: panel };
    });

    updateCount();
    root.appendChild(btn);
    root.appendChild(panel);
    return root;
  }

  function renderCategoryFilter() {
    var host = document.getElementById("mcu-category-filters");
    host.textContent = "";
    host.appendChild(buildMultiSelect({
      id: "mcu-msel-category",
      label: t("categoryLegend"),
      options: CATEGORY_ORDER.map(function (c) { return { id: c, label: t("categories")[c] }; }),
      selected: filters.categories,
      onChange: function () { persistFilters(); render(); }
    }));
  }
  function renderPartFilter() {
    var host = document.getElementById("mcu-part-filters");
    host.textContent = "";
    host.appendChild(buildMultiSelect({
      id: "mcu-msel-part",
      label: t("partLegend"),
      options: (DATA.meta.partsVocab || []).map(function (p) { return { id: p.id, label: p.label[lang] || p.label.en }; }),
      selected: filters.parts,
      onChange: function () { persistFilters(); render(); }
    }));
  }
  function renderStudioFilter() {
    var host = document.getElementById("mcu-studio-filters");
    host.textContent = "";
    host.appendChild(buildMultiSelect({
      id: "mcu-msel-studio",
      label: t("studioLegend"),
      options: STUDIO_ORDER.filter(function (s) { return state.options.includeNonMcu || s === "marvel-studios"; })
        .map(function (s) { return { id: s, label: I18N[lang].studios[s] }; }),
      selected: filters.studios,
      onChange: function () { persistFilters(); render(); }
    }));
  }

  // ---- Row rendering --------------------------------------------------------

  function formatYear(dateStr) { return dateStr ? dateStr.slice(0, 4) : "—"; }

  function platformBadge(entry) {
    var code = SHARED.getPlatformCode(entry);
    return el("span", { "class": "mcu-badge mcu-badge--platform", title: I18N[lang].platformNote, text: I18N[lang].platforms[code] });
  }
  function studioBadge(entry) {
    var studio = SHARED.getStudio(entry);
    return el("span", { "class": "mcu-badge mcu-badge--studio", text: I18N[lang].studios[studio] });
  }

  function scoreRow(entry) {
    var parts = [];
    if (typeof entry.criticScore === "number") { parts.push(el("span", { "class": "mcu-item__score" }, [document.createTextNode("RT "), el("strong", { text: entry.criticScore + "%" })])); }
    if (typeof entry.imdbRating === "number") { parts.push(el("span", { "class": "mcu-item__score" }, [document.createTextNode("IMDb "), el("strong", { text: entry.imdbRating.toFixed(1) })])); }
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

  function countMeta(entry) {
    var bits = [];
    if (entry.category === "series") {
      var totalEp = SHARED.totalEpisodes(entry);
      if (entry.seasons && entry.seasons.length > 1) { bits.push(t("seasonCount")(entry.seasons.length)); }
      if (totalEp) { bits.push(t("episodeCount")(totalEp)); }
      var watchedEp = SHARED.watchedEpisodeCount(state, entry);
      if (watchedEp) { bits.push(watchedEp + "/" + totalEp); }
    } else {
      var mins = SHARED.totalRuntimeMinutes(entry);
      if (mins) { bits.push(t("runtimeMinutesLabel")(mins)); }
    }
    return bits;
  }

  var itemNodes = {};

  function watchedCheckbox(entry, ariaLabel, onChange, checkedOverride, indetOverride) {
    var cbId = "mcu-w-" + (entry.id) + "-" + Math.random().toString(36).slice(2, 7);
    var cb = el("input", { type: "checkbox", id: cbId, "class": "mcu-item__watched" });
    cb.checked = checkedOverride === true;
    cb.indeterminate = indetOverride === "partial";
    cb.setAttribute("aria-label", ariaLabel);
    cb.addEventListener("click", function (ev) { ev.stopPropagation(); });
    cb.addEventListener("change", onChange);
    return cb;
  }

  function buildItemRow(entry, index) {
    var watched = isWatched(entry);
    var cb = watchedCheckbox(entry, t("watchedLabel")(entry.title), function () {
      setWatched(entry, cb.checked);
      renderItem(entry);
      renderSummary();
    }, watched === true, watched);

    var badges = [
      el("span", { "class": "mcu-badge mcu-badge--" + entry.category, text: t("categories")[entry.category] }),
      studioBadge(entry),
      platformBadge(entry)
    ];
    if (entry.essentialTier) { badges.push(el("span", { "class": "mcu-badge mcu-badge--essential", text: t("tiers")[entry.essentialTier] })); }
    if (entry.released === false) { badges.push(el("span", { "class": "mcu-badge mcu-badge--unreleased", text: t("unreleasedBadge") })); }

    var titleBtn = el("button", { type: "button", "class": "mcu-item__titlebtn", "aria-haspopup": "dialog", "aria-label": t("detailOpen")(entry.title) }, [
      el("span", { "class": "mcu-item__index", text: String(index + 1) + ". " }),
      el("span", { text: entry.title })
    ]);
    titleBtn.addEventListener("click", function () { openDetail(entry); });

    var meta = el("p", { "class": "mcu-item__meta" }, [el("span", { text: formatYear(entry.releaseDate) })].concat(countMeta(entry).map(function (b) { return el("span", { text: b }); })));

    var li = el("li", { "class": "mcu-item", "data-id": entry.id }, [
      cb,
      el("div", {}, [el("p", { "class": "mcu-item__title" }, [titleBtn]), meta, scoreRow(entry), postCreditRow(entry)].filter(Boolean)),
      el("div", { "class": "mcu-item__badges" }, badges)
    ]);
    itemNodes[entry.id] = li;
    return li;
  }

  function buildEpisodeRow(row, index) {
    var entry = row.entry;
    var key = episodeKey(entry.id, row.season, row.episode);
    var checked = !!state.watched[key];
    var cb = watchedCheckbox(entry, t("episodeLabel")(row.season, row.episode), function () {
      setEpisodeWatched(entry, row.season, row.episode, cb.checked);
      renderSummary();
    }, checked, false);

    var titleBtn = el("button", { type: "button", "class": "mcu-item__titlebtn", "aria-haspopup": "dialog", "aria-label": t("detailOpen")(entry.title) }, [
      el("span", { "class": "mcu-item__index", text: String(index + 1) + ". " }),
      el("span", { text: entry.title + " — " + t("episodeLabel")(row.season, row.episode) })
    ]);
    titleBtn.addEventListener("click", function () { openDetail(entry); });

    var metaBits = [el("span", { text: formatYear(entry.releaseDate) })];
    if (row.note) { metaBits.push(el("span", { "class": "mcu-item__episnote", text: row.note })); }

    var li = el("li", { "class": "mcu-item mcu-item--episode", "data-id": key }, [
      cb,
      el("div", {}, [el("p", { "class": "mcu-item__title" }, [titleBtn]), el("p", { "class": "mcu-item__meta" }, metaBits)]),
      el("div", { "class": "mcu-item__badges" }, [el("span", { "class": "mcu-badge mcu-badge--series", text: t("categories").series })])
    ]);
    return li;
  }

  function renderItem(entry) {
    var old = itemNodes[entry.id];
    if (!old || !old.parentNode) { return; }
    var index = Array.prototype.indexOf.call(old.parentNode.children, old);
    var fresh = buildItemRow(entry, index);
    old.parentNode.replaceChild(fresh, old);
  }

  // ---- List / grouped rendering ------------------------------------------------

  function buildList(rows, startIndex) {
    var ol = el("ol", { "class": "mcu-list" });
    rows.forEach(function (row, i) {
      ol.appendChild(row.kind === "episode" ? buildEpisodeRow(row, startIndex + i) : buildItemRow(row.entry, startIndex + i));
    });
    return ol;
  }

  function renderList() {
    var host = document.getElementById("mcu-list-host");
    var empty = document.getElementById("mcu-empty");
    host.textContent = "";
    itemNodes = {};
    var rows = visibleRows();
    host.classList.toggle("mcu-list-host--compact", state.view === "compact");

    if (state.groupBy === "none") {
      host.appendChild(buildList(rows, 0));
    } else {
      var buckets = {};
      var order = [];
      rows.forEach(function (row) {
        var key = groupKeyFor(row.entry);
        if (!buckets[key]) { buckets[key] = []; order.push(key); }
        buckets[key].push(row);
      });
      order.sort(function (a, b) { return groupOrderKey(a) - groupOrderKey(b); });
      var running = 0;
      order.forEach(function (key) {
        var section = el("section", { "class": "mcu-group" });
        section.appendChild(el("h3", { "class": "mcu-group__heading" }, [document.createTextNode(groupLabelFor(key)), el("span", { "class": "mcu-group__count", text: String(buckets[key].length) })]));
        section.appendChild(buildList(buckets[key], running));
        running += buckets[key].length;
        host.appendChild(section);
      });
    }

    empty.hidden = rows.length > 0;
    document.getElementById("mcu-results-count").textContent = t("resultsCount")(rows.length, allEntries().length);
  }

  function renderSummary() {
    var entries = allEntries().filter(function (e) { return e.released !== false; });
    var total = 0, watched = 0, next = null;
    entries.slice().sort(function (a, b) { return (a.releaseDate || "") < (b.releaseDate || "") ? -1 : 1; }).forEach(function (entry) {
      var w = isWatched(entry);
      total++;
      if (w === true) { watched++; } else if (!next) { next = entry; }
    });
    var pct = total ? Math.round((watched / total) * 100) : 0;
    document.getElementById("mcu-progressbar").setAttribute("aria-valuenow", String(pct));
    document.getElementById("mcu-progressbar-fill").style.width = pct + "%";
    document.getElementById("mcu-progress-text").textContent = t("progressText")(watched, total, pct);
    document.getElementById("mcu-progress-next").textContent = next ? t("progressNext")(next.title) : t("progressNextNone");
  }

  function render() {
    renderCategoryFilter();
    renderPartFilter();
    renderStudioFilter();
    renderList();
    renderSummary();
  }

  // ---- Detail dialog ---------------------------------------------------------

  var detailLastFocus = null;

  function buildEpisodeChecklist(entry) {
    var wrap = el("div", { "class": "mcu-detail__episodes" });
    entry.seasons.forEach(function (s) {
      var count = SHARED.seasonEpisodeCount(s);
      if (!count) { return; }
      wrap.appendChild(el("h4", { text: t("seasonLabel")(s.season) }));
      var grid = el("div", { "class": "mcu-detail__epgrid" });
      for (var e = 1; e <= count; e++) {
        (function (season, ep) {
          var key = episodeKey(entry.id, season, ep);
          var cbId = "mcu-detail-ep-" + key;
          var cb = el("input", { type: "checkbox", id: cbId });
          cb.checked = !!state.watched[key];
          cb.addEventListener("change", function () {
            setEpisodeWatched(entry, season, ep, cb.checked);
            renderSummary();
            renderItem(entry);
          });
          grid.appendChild(el("label", { "class": "mcu-episode", "for": cbId }, [cb, el("span", { text: String(ep) })]));
        })(s.season, e);
      }
      wrap.appendChild(grid);
    });
    return wrap;
  }

  function buildFilmProgress(entry) {
    var total = SHARED.totalRuntimeMinutes(entry);
    if (!total) {
      var cb = el("input", { type: "checkbox", id: "mcu-detail-watched" });
      cb.checked = !!state.watched[entry.id];
      cb.addEventListener("change", function () { setWatched(entry, cb.checked); renderSummary(); renderItem(entry); });
      return el("div", { "class": "mcu-detail__progress" }, [el("label", { "class": "mcu-check", "for": "mcu-detail-watched" }, [cb, el("span", { text: t("watchedLabel")(entry.title) })])]);
    }
    var current = state.filmProgress[entry.id] || (state.watched[entry.id] ? total : 0);
    var range = el("input", { type: "range", min: "0", max: String(total), step: "1", id: "mcu-detail-range" });
    range.value = String(current);
    var readout = el("span", { "class": "mcu-detail__readout", text: t("detailMinutesOf")(current, total) });
    range.addEventListener("input", function () { readout.textContent = t("detailMinutesOf")(parseInt(range.value, 10), total); });
    range.addEventListener("change", function () {
      setFilmProgress(entry, parseInt(range.value, 10));
      renderSummary(); renderItem(entry);
      range.value = String(state.filmProgress[entry.id] || 0);
    });
    var fullBtn = el("button", { type: "button", "class": "btn btn--ghost", text: t("detailMarkFull") });
    fullBtn.addEventListener("click", function () {
      setFilmProgress(entry, total);
      range.value = String(total);
      readout.textContent = t("detailMinutesOf")(total, total);
      renderSummary(); renderItem(entry);
    });
    return el("div", { "class": "mcu-detail__progress" }, [range, readout, fullBtn]);
  }

  function openDetail(entry) {
    detailLastFocus = document.activeElement;
    var backdrop = document.getElementById("mcu-detail-backdrop");
    var body = document.getElementById("mcu-detail-body");
    body.textContent = "";

    document.getElementById("mcu-detail-title").textContent = entry.title;

    var badges = el("div", { "class": "mcu-detail__badges" }, [
      el("span", { "class": "mcu-badge mcu-badge--" + entry.category, text: t("categories")[entry.category] }),
      studioBadge(entry),
      platformBadge(entry),
      entry.essentialTier ? el("span", { "class": "mcu-badge mcu-badge--essential", text: t("tiers")[entry.essentialTier] }) : null
    ].filter(Boolean));
    body.appendChild(badges);

    var metaLine = [formatYear(entry.releaseDate)].concat(countMeta(entry)).join(" · ");
    body.appendChild(el("p", { "class": "mcu-detail__meta", text: metaLine }));

    if (typeof entry.criticScore === "number" || typeof entry.imdbRating === "number") {
      body.appendChild(el("h3", { text: t("detailScoresHeading") }));
      body.appendChild(scoreRow(entry) || el("p", {}));
    }

    if (entry.postCredit) {
      var pcText = entry.postCredit.mid && entry.postCredit.end ? t("postCreditYesBoth") : entry.postCredit.mid ? t("postCreditYesMid") : entry.postCredit.end ? t("postCreditYesEnd") : t("postCreditNo");
      body.appendChild(el("p", { "class": "note" }, [document.createTextNode(pcText)]));
    }

    var extra = EXTRAS[entry.id];
    if (extra && extra.trivia && extra.trivia.length) {
      body.appendChild(el("h3", { text: t("triviaHeading") }));
      var ul = el("ul");
      extra.trivia.forEach(function (line) { ul.appendChild(el("li", { text: line })); });
      body.appendChild(ul);
    }
    if (extra && extra.skip) {
      var spoilerWrap = el("div", { "class": "mcu-spoiler" });
      var revealBtn = el("button", { type: "button", "class": "btn btn--ghost", text: t("skipRevealBtn") });
      var spoilerText = el("p", { "class": "mcu-spoiler__text", hidden: "" }, [document.createTextNode(extra.skip)]);
      revealBtn.addEventListener("click", function () {
        var hidden = spoilerText.hidden;
        spoilerText.hidden = !hidden;
        revealBtn.textContent = hidden ? t("skipHideBtn") : t("skipRevealBtn");
      });
      spoilerWrap.appendChild(revealBtn);
      spoilerWrap.appendChild(spoilerText);
      body.appendChild(spoilerWrap);
    }

    body.appendChild(el("h3", { text: t("detailProgressHeading") }));
    if (entry.category === "series" && Array.isArray(entry.seasons)) {
      body.appendChild(buildEpisodeChecklist(entry));
    } else {
      body.appendChild(buildFilmProgress(entry));
    }

    var watchedAtKey = entry.category === "series" ? null : entry.id;
    if (watchedAtKey && state.watchedAt[watchedAtKey]) {
      body.appendChild(el("p", { "class": "mcu-detail__watchedat", text: t("watchedAtLabel")(new Date(state.watchedAt[watchedAtKey]).toLocaleDateString(lang)) }));
    }

    backdrop.hidden = false;
    document.getElementById("mcu-detail-close").focus();
    document.addEventListener("keydown", onDetailKeydown);
  }
  function closeDetail() {
    document.getElementById("mcu-detail-backdrop").hidden = true;
    document.removeEventListener("keydown", onDetailKeydown);
    if (detailLastFocus && typeof detailLastFocus.focus === "function") { detailLastFocus.focus(); }
  }
  function onDetailKeydown(ev) { if (ev.key === "Escape") { closeDetail(); } }

  // ---- i18n for static markup ---------------------------------------------

  function applyStaticI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var val = I18N[lang][node.getAttribute("data-i18n")];
      if (typeof val === "string") { node.textContent = val; }
    });
    var asOf = document.getElementById("mcu-data-asof");
    if (asOf && DATA.meta && DATA.meta.dataAsOf) { asOf.textContent = (lang === "de" ? "Datenstand: " : "Data as of: ") + DATA.meta.dataAsOf; }
    var langBtn = document.getElementById("mcu-lang-toggle");
    if (langBtn) { langBtn.textContent = lang === "de" ? "EN" : "DE"; langBtn.setAttribute("lang", lang === "de" ? "en" : "de"); }
    var splitHelp = document.getElementById("mcu-split-help");
    if (splitHelp) { splitHelp.textContent = t("optSplitHelp"); }
  }

  // ---- Export / import -----------------------------------------------------

  function exportProgress() {
    try {
      var payload = { version: SHARED.STATE_VERSION, exportedAt: new Date().toISOString(), watched: state.watched, watchedAt: state.watchedAt, filmProgress: state.filmProgress, options: state.options, order: state.order, groupBy: state.groupBy, view: state.view, filters: state.filters };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "mcu-tracker-progress.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (err) { alert(t("exportError")); }
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || typeof parsed.watched !== "object") { throw new Error("shape"); }
        var count = 0;
        Object.keys(parsed.watched).forEach(function (k) {
          if (typeof k === "string" && typeof parsed.watched[k] === "boolean") { state.watched[k] = parsed.watched[k]; count++; }
        });
        if (parsed.watchedAt && typeof parsed.watchedAt === "object") {
          Object.keys(parsed.watchedAt).forEach(function (k) {
            if (typeof parsed.watchedAt[k] === "string" && !isNaN(Date.parse(parsed.watchedAt[k]))) { state.watchedAt[k] = parsed.watchedAt[k]; }
          });
        }
        if (parsed.filmProgress && typeof parsed.filmProgress === "object") {
          Object.keys(parsed.filmProgress).forEach(function (k) {
            if (typeof parsed.filmProgress[k] === "number") { state.filmProgress[k] = parsed.filmProgress[k]; }
          });
        }
        saveState();
        render();
        alert(t("importSuccess")(count));
      } catch (err) { alert(t("importError")); }
    };
    reader.onerror = function () { alert(t("importError")); };
    reader.readAsText(file);
  }

  // ---- Settings dialog ------------------------------------------------------

  function openSettings() {
    var backdrop = document.getElementById("mcu-settings-backdrop");
    backdrop.hidden = false;
    document.getElementById("mcu-tmdb-key").value = SHARED.readTmdbKey();
    document.getElementById("mcu-settings-close").focus();
    document.addEventListener("keydown", onSettingsKeydown);
  }
  function closeSettings() {
    document.getElementById("mcu-settings-backdrop").hidden = true;
    document.removeEventListener("keydown", onSettingsKeydown);
    document.getElementById("mcu-settings-open").focus();
  }
  function onSettingsKeydown(ev) { if (ev.key === "Escape") { closeSettings(); } }

  function verifyTmdbKey(key) {
    var status = document.getElementById("mcu-tmdb-status");
    if (!key) { SHARED.writeTmdbKey(""); status.textContent = t("tmdbStatusCleared"); return; }
    fetch("https://api.themoviedb.org/3/authentication?api_key=" + encodeURIComponent(key))
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error("http")); })
      .then(function (json) {
        if (json && json.success) { SHARED.writeTmdbKey(key); status.textContent = t("tmdbStatusSaved"); }
        else { status.textContent = t("tmdbStatusError"); }
      })
      .catch(function () { status.textContent = t("tmdbStatusError"); });
  }

  // ---- Wire everything up ----------------------------------------------------

  function wireOptionToggle(elId, key) {
    var input = document.getElementById(elId);
    input.checked = state.options[key];
    input.addEventListener("change", function () { state.options[key] = input.checked; saveState(); render(); });
  }

  function init() {
    applyStaticI18n();

    document.getElementById("mcu-order").value = state.order;
    document.getElementById("mcu-order").addEventListener("change", function (ev) { state.order = ev.target.value; saveState(); render(); });

    document.getElementById("mcu-groupby").value = state.groupBy;
    document.getElementById("mcu-groupby").addEventListener("change", function (ev) { state.groupBy = ev.target.value; saveState(); render(); });

    var viewToggle = document.getElementById("mcu-view-toggle");
    function labelView() { viewToggle.textContent = state.view === "compact" ? t("viewToggleComfortable") : t("viewToggleCompact"); }
    labelView();
    viewToggle.addEventListener("click", function () { state.view = state.view === "compact" ? "comfortable" : "compact"; saveState(); labelView(); renderList(); });

    document.getElementById("mcu-search").addEventListener("input", function (ev) { filters.search = ev.target.value.trim().toLowerCase(); render(); });

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
      SHARED.writeLang(lang);
      applyStaticI18n();
      labelView();
      render();
    });

    document.getElementById("mcu-settings-open").addEventListener("click", openSettings);
    document.getElementById("mcu-settings-close").addEventListener("click", closeSettings);
    document.getElementById("mcu-settings-backdrop").addEventListener("click", function (ev) { if (ev.target === ev.currentTarget) { closeSettings(); } });
    document.getElementById("mcu-tmdb-save").addEventListener("click", function () { verifyTmdbKey(document.getElementById("mcu-tmdb-key").value.trim()); });
    document.getElementById("mcu-tmdb-clear").addEventListener("click", function () {
      document.getElementById("mcu-tmdb-key").value = "";
      SHARED.writeTmdbKey("");
      document.getElementById("mcu-tmdb-status").textContent = t("tmdbStatusCleared");
    });
    document.getElementById("mcu-reset-progress").addEventListener("click", function () {
      if (window.confirm(t("resetConfirm"))) {
        state.watched = {}; state.watchedAt = {}; state.filmProgress = {};
        saveState(); render();
      }
    });

    document.getElementById("mcu-detail-close").addEventListener("click", closeDetail);
    document.getElementById("mcu-detail-backdrop").addEventListener("click", function (ev) { if (ev.target === ev.currentTarget) { closeDetail(); } });

    render();
    document.getElementById("mcu-app").hidden = false;
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
