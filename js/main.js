/* =========================================================================
   haug-it.eu — progressive enhancement only.

   Deliberately does NOT: set cookies, touch localStorage / sessionStorage /
   IndexedDB, load anything from a third party, or send a request anywhere.
   The site is fully readable and navigable with JavaScript disabled; this
   file only adds motion and nav highlighting on top.
   ========================================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Reveal on scroll ---------------------------------------------
     The hidden state is only switched on once we know IntersectionObserver
     exists to switch it off again. Without JS or without the API, everything
     stays visible. */
  var revealTargets = document.querySelectorAll(".reveal");

  if (revealTargets.length && "IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("js-reveal");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealTargets.forEach(function (el) { observer.observe(el); });

    /* Fail open: if anything goes wrong before the observer fires, the
       content must not stay invisible. */
    window.setTimeout(function () {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  }

  /* ---- 2. Mark the section currently in view in the nav ----------------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"]')
  );

  if (navLinks.length && "IntersectionObserver" in window) {
    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute("href").slice(1);
        // getElementById, not a selector built from the href: no injection path.
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    if (sections.length) {
      var setCurrent = function (id) {
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      };

      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { setCurrent(entry.target.id); }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

      sections.forEach(function (section) { sectionObserver.observe(section); });
    }
  }
})();
