// Виджет «План дня» рахмат.рус для iPhone — приложение Scriptable (бесплатное, App Store).
// Установка — https://рахмат.рус/widget. Выглядит как главная сайта: дата, полоски «Привычки» и «План дня»,
// блоки «План дня» и «Привычки» с кружками-отметками (неотмеченные сверху, отмеченные уходят вниз).
// Нажатие на дело или простую привычку отмечает её и открывает сайт внутри Scriptable.
// Скрипт обновляет себя сам: берёт свежую версию с сайта (вставлять код заново не нужно).
const HOST = 'https://xn--80aa9aonp.xn--p1acf';   // рахмат.рус
const KEY = '';                                   // если на сайте включён TRACKER_KEY — вставить его сюда

// цвета сайта; шрифта сайта (Montserrat) на iPhone нет — ближайший системный Avenir Next
const C = { bg: '#FFFFFF', fill: '#F5F5F5', line: '#EEEEEE', ink: '#111111', ink2: '#6B6B6B', ink3: '#A6A6A6', ring: '#D4D4D4', tick: '#C4C4C4', miss: '#E03E2F' };
const col = h => new Color(h);
const F = {
  r: s => new Font('AvenirNext-Regular', s), m: s => new Font('AvenirNext-Medium', s),
  d: s => new Font('AvenirNext-DemiBold', s), b: s => new Font('AvenirNext-Bold', s),
};

const pad = n => String(n).padStart(2, '0');
const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const NOW = new Date(), TODAY = dayKey(NOW);
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const RUN = `scriptable:///run/${encodeURIComponent(Script.name())}`;

async function api(path, body) {
  const r = new Request(HOST + path + (KEY ? (path.includes('?') ? '&' : '?') + 'k=' + encodeURIComponent(KEY) : ''));
  r.timeoutInterval = 15;
  if (body) { r.method = 'POST'; r.headers = { 'Content-Type': 'application/json' }; r.body = JSON.stringify(body); }
  return await r.loadJSON();
}

// последний ответ — в кэше: без сети виджет показывает его с пометкой
const fm = FileManager.local();
const CACHE = fm.joinPath(fm.cacheDirectory(), 'rahmat-plan.json');
async function load() {
  try {
    const doc = await api('/api/widget/' + TODAY);   // {v, score, total, pct, habits: [{id, n, note, block, s, miss, tap}]}
    if (!doc || typeof doc.v !== 'object' || !Array.isArray(doc.habits)) throw new Error('bad answer');
    fm.writeString(CACHE, JSON.stringify({ day: TODAY, doc }));
    return { doc, offline: false };
  } catch (e) {
    try { const c = JSON.parse(fm.readString(CACHE)); if (c.day === TODAY) return { doc: c.doc, offline: true }; } catch (x) {}
    return { doc: { v: {}, habits: [] }, offline: true };
  }
}

// как в блоке «План дня» на сайте: фокус, главное, дела, радости; перенесённые на завтра не показываем
function items(v) {
  const out = [];
  const f = v._focus;
  if (f && (f.t || '').trim()) out.push({ kind: 'focus', id: 'focus', t: f.t.trim(), done: !!f.done, tag: '' });
  for (const g of ['c', 'v']) for (const x of v._tasks || []) if (x && !x.moved && (x.g || 'v') === g) out.push({ kind: '_tasks', id: x.id, t: x.t, done: !!x.done, tag: g === 'c' ? 'главное' : '' });
  for (const x of v._fun || []) if (x) out.push({ kind: '_fun', id: x.id, t: x.t, done: !!x.done, tag: 'радость' });
  return out;
}
const sorted = all => all.filter(x => !x.done).concat(all.filter(x => x.done));

async function toggle(it) {
  await api('/api/toggle', { d: TODAY, kind: it.kind, id: it.id, done: !it.done });
  it.done = !it.done;
}

// привычки: отмеченные (сделано или «не сделал») — вниз; внутри — порядок дня, как на сайте
const marked = h => h.s >= 1 || h.miss;
const habitsSorted = hs => hs.filter(h => !marked(h)).concat(hs.filter(marked));

