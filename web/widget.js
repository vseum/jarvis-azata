// Виджет «План дня» рахмат.рус для iPhone — приложение Scriptable (бесплатное, App Store).
// Установка — https://рахмат.рус/widget. Виджет показывает фокус, дела и радости сегодняшнего плана;
// нажатие на дело отмечает его и открывает список в Scriptable (там нажатие отмечает или снимает отметку).
const HOST = 'https://xn--80aa9aonp.xn--p1acf';   // рахмат.рус
const KEY = '';                                   // если на сайте включён TRACKER_KEY — вставить его сюда

const INK = Color.dynamic(new Color('#111111'), new Color('#FFFFFF'));
const GREY = Color.dynamic(new Color('#A6A6A6'), new Color('#8E8E93'));
const LINE = Color.dynamic(new Color('#E8E8E8'), new Color('#3A3A3C'));
const GREEN = Color.dynamic(new Color('#1E7F4F'), new Color('#34C77B'));
const BG = Color.dynamic(new Color('#FFFFFF'), new Color('#1C1C1E'));

const pad = n => String(n).padStart(2, '0');
const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const TODAY = dayKey(new Date());
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
  if (f && (f.t || '').trim()) out.push({ kind: 'focus', id: 'focus', t: f.t.trim(), done: !!f.done, tag: 'фокус' });
  for (const g of ['c', 'v']) for (const x of v._tasks || []) if (x && !x.moved && (x.g || 'v') === g) out.push({ kind: '_tasks', id: x.id, t: x.t, done: !!x.done, tag: g === 'c' ? 'главное' : '' });
  for (const x of v._fun || []) if (x) out.push({ kind: '_fun', id: x.id, t: x.t, done: !!x.done, tag: 'радость' });
  return out;
}
const sorted = all => all.filter(x => !x.done).concat(all.filter(x => x.done));

async function toggle(it) {
  await api('/api/toggle', { d: TODAY, kind: it.kind, id: it.id, done: !it.done });
  it.done = !it.done;
}

function symbol(name, size) {
  const s = SFSymbol.named(name);
  s.applyFont(Font.systemFont(size));
  return s.image;
}

function buildWidget(doc, offline) {
  const fam = config.widgetFamily || 'large';
  const all = items(doc.v || {}), open = all.filter(x => !x.done);
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

  // главный экран — как виджет «Напоминаний»: число открытых дел, заголовок, список с кружками.
  // Маленький и средний виджет — 155 pt в высоту: шапка в одну строку и три дела; большой — шапка в две строки и до 8 дел.
  const small = fam === 'small', big = fam === 'large' || fam === 'extraLarge';
  w.backgroundColor = BG;
  w.setPadding(big ? 14 : 12, small ? 14 : 16, big ? 12 : 10, small ? 14 : 16);
  const head = w.addStack(); head.centerAlignContent();
  const left = head.addStack();
  if (big) left.layoutVertically(); else { left.centerAlignContent(); left.spacing = 6; }
  const n = left.addText(String(open.length)); n.font = Font.boldRoundedSystemFont(big ? 30 : small ? 22 : 24); n.textColor = INK;
  const ttl = left.addText('План дня'); ttl.font = Font.semiboldSystemFont(big ? 17 : small ? 14 : 16); ttl.textColor = GREEN;
  head.addSpacer();
  if (!small) {
    const right = head.addStack(); right.layoutVertically();
    const done = all.length - open.length;
    const a = right.addText(all.length ? `${done}/${all.length} сделано` : ''); a.font = Font.mediumSystemFont(12); a.textColor = GREY; a.rightAlignText();
    if (doc.pct) { const b = right.addText(`привычки ${Math.round(doc.pct)}%`); b.font = Font.mediumSystemFont(12); b.textColor = GREY; b.rightAlignText(); }
  }
  w.addSpacer(big ? 8 : 6);
  const line = w.addStack(); line.size = new Size(0, 1); line.backgroundColor = LINE; line.addSpacer();
  w.addSpacer(big ? 8 : 6);

  if (!all.length) {
    const t = w.addText('План не заполнен'); t.font = Font.mediumSystemFont(15); t.textColor = INK;
    const s = w.addText('нажми, чтобы открыть сайт'); s.font = Font.systemFont(12); s.textColor = GREY;
    w.url = HOST + '/';
  } else {
    const list = sorted(all), shown = list.slice(0, big ? 8 : 3);
    for (const it of shown) {
      const row = w.addStack(); row.centerAlignContent(); row.spacing = 8;
      if (!small) row.url = `${RUN}?toggle=${encodeURIComponent(it.kind + ':' + it.id)}`;
      const img = row.addImage(symbol(it.done ? 'checkmark.circle.fill' : 'circle', 16));
      img.imageSize = new Size(small ? 16 : 18, small ? 16 : 18); img.tintColor = it.done ? GREEN : GREY;
      const t = row.addText(it.t); t.lineLimit = 1; t.font = it.kind === 'focus' ? Font.semiboldSystemFont(small ? 13 : 15) : Font.systemFont(small ? 13 : 15);
      t.textColor = it.done ? GREY : INK;
      row.addSpacer();
      w.addSpacer(big ? 8 : 4);
    }
    if (big && list.length > shown.length) { const m = w.addText(`ещё ${list.length - shown.length}`); m.font = Font.mediumSystemFont(12); m.textColor = GREY; }
  }
  w.addSpacer();
  if (offline) { const o = w.addText('нет связи — последние данные'); o.font = Font.systemFont(10); o.textColor = GREY; }
  return w;
}

