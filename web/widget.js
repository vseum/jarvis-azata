// Виджет «План дня» рахмат.рус для iPhone — приложение Scriptable (бесплатное, App Store).
// Установка — https://рахмат.рус/widget. Выглядит как главная сайта: дата, полоски «Привычки» и «План дня»,
// блок «План дня» с кружками-отметками. Нажатие на дело отмечает его и открывает сайт внутри Scriptable.
// Скрипт обновляет себя сам: берёт свежую версию с сайта (вставлять код заново не нужно).
const HOST = 'https://xn--80aa9aonp.xn--p1acf';   // рахмат.рус
const KEY = '';                                   // если на сайте включён TRACKER_KEY — вставить его сюда

// цвета сайта; шрифта сайта (Montserrat) на iPhone нет — ближайший системный Avenir Next
const C = { bg: '#FFFFFF', fill: '#F5F5F5', line: '#EEEEEE', ink: '#111111', ink2: '#6B6B6B', ink3: '#A6A6A6', ring: '#D4D4D4', tick: '#C4C4C4' };
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
    const doc = await api('/api/days/' + TODAY);
    if (!doc || typeof doc.v !== 'object') throw new Error('bad answer');
    fm.writeString(CACHE, JSON.stringify({ day: TODAY, doc }));
    return { doc, offline: false };
  } catch (e) {
    try { const c = JSON.parse(fm.readString(CACHE)); if (c.day === TODAY) return { doc: c.doc, offline: true }; } catch (x) {}
    return { doc: { v: {} }, offline: true };
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

// кружок-отметка, как на сайте: серый контур с бледной галочкой; сделано — чёрный круг с белой галочкой
function mark(done, d) {
  const s = d / 28, c = new DrawContext();
  c.size = new Size(d, d); c.opaque = false; c.respectScreenScale = true;
  if (done) { c.setFillColor(col(C.ink)); c.fillEllipse(new Rect(0, 0, d, d)); }
  else { const lw = 1.5 * s; c.setStrokeColor(col(C.ring)); c.setLineWidth(lw); c.strokeEllipse(new Rect(lw / 2, lw / 2, d - lw, d - lw)); }
  const p = new Path();
  p.move(new Point(10.5 * s, 14.4 * s)); p.addLine(new Point(12.8 * s, 16.8 * s)); p.addLine(new Point(17.5 * s, 11.3 * s));
  c.addPath(p); c.setStrokeColor(col(done ? '#FFFFFF' : C.tick)); c.setLineWidth(1.9 * s); c.strokePath();
  return c.getImage();
}

function hr(w) { const l = w.addStack(); l.size = new Size(0, 1); l.backgroundColor = col(C.line); l.addSpacer(); }

// полоска прогресса, как в шапке сайта: подпись, тонкая линия, «12 из 29 · 41%»
function prog(w, label, frac, text, fill, barW) {
  const r = w.addStack(); r.centerAlignContent();
  const l = r.addStack(); l.size = new Size(66, 0);
  const lt = l.addText(label); lt.font = F.b(9.5); lt.textColor = col(C.ink3);
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

function buildWidget(doc, offline) {
  const fam = config.widgetFamily || 'large';
  const all = items(doc.v || {}), open = all.filter(x => !x.done), done = all.length - open.length;
  const w = new ListWidget();
  w.url = RUN;
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

  // экран блокировки
  if (fam === 'accessoryCircular') {
    w.addSpacer();
    const n = w.addText(String(open.length)); n.font = Font.boldRoundedSystemFont(22); n.centerAlignText();
    const l = w.addText('дел'); l.font = Font.systemFont(10); l.centerAlignText();
    w.addSpacer();
    return w;
  }
  if (fam === 'accessoryInline') { w.addText(open.length ? `${open.length} · ${open[0].t}` : 'План дня выполнен'); return w; }
  if (fam === 'accessoryRectangular') {
    const h = w.addText(`План дня · ${open.length}`); h.font = Font.semiboldSystemFont(13);
    for (const it of open.slice(0, 2)) { const t = w.addText('○ ' + it.t); t.font = Font.systemFont(12); t.lineLimit = 1; }
    if (!all.length) { const t = w.addText('не заполнен'); t.font = Font.systemFont(12); }
    return w;
  }

  // главный экран — как главная сайта. Большой: дата, полоски, блок «План дня» до 4 дел с подписями;
  // средний и маленький (155 pt в высоту): только блок «План дня», три дела в одну строку (сколько всего — в счётчике шапки).
  const small = fam === 'small', big = fam === 'large' || fam === 'extraLarge';
  const P = small ? 14 : 16;
  w.backgroundColor = col(C.bg);
  w.setPadding(small ? 13 : 14, P, small ? 11 : 12, P);

  if (big) {
    const dt = w.addStack(); dt.addSpacer();
    const h1 = dt.addText(`Сегодня, ${NOW.getDate()} ${MONTHS[NOW.getMonth()]}`); h1.font = F.d(17); h1.textColor = col(C.ink);
    dt.addSpacer();
    w.addSpacer(9);
    const barW = widgetWidth(fam) - 2 * P - 66 - 6 - 12 - 96;
    const total = +doc.total || 0, score = +doc.score || 0, pct = Math.round(+doc.pct || 0);
    const hab = total ? (score >= total - 1e-9 ? 'Всё выполнено' : `${String(Math.round(score * 10) / 10).replace('.', ',')} из ${total} · ${pct}%`) : `${pct}%`;
    prog(w, 'ПРИВЫЧКИ', pct / 100, hab, C.ink, barW);
    w.addSpacer(5);
    prog(w, 'ПЛАН ДНЯ', all.length ? done / all.length : 0, !all.length ? 'не заполнен' : done === all.length ? 'Всё выполнено' : `${done} из ${all.length}`, C.ink2, barW);
    w.addSpacer(14);
  }

  // заголовок блока: «ПЛАН ДНЯ  фокус, дела, радости   0/3»
  const bh = w.addStack(); bh.centerAlignContent();
  const h2 = bh.addText('ПЛАН ДНЯ'); h2.font = F.b(small ? 10.5 : 11.5); h2.textColor = col(C.ink);
  if (!small) { bh.addSpacer(8); const hint = bh.addText(all.length ? 'фокус, дела, радости' : 'не заполнен'); hint.font = F.r(11.5); hint.textColor = col(C.ink3); hint.lineLimit = 1; }
  bh.addSpacer();
  const full = all.length && done === all.length;
  const cnt = bh.addText(full ? 'Готово' : all.length ? `${done}/${all.length}` : ''); cnt.font = F.d(small ? 11 : 12); cnt.textColor = col(full ? C.ink : C.ink3);
  w.addSpacer(small ? 5 : 7);
  hr(w);

  if (!all.length) {
    const row = w.addStack(); row.centerAlignContent(); row.setPadding(8, 0, 8, 0);
    const lab = row.addStack(); lab.layoutVertically();
    const n = lab.addText('Заполнить план на день'); n.font = F.m(small ? 13 : 15); n.textColor = col(C.ink); n.lineLimit = 1;
    if (!small) { const t = lab.addText('фокус, сливки, вишенки, развлечения'); t.font = F.r(11.5); t.textColor = col(C.ink3); t.lineLimit = 1; }
    row.addSpacer(8); row.addSpacer();
    const go = row.addText('→'); go.font = F.m(18); go.textColor = col(C.ink2);
    hr(w);
  } else {
    const list = sorted(all), shown = list.slice(0, big ? 4 : 3);
    const fs = small ? 13 : big ? 15 : 14, md = small ? 20 : 24, pv = small ? 4 : big ? 6 : 5;
    for (const it of shown) {
      const row = w.addStack(); row.centerAlignContent(); row.setPadding(pv, 0, pv, 0);
      if (!small) row.url = `${RUN}?toggle=${encodeURIComponent(it.kind + ':' + it.id)}`;
      const lab = row.addStack(); lab.layoutVertically();
      const n = lab.addText(it.kind === 'focus' ? 'Фокус · ' + it.t : it.t); n.lineLimit = 1;
      n.font = it.kind === 'focus' ? F.d(fs) : F.m(fs); n.textColor = col(it.done ? C.ink3 : C.ink);
      if (big && it.tag) { const t = lab.addText(it.tag); t.font = F.r(11.5); t.textColor = col(C.ink3); }
      row.addSpacer(8); row.addSpacer();
      const img = row.addImage(mark(it.done, md)); img.imageSize = new Size(md, md);
      hr(w);
    }
    if (big && list.length > shown.length) {
      w.addSpacer(5);
      const m = w.addText(`ещё ${list.length - shown.length}`); m.font = F.d(11); m.textColor = col(C.ink3);
    }
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
  // нажатие на дело в виджете: сразу отметить его, потом открыть сайт — там всё как в браузере
  const q = (args.queryParameters || {}).toggle;
  if (q && !offline) {
    const i = q.indexOf(':'), it = items(doc.v || {}).find(x => x.kind === q.slice(0, i) && x.id === q.slice(i + 1));
    if (it) { try { await toggle(it); } catch (e) {} }
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