// кружки, как на сайте: «✓» — серый контур с бледной галочкой, нажат — чёрный круг с белой галочкой;
// «−» — серый контур с бледной чертой, нажат — красный круг с белой чертой.
// state: open / done (галочка), noOff / miss (черта)
function mark(state, d) {
  const s = d / 28, c = new DrawContext(), on = state === 'done' || state === 'miss', minus = state === 'miss' || state === 'noOff';
  c.size = new Size(d, d); c.opaque = false; c.respectScreenScale = true;
  if (on) { c.setFillColor(col(state === 'done' ? C.ink : C.miss)); c.fillEllipse(new Rect(0, 0, d, d)); }
  else { const lw = 1.5 * s; c.setStrokeColor(col(C.ring)); c.setLineWidth(lw); c.strokeEllipse(new Rect(lw / 2, lw / 2, d - lw, d - lw)); }
  const p = new Path();
  if (minus) { p.move(new Point(11.25 * s, 14 * s)); p.addLine(new Point(16.75 * s, 14 * s)); }
  else { p.move(new Point(10.5 * s, 14.4 * s)); p.addLine(new Point(12.8 * s, 16.8 * s)); p.addLine(new Point(17.5 * s, 11.3 * s)); }
  c.addPath(p); c.setStrokeColor(col(on ? '#FFFFFF' : C.tick)); c.setLineWidth(1.9 * s); c.strokePath();
  return c.getImage();
}

function hr(w) { const l = w.addStack(); l.size = new Size(0, 1); l.backgroundColor = col(C.line); l.addSpacer(); }

// полоска прогресса, как в шапке сайта: подпись, тонкая линия, «12 из 29 · 41%»
function prog(w, label, frac, text, fill, barW) {
  const r = w.addStack(); r.centerAlignContent();
  const l = r.addStack(); l.size = new Size(78, 0);
  const lt = l.addText(label); lt.font = F.b(9.5); lt.textColor = col(C.ink3); lt.lineLimit = 1; lt.minimumScaleFactor = 0.7;
  l.addSpacer();
  r.addSpacer(6);
  const track = r.addStack(); track.size = new Size(barW, 3); track.backgroundColor = col(C.fill); track.cornerRadius = 1.5;
  if (frac > 0) { const f = track.addStack(); f.size = new Size(Math.max(3, Math.round(barW * Math.min(1, frac))), 3); f.backgroundColor = col(fill); f.cornerRadius = 1.5; }
  track.addSpacer();
  r.addSpacer();
  const t = r.addText(text); t.font = F.d(11); t.textColor = col(C.ink2); t.lineLimit = 1;
}

// ширина виджета по размеру экрана (точки iOS): большой и средний — 329 / 338 / 364
function widgetWidth(fam) {
  const sw = Device.screenSize().width, wide = sw >= 428, mid = sw >= 390;
  if (fam === 'small') return wide ? 170 : mid ? 158 : 155;
  return wide ? 364 : mid ? 338 : 329;
}

// строка списка: текст (+ серая приписка), справа кружок; url — что делать при нажатии.
// У привычки два кружка, как на сайте: «−» и «✓», у каждого своё нажатие (o.btns: [[состояние, url], …])
function row(w, o) {
  const r = w.addStack(); r.centerAlignContent(); r.setPadding(o.pv, 0, o.pv, 0);
  if (o.url && !o.btns) r.url = o.url;
  const n = r.addText(o.text); n.lineLimit = 1; n.font = o.bold ? F.d(o.fs) : F.m(o.fs); n.textColor = col(o.dim ? C.ink3 : C.ink);
  if (o.note) { r.addSpacer(6); const t = r.addText(o.note); t.font = F.d(o.fs - 3); t.textColor = col(C.ink3); t.lineLimit = 1; }
  r.addSpacer(8); r.addSpacer();
  if (o.go) { const g = r.addText('→'); g.font = F.m(o.fs + 3); g.textColor = col(C.ink2); }
  else if (o.btns) {
    o.btns.forEach(([state, url], i) => {
      if (i) r.addSpacer(10);
      const b = r.addStack(); if (url) b.url = url;
      const img = b.addImage(mark(state, o.md)); img.imageSize = new Size(o.md, o.md);
    });
  } else { const img = r.addImage(mark(o.state, o.md)); img.imageSize = new Size(o.md, o.md); }
  hr(w);
}

