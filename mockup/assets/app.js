/* Navegação entre telas + dropdowns (notificações / conta) */
(function () {
  // Telas
  var links = document.querySelectorAll('[data-s]');
  function show(s) {
    document.querySelectorAll('.screen').forEach(function (x) { x.classList.remove('on'); });
    var el = document.getElementById('s-' + s);
    if (el) { void el.offsetWidth; el.classList.add('on'); }
    document.querySelectorAll('.nav a[data-s]').forEach(function (a) {
      a.classList.toggle('on', a.dataset.s === s);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.tagName === 'A') e.preventDefault();
      show(a.dataset.s);
    });
  });

  // Dropdowns
  var open = null;
  function close() { if (open) { open.classList.remove('open'); open = null; } }
  document.querySelectorAll('[data-dd]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dd = document.getElementById(btn.dataset.dd);
      if (!dd) return;
      if (open === dd) { close(); return; }
      close();
      dd.classList.add('open');
      open = dd;
      var nd = btn.querySelector('.ndot');
      if (nd) nd.remove();
    });
  });
  document.addEventListener('click', function (e) {
    if (open && !open.contains(e.target)) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // Conversas (mensagens)
  document.querySelectorAll('.convo button').forEach(function (b) {
    b.addEventListener('click', function () {
      b.closest('.convo').querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var u = b.querySelector('.unread');
      if (u) u.remove();
    });
  });

  // Toggles decorativos
  document.querySelectorAll('.tg').forEach(function (t) {
    t.addEventListener('click', function () { t.classList.toggle('off'); });
  });
})();