// в приложении: список дел, нажатие — отметить / снять отметку
async function showList(doc, offline) {
  const table = new UITable();
  table.showSeparators = true;
  const all = items(doc.v || {});
  const paint = () => {
    table.removeAllRows();
    const h = new UITableRow(); h.isHeader = true; h.height = 60;
    const open = all.filter(x => !x.done).length;
    h.addText(`План дня · ${open ? 'осталось ' + open : 'всё сделано'}`, offline ? 'нет связи — отметки не сохранятся' : TODAY.split('-').reverse().join('.'));
    table.addRow(h);
    for (const it of sorted(all)) {
      const r = new UITableRow(); r.height = 56; r.dismissOnSelect = false;
      const ck = r.addText(it.done ? '✓' : '○'); ck.widthWeight = 8; ck.titleColor = it.done ? GREEN : GREY; ck.titleFont = Font.boldSystemFont(20);
      const c = r.addText(it.t, it.tag); c.widthWeight = 92; c.titleFont = it.kind === 'focus' ? Font.semiboldSystemFont(16) : Font.systemFont(16);
      c.titleColor = it.done ? GREY : INK; c.subtitleColor = GREY;
      r.onSelect = async () => {
        try { await toggle(it); } catch (e) { const a = new Alert(); a.title = 'Не удалось сохранить'; a.message = 'Нет связи с рахмат.рус'; a.addAction('OK'); await a.present(); }
        paint(); table.reload();
      };
      table.addRow(r);
    }
    if (!all.length) { const r = new UITableRow(); r.addText('План не заполнен', 'заполняется на сайте, вкладка «План»'); table.addRow(r); }
    const o = new UITableRow(); o.height = 50; o.dismissOnSelect = true;
    const oc = o.addText('Открыть рахмат.рус →'); oc.titleColor = GREEN;
    o.onSelect = () => Safari.open(HOST + '/');
    table.addRow(o);
  };
  paint();
  await table.present(false);
}

const { doc, offline } = await load();
if (config.runsInWidget) {
  Script.setWidget(buildWidget(doc, offline));
} else {
  // нажатие на дело в виджете: сразу отметить его, потом показать список
  const q = (args.queryParameters || {}).toggle;
  if (q && !offline) {
    const i = q.indexOf(':'), it = items(doc.v || {}).find(x => x.kind === q.slice(0, i) && x.id === q.slice(i + 1));
    if (it) { try { await toggle(it); doc.v = (await load()).doc.v; } catch (e) {} }
  }
  await showList(doc, offline);
}
Script.complete();