// заголовок блока, как на сайте: «ПЛАН ДНЯ  фокус, дела, радости   0/3»
function head(w, title, hint, count, strong, small) {
  const bh = w.addStack(); bh.centerAlignContent();
  const h2 = bh.addText(title); h2.font = F.b(small ? 10.5 : 11.5); h2.textColor = col(C.ink);
  if (hint && !small) { bh.addSpacer(8); const t = bh.addText(hint); t.font = F.r(11.5); t.textColor = col(C.ink3); t.lineLimit = 1; }
  bh.addSpacer();
  const c = bh.addText(count); c.font = F.d(small ? 11 : 12); c.textColor = col(strong ? C.ink : C.ink3);
  w.addSpacer(small ? 5 : 6);
  hr(w);
}

function buildWidget(doc, offline) {
  const fam = config.widgetFamily || 'large';
  const plan = items(doc.v || {}), planOpen = plan.filter(x => !x.done), planDone = plan.length - planOpen.length;
  const habits = habitsSorted(doc.habits || []), habOpen = habits.filter(h => !marked(h)), habDone = habits.filter(h => h.s >= 1).length;
  const left = planOpen.length + habOpen.length;
  const w = new ListWidget();
  w.url = RUN;
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

  // что показать строкой: дело плана или привычка
  const planRow = it => ({ text: it.kind === 'focus' ? 'Фокус · ' + it.t : it.t, bold: it.kind === 'focus', dim: it.done, state: it.done ? 'done' : 'open',
    url: `${RUN}?toggle=${encodeURIComponent(it.kind + ':' + it.id)}` });
  const habRow = h => ({ text: h.n, note: h.note, dim: marked(h), state: h.s >= 1 ? 'done' : h.miss ? 'miss' : 'open', url: RUN,
    btns: h.tap === 'toggle' ? [[h.miss ? 'miss' : 'noOff', `${RUN}?habit=${encodeURIComponent(h.id)}&v=no`], [h.s >= 1 ? 'done' : 'open', `${RUN}?habit=${encodeURIComponent(h.id)}&v=yes`]] : null });

  // экран блокировки: сколько осталось и что первое
  const firstOpen = planOpen.map(x => x.t).concat(habOpen.map(h => h.n));
  if (fam === 'accessoryCircular') {
    w.addSpacer();
    const n = w.addText(String(left)); n.font = Font.boldRoundedSystemFont(22); n.centerAlignText();
    const l = w.addText('осталось'); l.font = Font.systemFont(9); l.centerAlignText();
    w.addSpacer();
    return w;
  }
  if (fam === 'accessoryInline') { w.addText(left ? `${left} · ${firstOpen[0]}` : 'Всё сделано'); return w; }
  if (fam === 'accessoryRectangular') {
    const h = w.addText(`Сегодня · осталось ${left}`); h.font = Font.semiboldSystemFont(13);
    for (const s of firstOpen.slice(0, 2)) { const t = w.addText('○ ' + s); t.font = Font.systemFont(12); t.lineLimit = 1; }
    return w;
  }

  const small = fam === 'small', big = fam === 'large' || fam === 'extraLarge';
  const P = small ? 14 : 16;
  w.backgroundColor = col(C.bg);
  w.setPadding(small ? 13 : 14, P, small ? 11 : 12, P);
  const fs = small ? 13 : 14, md = small ? 20 : 22, pv = small || big ? 4 : 5;

  if (big) {
    // как главная сайта: дата, полоски «Привычки» и «План дня», блок «План дня», блок «Привычки» — всего 6 строк
    const dt = w.addStack(); dt.addSpacer();
    const h1 = dt.addText(`Сегодня, ${NOW.getDate()} ${MONTHS[NOW.getMonth()]}`); h1.font = F.d(17); h1.textColor = col(C.ink);
    dt.addSpacer();
    w.addSpacer(7);
    const barW = widgetWidth(fam) - 2 * P - 78 - 6 - 12 - 96;
    const total = +doc.total || 0, score = +doc.score || 0, pct = Math.round(+doc.pct || 0);
    const hab = total ? (score >= total - 1e-9 ? 'Всё выполнено' : `${String(Math.round(score * 10) / 10).replace('.', ',')} из ${total} · ${pct}%`) : `${pct}%`;
    prog(w, 'ПРИВЫЧКИ', pct / 100, hab, C.ink, barW);
    w.addSpacer(5);
    prog(w, 'ПЛАН ДНЯ', plan.length ? planDone / plan.length : 0, !plan.length ? 'не заполнен' : planDone === plan.length ? 'Всё выполнено' : `${planDone} из ${plan.length}`, C.ink2, barW);
    w.addSpacer(10);

    // строк 6: дела плана — несделанные, до трёх (сделанные уступают место привычкам), остальное — привычки
    const ROWS = 6, kPlan = !plan.length ? 1 : !habits.length ? Math.min(plan.length, ROWS) : Math.min(3, Math.max(1, planOpen.length));
    head(w, 'ПЛАН ДНЯ', plan.length ? 'фокус, дела, радости' : 'не заполнен', plan.length && planDone === plan.length ? 'Готово' : plan.length ? `${planDone}/${plan.length}` : '', plan.length && planDone === plan.length);
    if (!plan.length) row(w, { text: 'Заполнить план на день', go: true, fs, pv, url: RUN });
    for (const it of sorted(plan).slice(0, kPlan)) row(w, Object.assign(planRow(it), { fs, md, pv }));
    if (habits.length) {
      w.addSpacer(8);
      head(w, 'ПРИВЫЧКИ', 'неотмеченные сверху', habDone === habits.length ? 'Готово' : `${habDone}/${habits.length}`, habDone === habits.length);
      for (const h of habits.slice(0, ROWS - kPlan)) row(w, Object.assign(habRow(h), { fs, md, pv }));
    }
  } else {
    // средний и маленький: общий список «Сегодня» — несделанные дела, неотмеченные привычки, потом отмеченное
    const all = planOpen.map(planRow).concat(habOpen.map(habRow), sorted(plan).filter(x => x.done).map(planRow), habits.filter(marked).map(habRow));
    head(w, 'СЕГОДНЯ', 'дела и привычки', left ? `осталось ${left}` : 'Готово', !left, small);
    if (!all.length) row(w, { text: 'Заполнить план на день', go: true, fs, pv, url: RUN });
    for (const r of all.slice(0, 3)) row(w, Object.assign(r, { fs, md, pv, url: small ? null : r.url }, small ? { btns: null } : {}));   // маленький — без нажатий на строки, один кружок
  }
  w.addSpacer();
  if (offline) { const o = w.addText('нет связи — последние данные'); o.font = F.r(9.5); o.textColor = col(C.ink3); }
  return w;
}

