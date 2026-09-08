/* =========================================================================
   haug-it.eu — theme.

   Three modes: auto (follow the OS), light, dark. Auto is the default and
   the state a visitor who never touches the toggle stays in forever.

   Storage: one key, "haugit.theme", holding "light" or "dark". Nothing is
   written in auto mode — choosing auto REMOVES the key rather than storing
   the word "auto", so a visitor who returns to auto leaves no trace behind.
   Same reasoning as the language key: a display preference the visitor
   explicitly set is strictly necessary for the service they asked for
   (§ 25 Abs. 2 Nr. 2 TDDDG), so no consent banner is required. See
   datenschutz.html / privacy-policy.html.

   Loaded synchronously in <head> on every page, before the stylesheets have
   painted anything, so a stored theme never flashes the wrong colours.
   ========================================================================= */

(function () {
  "use strict";

  var KEY = "haugit.theme";
  var MODES = ["auto", "light", "dark"];
  var root = document.documentElement;

  function read() {
    try {
      var v = window.localStorage.getItem(KEY);
      return (v === "light" || v === "dark") ? v : "auto";
    } catch (err) {
      // Private mode or blocked site data: auto is a safe answer.
      return "auto";
    }
  }

  function write(mode) {
    try {
      if (mode === "auto") { window.localStorage.removeItem(KEY); }
      else { window.localStorage.setItem(KEY, mode); }
    } catch (err) {
      // Never let a storage failure stop the theme from changing on screen.
    }
  }

  // Apply immediately — this runs in <head>, before first paint.
  function apply(mode) {
    if (mode === "light" || mode === "dark") { root.setAttribute("data-theme", mode); }
    else { root.removeAttribute("data-theme"); }
  }

  var current = read();
  apply(current);

  // The toggle is useless without JS, so CSS keeps it hidden until this class
  // proves JS ran.
  root.classList.add("js-theme");

  var LABELS = {
    en: {
      auto:  "Theme: follows your system. Switch to light.",
      light: "Theme: light. Switch to dark.",
      dark:  "Theme: dark. Switch to system default."
    },
    de: {
      auto:  "Darstellung: folgt dem System. Auf hell umschalten.",
      light: "Darstellung: hell. Auf dunkel umschalten.",
      dark:  "Darstellung: dunkel. Auf Systemvorgabe umschalten."
    }
  };

  function wire() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) { return; }

    var lang = (root.getAttribute("lang") === "de") ? "de" : "en";
    var labels = LABELS[lang];

    var label = function () {
      button.setAttribute("aria-label", labels[current]);
      button.setAttribute("title", labels[current]);
    };
    label();

    button.addEventListener("click", function () {
      current = MODES[(MODES.indexOf(current) + 1) % MODES.length];
      apply(current);
      write(current);
      label();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
