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
    CUR = c.id; Voice.prefetch(c.lines);
    const misses = await c.fn();
    const st = misses === 0 ? 3 : misses === 1 ? 2 : 1;
    Save.d.done[c.id] = Math.max(Save.d.done[c.id] || 0, st); Save.save();
    await starsToast(st);
  }
  await chFinal();
  showStart();
}
function showStart() {
  running = false; hideCap(); clearStage(); fromDark();
  const any = Object.keys(Save.d.done).length > 0, next = nextUndone();
  $("#goCont").hidden = !any || next == null;
  $("#go").textContent = any ? "Начать сначала" : "Начать";
  $("#go").classList.toggle("glass", any && next != null);
  $("#start").classList.remove("off");
}
async function pickChapter() {
  const k = await chaptersSheet();
  if (k == null) return;
  if (running) { try { sessionStorage.setItem("ayaty_jump", CHAPTERS[k].id); } catch (e) {} location.reload(); return; }
  play(k, false);
}

Save.load(); Save.d.items = Save.d.items.filter(i => ITEMS.some(x => x.id === i)); updateBag(false);
$("#goVoice").hidden = VOICES.length < 2;
Voice.load().then(() => { $("#goVoice b").textContent = voiceName(); });
showStart();
$("#go").onclick = () => { Snd.tap(); play(0, true); };
$("#goCont").onclick = () => { Snd.tap(); const k = nextUndone(); if (k != null) play(k, false); };
$("#goCh").onclick = () => { Snd.tap(); pickChapter(); };
$("#goVoice").onclick = async () => { Snd.tap(); await voiceSheet(); $("#goVoice b").textContent = voiceName(); };
$("#tHome").onclick = () => { Snd.tap(); pickChapter(); };
$("#tBag").onclick = () => { Snd.tap(); bagSheet(); };
$("#tVoice").onclick = e => { Voice.on = !Voice.on; e.currentTarget.setAttribute("aria-pressed", Voice.on); if (!Voice.on) Voice.stop(); };
$("#tSfx").onclick = e => { Snd.setOn(!Snd.on); e.currentTarget.setAttribute("aria-pressed", Snd.on); };
/* После выбора главы во время игры страница перезагружается: предлагаем сразу сыграть выбранную главу */
(() => {
  let j = null; try { j = sessionStorage.getItem("ayaty_jump"); sessionStorage.removeItem("ayaty_jump"); } catch (e) {}
  const k = CHAPTERS.findIndex(c => c.id === j);
  if (k < 0) return;
  const b = el("button", "btn big", null, "Играть: " + CHAPTERS[k].name);
  $(".sbtns").prepend(b);
  b.onclick = () => { Snd.tap(); play(k, false); };
})();
