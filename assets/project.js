/* ============================================================================
   DH PROJECT PAGES — shared behaviour
   ----------------------------------------------------------------------------
   Auto-hiding top bar: slides out of view when the reader scrolls down, and
   returns as soon as they scroll up, from anywhere on the page. Long project
   pages are mostly full-width visualisations, so reclaiming the 66px is worth
   it — but the way back to the site should never be more than a flick away.
   ============================================================================ */
(function () {
  var bar = document.querySelector('header.bar');
  if (!bar) return;

  // Readers who ask for reduced motion get a bar that simply stays put.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lastY = window.pageYOffset;
  var ticking = false;

  // Ignore movements smaller than this so a trackpad's jitter, or the rubber
  // banding at the top and bottom of the page, cannot flicker the bar.
  var THRESHOLD = 6;
  // Above this point the bar is always shown: near the top there is nothing to
  // gain by hiding it, and hiding it there feels like a glitch.
  var ALWAYS_SHOW_ABOVE = 90;

  function update() {
    var y = window.pageYOffset;
    var delta = y - lastY;

    if (Math.abs(delta) < THRESHOLD) { ticking = false; return; }

    if (y < ALWAYS_SHOW_ABOVE || delta < 0) {
      bar.classList.remove('bar--hidden');   // at the top, or scrolling up
    } else {
      bar.classList.add('bar--hidden');      // scrolling down
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  // A keyboard user tabbing to a link inside the bar must be able to see it.
  bar.addEventListener('focusin', function () {
    bar.classList.remove('bar--hidden');
  });
})();
