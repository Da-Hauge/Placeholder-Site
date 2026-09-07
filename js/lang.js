/* =========================================================================
   haug-it.eu — language routing.

   English is the default. A visitor whose browser is set to German is sent
   to /de/ once, on first landing. Clicking the EN/DE switch stores that
   choice and overrides the browser setting from then on.

   Storage: one key, "haugit.lang", holding "en" or "de" and nothing else.
   It is written only when the visitor actually clicks the switch, never
   from automatic detection. A language choice is strictly necessary for
   the service the visitor asked for, so § 25 Abs. 2 Nr. 2 TDDDG applies
   and no consent banner is required — see datenschutz.html.

   Loaded synchronously in <head> so a German visitor never sees the
   English page flash first. Only index pages load it; the legal pages
   must never redirect.
   ========================================================================= */

(function () {
  "use strict";

  var KEY = "haugit.lang";

  var stored = null;
  try {
    stored = window.localStorage.getItem(KEY);
  } catch (err) {
    // Private mode or blocked site data: fall back to detection only.
    stored = null;
  }
  if (stored !== "en" && stored !== "de") { stored = null; }

  var onGermanPage = document.documentElement.lang === "de";

  if (onGermanPage) {
    // Only an explicit choice sends anyone away from here. The browser
    // language is deliberately not consulted, so the two pages can never
    // bounce a visitor back and forth.
    if (stored === "en") { window.location.replace("../"); }
    return;
  }

  if (stored === "de") {
    window.location.replace("de/");
    return;
  }

  if (!stored) {
    var nav = (navigator.language || "").toLowerCase();
    if (nav === "de" || nav.indexOf("de-") === 0) {
      window.location.replace("de/");
    }
  }
})();
