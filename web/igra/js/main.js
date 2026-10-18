"use strict";
/* Запуск игры. Подключается последним: к этому моменту все миры (js/w*.js) уже зарегистрировали свои главы */
WORLDS.forEach(w => w.ch.forEach(id => { if (REG[id]) CHAPTERS.push(REG[id]); }));

/* ============ ЗАПУСК ============ */
let running = false;
function nextUndone() { const k = CHAPTERS.findIndex(c => !Save.d.done[c.id]); return k < 0 ? null : k; }
async function play(from, withIntro) {
  running = true; unlockAudio();
  await Voice.load();
  $("#start").classList.add("off");
  if (withIntro) await chIntro();
  for (let k = from; k < CHAPTERS.length; k++) {
    const c = CHAPTERS[k];
    if (!Pay.canPlay(c.id) && !(await Pay.wall())) { showStart(); return; }
    CUR = c.id; Voice.prefetch(c.lines);
    const misses = await c.fn();
    const st = misses === 0 ? 3 : misses === 1 ? 2 : 1;
    Save.d.done[c.id] = Math.max(Save.d.done[c.id] || 0, st); Save.save();
    await starsToast(st);
    const wi = WORLDS.findIndex(w => w.ch.includes(c.id)), w = WORLDS[wi];
    if (w.ch[w.ch.length - 1] === c.id && k < CHAPTERS.length - 1 && w.ch.every(id => Save.d.done[id])) await levelDone(wi);
  }
  await chFinal();
  showStart();
}
/* Стартовый экран: одна главная кнопка (что делать дальше) и «Все главы» */
let jump = null;   // глава, выбранная во время игры (страница перезагружалась)
function startAction() {
  if (jump != null) return { t: "Играть", sub: chapterPlace(CHAPTERS[jump].id) + ": " + CHAPTERS[jump].name, k: jump, intro: false };
  const next = nextUndone(), any = Object.keys(Save.d.done).length > 0;
  if (!any) return { t: "Играть", sub: "", k: 0, intro: true };
  if (next == null) return { t: "Играть снова", sub: "Все главы пройдены", k: 0, intro: false };
  return { t: "Продолжить", sub: chapterPlace(CHAPTERS[next].id) + ": " + CHAPTERS[next].name, k: next, intro: false };
}
function showStart() {
  running = false; hideCap(); clearStage(); fromDark();
  const a = startAction();
  $("#goT").textContent = a.t; $("#goSub").textContent = a.sub; $("#goSub").hidden = !a.sub;
  $("#start").classList.remove("off");
}
async function pickChapter() {
  const k = await chaptersSheet();
  if (k == null) return;
  if (running) return restartAt(CHAPTERS[k].id);
  play(k, false);
}

/* Приветствие по имени на стартовом экране */
function showHello() { $("#hello").hidden = !Me.name; $("#hello b").textContent = Me.name; }
/* Имя спрашиваем один раз, перед первой игрой (можно и без имени) */
async function askName() { if (Save.d.name === undefined) { await nameSheet(); showHello(); } }

Save.load(); Save.d.items = Save.d.items.filter(i => ITEMS.some(x => x.id === i)); updateBag(false);
$("#goVoice").hidden = VOICES.length < 2;
Voice.load().then(() => { $("#goVoice b").textContent = voiceName(); Me.load(); });
showHello(); showStart();
Pay.check().then(() => { $("#goPay").hidden = !Pay.on || Pay.inTG && !Pay.active; }); Pay.afterReturn();
$("#go").onclick = async () => { Snd.tap(); await askName(); const a = startAction(); jump = null; play(a.k, a.intro); };
$("#goCh").onclick = async () => { Snd.tap(); await askName(); pickChapter(); };
$("#goPay").onclick = () => { Snd.tap(); Pay.manage(); };
$("#goName").onclick = async () => { Snd.tap(); await nameSheet(); showHello(); };
$("#goVoice").onclick = async () => { Snd.tap(); await voiceSheet(); $("#goVoice b").textContent = voiceName(); };
/* Домик: на старте — список глав, в игре — пауза */
$("#tMenu").onclick = async () => {
  Snd.tap();
  if (!running) return pickChapter();
  const a = await pauseSheet();
  if (a === "go") replayCap();
  else if (a === "again") restartAt(CUR);
  else if (a === "list") pickChapter();
  else if (a === "home") location.reload();
};
/* Главу нельзя прервать посреди анимаций — перезапускаемся со страницей, а глава ждёт на стартовом экране */
function restartAt(id) { try { sessionStorage.setItem("ayaty_jump", id); } catch (e) {} location.reload(); }
$("#tBag").onclick = () => { Snd.tap(); bagSheet(); };
/* Один звук на всё: и голос, и звуки */
$("#tSfx").onclick = e => { const on = !Snd.on; Snd.setOn(on); Voice.on = on; if (!on) Voice.stop(); e.currentTarget.setAttribute("aria-pressed", on); };
$("#capRe").onclick = () => { Snd.tap(); replayCap(); };
/* После «Начать главу заново» или выбора главы во время игры страница перезагружается: эта глава — на главной кнопке */
(() => {
  let j = null; try { j = sessionStorage.getItem("ayaty_jump"); sessionStorage.removeItem("ayaty_jump"); } catch (e) {}
  const k = CHAPTERS.findIndex(c => c.id === j);
  if (k >= 0) { jump = k; showStart(); }
})();
