(function () {
  var bar = document.querySelector('header.bar');
  if (!bar) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lastY = window.pageYOffset;
  var ticking = false;

  var THRESHOLD = 6;
  var ALWAYS_SHOW_ABOVE = 90;

  function update() {
    var y = window.pageYOffset;
    var delta = y - lastY;

    if (Math.abs(delta) < THRESHOLD) { ticking = false; return; }

    if (y < ALWAYS_SHOW_ABOVE || delta < 0) {
      bar.classList.remove('bar--hidden');
    } else {
      bar.classList.add('bar--hidden');
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

  bar.addEventListener('focusin', function () {
    bar.classList.remove('bar--hidden');
  });
})();
