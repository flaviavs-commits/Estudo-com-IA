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
  var backdrop = document.getElementById('dd-backdrop');
  function close() {
    if (open) { open.classList.remove('open'); open = null; }
    if (backdrop) backdrop.classList.remove('open');
  }
  document.querySelectorAll('[data-dd]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dd = document.getElementById(btn.dataset.dd);
      if (!dd) return;
      if (open === dd) { close(); return; }
      close();
      dd.classList.add('open');
      open = dd;
      if (backdrop) backdrop.classList.add('open');
      var nd = btn.querySelector('.ndot');
      if (nd) nd.remove();
    });
  });
  if (backdrop) backdrop.addEventListener('click', close);
  document.addEventListener('click', function (e) {
    if (open && !open.contains(e.target)) close();
  });

  // Modais (ex.: Minha conta) — sempre centralizados, nunca navegam para uma tela
  var modalBackdrop = document.getElementById('modal-backdrop');
  var openModal = null;
  function closeModal() {
    if (openModal) { openModal.classList.remove('open'); openModal = null; }
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      close(); // fecha qualquer dropdown aberto
      var m = document.getElementById('modal-' + btn.dataset.modal);
      if (!m) return;
      m.classList.add('open');
      openModal = m;
      if (modalBackdrop) modalBackdrop.classList.add('open');
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); closeModal(); }
  });

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

  // Biblioteca de materiais: busca + filtro + ordenação (funcional)
  var grid = document.getElementById('lib-grid');
  if (grid) {
    var input = document.getElementById('lib-search');
    var wrap = document.getElementById('lib-search-wrap');
    var clearBtn = document.getElementById('lib-clear');
    var chips = document.querySelectorAll('.filter .chip[data-f]');
    var countEl = document.getElementById('lib-count');
    var emptyEl = document.getElementById('lib-empty');
    var sortBtn = document.getElementById('lib-sortbtn');
    var sortMenu = document.getElementById('lib-sortmenu');
    var sortLabel = document.getElementById('lib-sortlabel');
    var items = Array.prototype.slice.call(grid.querySelectorAll('.mat'));
    var state = { q: '', kind: 'todos', sort: 'recent' };
    var sortNames = { recent: 'Mais recentes', old: 'Mais antigos', az: 'Nome A–Z' };

    function apply() {
      var q = state.q.trim().toLowerCase();
      var visible = items.filter(function (el) {
        var matchesKind = state.kind === 'todos' || el.dataset.kind === state.kind;
        var matchesQ = !q || el.dataset.name.indexOf(q) !== -1;
        var show = matchesKind && matchesQ;
        el.classList.toggle('hide', !show);
        return show;
      });

      var sorted = visible.slice().sort(function (a, b) {
        if (state.sort === 'az') return a.dataset.name.localeCompare(b.dataset.name);
        var da = a.dataset.date, db = b.dataset.date;
        return state.sort === 'old' ? da.localeCompare(db) : db.localeCompare(da);
      });
      sorted.forEach(function (el) { grid.appendChild(el); });

      countEl.textContent = visible.length + (visible.length === 1 ? ' material' : ' materiais');
      emptyEl.classList.toggle('show', visible.length === 0);
      grid.style.display = visible.length === 0 ? 'none' : '';
      wrap.classList.toggle('has-val', q.length > 0);
    }

    input.addEventListener('input', function () { state.q = input.value; apply(); });
    clearBtn.addEventListener('click', function () { input.value = ''; state.q = ''; apply(); input.focus(); });

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.classList.remove('on'); });
        c.classList.add('on');
        state.kind = c.dataset.f;
        apply();
      });
    });

    sortBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      sortMenu.classList.toggle('open');
    });
    sortMenu.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        state.sort = b.dataset.sort;
        sortLabel.textContent = sortNames[state.sort];
        sortMenu.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        sortMenu.classList.remove('open');
        apply();
      });
    });
    document.addEventListener('click', function (e) {
      if (!sortMenu.contains(e.target) && e.target !== sortBtn) sortMenu.classList.remove('open');
    });

    apply();
  }

  // Assistente da biblioteca: chips preenchem o campo de comando
  var libaiInput = document.querySelector('.libai-composer input');
  document.querySelectorAll('.libai-chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (libaiInput) {
        libaiInput.value = b.textContent.trim();
        libaiInput.focus();
      }
    });
  });
})();
