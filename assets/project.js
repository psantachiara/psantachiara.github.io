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

(function () {
  var imgs = document.querySelectorAll('figure.fig img, figure.fig-row img');
  if (!imgs.length) return;

  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Enlarged image');

  var big = document.createElement('img');

  var close = document.createElement('button');
  close.className = 'lb-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.textContent = 'Close';

  lb.appendChild(big);
  lb.appendChild(close);
  document.body.appendChild(lb);

  var origin = null;

  function open(img) {
    origin = img;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || '';
    lb.classList.add('open');
    document.body.classList.add('lb-lock');
    close.focus();
  }

  function shut() {
    lb.classList.remove('open');
    document.body.classList.remove('lb-lock');
    big.removeAttribute('src');
    if (origin) {
      origin.focus();
      origin = null;
    }
  }

  Array.prototype.forEach.call(imgs, function (img) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img);
      }
    });
  });

  lb.addEventListener('click', shut);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('open')) shut();
  });
})();
