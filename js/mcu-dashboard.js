/* =========================================================================
   haug-it.eu — MCU tracker dashboard.

   Read-only view over the same haugit.mcu.progress data the tracker
   writes (see js/mcu-shared.js). Charts are hand-built inline SVG — no
   charting library, because loading one would mean a CDN script and this
   site's CSP (script-src 'self', no wildcards) doesn't allow that. See
   docs/security-hinweise.md.
   ========================================================================= */

(function () {
  "use strict";

  var SHARED = window.MCU_SHARED;
  var DATA = window.MCU_DATA;
  var I18N = window.MCU_I18N;
  if (!DATA || !I18N || !SHARED) { return; }

  var lang = SHARED.readLang();
  function t(key) { return I18N[lang][key]; }
  var state = SHARED.loadState();

  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) { Object.keys(attrs).forEach(function (k) { if (k === "text") { node.textContent = attrs[k]; } else { node.setAttribute(k, attrs[k]); } }); }
    (children || []).forEach(function (c) { if (c) { node.appendChild(c); } });
    return node;
  }

  function formatMinutes(mins) {
    var h = Math.floor(mins / 60), m = Math.round(mins % 60);
    if (h <= 0) { return m + t("minutesUnit"); }
    return h + t("hoursUnit") + " " + m + t("minutesUnit");
  }

  // ---- Gather stats -------------------------------------------------------

  function computeTotals(entries) {
    var watchedCount = 0, totalCount = 0, watchedMin = 0, totalMin = 0;
    entries.forEach(function (entry) {
      if (entry.released === false) { return; }
      totalCount++;
      var mins = SHARED.totalRuntimeMinutes(entry);
      totalMin += mins;
      var w = SHARED.isWatched(state, entry);
      if (w === true) { watchedCount++; watchedMin += mins; }
      else if (w === "partial") {
        if (entry.category === "series") {
          var wEp = SHARED.watchedEpisodeCount(state, entry);
          var totalEp = SHARED.totalEpisodes(entry);
          if (totalEp) { watchedMin += mins * (wEp / totalEp); }
        } else {
          watchedMin += (state.filmProgress[entry.id] || 0);
        }
      }
    });
    return { watchedCount: watchedCount, totalCount: totalCount, watchedMin: Math.round(watchedMin), totalMin: Math.round(totalMin) };
  }

  function renderStats(entries) {
    var totals = computeTotals(entries);
    var host = document.getElementById("mcu-dash-stats");
    host.textContent = "";
    function stat(label, value, sub) {
      return el("div", { "class": "mcu-stat" }, [el("p", { "class": "mcu-stat__value", text: value }), el("p", { "class": "mcu-stat__label", text: label }), sub ? el("p", { "class": "mcu-stat__sub", text: sub }) : null].filter(Boolean));
    }
    host.appendChild(stat(t("statWatched"), String(totals.watchedCount), t("statTitlesLabel")(totals.watchedCount)));
    host.appendChild(stat(t("statRemaining"), String(totals.totalCount - totals.watchedCount), t("statTitlesLabel")(totals.totalCount - totals.watchedCount)));
    host.appendChild(stat(t("statWatchedTime"), formatMinutes(totals.watchedMin)));
    host.appendChild(stat(t("statRemainingTime"), formatMinutes(Math.max(0, totals.totalMin - totals.watchedMin))));
    return totals;
  }

  // ---- Bar chart: progress by bucket (category / studio / tier) -----------

  function renderBarChart(hostId, headingKey, entries, bucketFn, labelFn, order) {
    var host = document.getElementById(hostId);
    host.textContent = "";
    host.appendChild(el("h2", { text: t(headingKey) }));

    var buckets = {};
    entries.forEach(function (entry) {
      if (entry.released === false) { return; }
      var key = bucketFn(entry);
      if (!buckets[key]) { buckets[key] = { total: 0, watched: 0 }; }
      buckets[key].total++;
      if (SHARED.isWatched(state, entry) === true) { buckets[key].watched++; }
    });

    var keys = Object.keys(buckets);
    if (order) { keys.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); }); }
    if (!keys.length) { host.appendChild(el("p", { "class": "note", text: t("chartOverTimeEmpty") })); return; }

    var barH = 28, gap = 12, labelW = 170, chartW = 420, padTop = 6;
    var height = keys.length * (barH + gap) + padTop;
    var svg = svgEl("svg", { viewBox: "0 0 " + (labelW + chartW + 50) + " " + height, class: "mcu-chart", role: "img", "aria-label": t(headingKey) });

    keys.forEach(function (key, i) {
      var b = buckets[key];
      var y = padTop + i * (barH + gap);
      var pct = b.total ? b.watched / b.total : 0;
      var w = Math.round(chartW * pct);

      svg.appendChild(svgEl("text", { x: 0, y: y + barH * 0.68, class: "mcu-chart__label" })).textContent = labelFn(key);
      svg.appendChild(svgEl("rect", { x: labelW, y: y, width: chartW, height: barH, rx: 4, class: "mcu-chart__track" }));
      svg.appendChild(svgEl("rect", { x: labelW, y: y, width: Math.max(w, b.watched ? 3 : 0), height: barH, rx: 4, class: "mcu-chart__fill" }));
      var countLabel = svgEl("text", { x: labelW + chartW + 8, y: y + barH * 0.68, class: "mcu-chart__count" });
      countLabel.textContent = b.watched + "/" + b.total;
      svg.appendChild(countLabel);
    });

    host.appendChild(svg);
  }

  // ---- Line/area chart: cumulative watched over time -----------------------

  function renderOverTimeChart(entries) {
    var host = document.getElementById("mcu-dash-overtime");
    host.textContent = "";
    host.appendChild(el("h2", { text: t("chartOverTimeHeading") }));

    var dates = Object.keys(state.watchedAt).sort();
    if (!dates.length) { host.appendChild(el("p", { "class": "note", text: t("chartOverTimeEmpty") })); return; }

    var byDay = {};
    dates.forEach(function (key) {
      var day = state.watchedAt[key].slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    var days = Object.keys(byDay).sort();
    var cumulative = [];
    var running = 0;
    days.forEach(function (d) { running += byDay[d]; cumulative.push({ day: d, count: running }); });

    var w = 640, h = 220, padL = 40, padB = 30, padT = 10, padR = 10;
    var max = cumulative[cumulative.length - 1].count;
    var svg = svgEl("svg", { viewBox: "0 0 " + w + " " + h, class: "mcu-chart mcu-chart--line", role: "img", "aria-label": t("chartOverTimeHeading") });

    var plotW = w - padL - padR, plotH = h - padT - padB;
    function xFor(i) { return padL + (cumulative.length > 1 ? (i / (cumulative.length - 1)) * plotW : plotW / 2); }
    function yFor(v) { return padT + plotH - (max ? (v / max) * plotH : 0); }

    // axis
    svg.appendChild(svgEl("line", { x1: padL, y1: padT, x2: padL, y2: padT + plotH, class: "mcu-chart__axis" }));
    svg.appendChild(svgEl("line", { x1: padL, y1: padT + plotH, x2: padL + plotW, y2: padT + plotH, class: "mcu-chart__axis" }));

    var pathD = cumulative.map(function (p, i) { return (i === 0 ? "M" : "L") + xFor(i) + " " + yFor(p.count); }).join(" ");
    var areaD = pathD + " L " + xFor(cumulative.length - 1) + " " + (padT + plotH) + " L " + xFor(0) + " " + (padT + plotH) + " Z";
    svg.appendChild(svgEl("path", { d: areaD, class: "mcu-chart__area" }));
    svg.appendChild(svgEl("path", { d: pathD, class: "mcu-chart__line" }));

    cumulative.forEach(function (p, i) { svg.appendChild(svgEl("circle", { cx: xFor(i), cy: yFor(p.count), r: 3, class: "mcu-chart__point" })); });

    // y-axis max label
    var yMaxLabel = svgEl("text", { x: 4, y: padT + 8, class: "mcu-chart__count" });
    yMaxLabel.textContent = String(max);
    svg.appendChild(yMaxLabel);
    var yZeroLabel = svgEl("text", { x: 4, y: padT + plotH, class: "mcu-chart__count" });
    yZeroLabel.textContent = "0";
    svg.appendChild(yZeroLabel);

    // first/last date labels
    var firstLabel = svgEl("text", { x: xFor(0), y: h - 6, class: "mcu-chart__label mcu-chart__label--x" });
    firstLabel.textContent = days[0];
    svg.appendChild(firstLabel);
    var lastLabel = svgEl("text", { x: xFor(cumulative.length - 1), y: h - 6, class: "mcu-chart__label mcu-chart__label--x mcu-chart__label--end" });
    lastLabel.textContent = days[days.length - 1];
    svg.appendChild(lastLabel);

    host.appendChild(svg);
  }

  function applyStaticI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var val = I18N[lang][node.getAttribute("data-i18n")];
      if (typeof val === "string") { node.textContent = val; }
    });
    var langBtn = document.getElementById("mcu-lang-toggle");
    if (langBtn) { langBtn.textContent = lang === "de" ? "EN" : "DE"; langBtn.setAttribute("lang", lang === "de" ? "en" : "de"); }
  }

  function init() {
    applyStaticI18n();
    document.getElementById("mcu-lang-toggle").addEventListener("click", function () {
      lang = (lang === "de") ? "en" : "de";
      SHARED.writeLang(lang);
      run();
    });

    function run() {
      applyStaticI18n();
      var entries = SHARED.allEntries(DATA, true);
      renderStats(entries);
      renderOverTimeChart(entries);
      renderBarChart("mcu-dash-by-category", "chartByCategoryHeading", entries, function (e) { return e.category; }, function (k) { return t("categories")[k]; }, ["film", "series", "special", "short"]);
      renderBarChart("mcu-dash-by-studio", "chartByStudioHeading", entries, SHARED.getStudio, function (k) { return I18N[lang].studios[k] || k; }, ["marvel-studios", "sony-spiderverse", "fox-x-men", "blade-original", "marvel-television-abc", "marvel-netflix"]);
      renderBarChart("mcu-dash-by-tier", "chartByTierHeading", entries.filter(function (e) { return !e.isNonMCU; }), function (e) { return e.essentialTier || "optional"; }, function (k) { return t("tiers")[k]; }, ["essential", "recommended", "optional", "skippable"]);
    }
    run();

    document.getElementById("mcu-dash").hidden = false;
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