// самообновление: если на сайте новая версия — переписать этот скрипт (сработает со следующего запуска); свой KEY сохраняется
async function selfUpdate() {
  try {
    const r = new Request(HOST + '/widget.js'); r.timeoutInterval = 10;
    let fresh = await r.loadString();
    if (!fresh.startsWith('// Виджет «План дня»') || !fresh.includes('Script.complete()')) return;
    fresh = fresh.replace(/^const KEY = '.*?';/m, `const KEY = '${KEY}';`);
    let m = FileManager.local();
    try { const ic = FileManager.iCloud(); if (ic.isFileStoredIniCloud(module.filename)) m = ic; } catch (e) {}
    if (m.readString(module.filename) !== fresh) m.writeString(module.filename, fresh);
  } catch (e) {}
}

const { doc, offline } = await load();
if (config.runsInWidget) {
  Script.setWidget(buildWidget(doc, offline));
  if (!offline) await selfUpdate();
} else {
  // нажатие на дело или привычку в виджете: сразу отметить, потом открыть сайт — там всё как в браузере
  const qp = args.queryParameters || {}, q = qp.toggle;
  if (q && !offline) {
    const i = q.indexOf(':'), it = items(doc.v || {}).find(x => x.kind === q.slice(0, i) && x.id === q.slice(i + 1));
    if (it) { try { await toggle(it); } catch (e) {} }
  }
  if (qp.habit && !offline) {   // привычка: «✓» — сделал, «−» — не сделал; повторное нажатие снимает отметку
    const h = (doc.habits || []).find(x => x.id === qp.habit && x.tap === 'toggle');
    if (h) {
      const val = qp.v === 'no' ? (h.miss ? null : false) : (h.s >= 1 ? null : true);
      try { await api('/api/toggle', { d: TODAY, kind: 'habit', id: h.id, val }); } catch (e) {}
    }
  }
  if (!offline) await selfUpdate();
  if (offline) {
    const a = new Alert(); a.title = 'Нет связи с рахмат.рус'; a.message = 'Проверь интернет и попробуй ещё раз.'; a.addAction('OK'); await a.present();
  } else {
    const wv = new WebView();
    await wv.loadURL(HOST + '/');
    await wv.present(true);
  }
}
Script.complete();
