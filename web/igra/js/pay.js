"use strict";
/* Подписка. Бесплатно: весь уровень 1 и первая глава каждого следующего уровня. Остальное — по подписке.
   Семью узнаём по коду доступа (выдаётся после оплаты, хранится в браузере; на другом устройстве вводится вручную).
   Пока оплата на сервере не включена (ответ 503), вся игра бесплатна.
   В Telegram кнопок оплаты нет: цифровое там продаётся только за Stars — можно лишь ввести код. */
const PRICES = { month: 349, year: 2490 };
const Pay = {
  on: false, active: false, until: null, plan: null, autopay: false,
  get code() { return Save.d.code || ""; },
  inTG: !!(window.Telegram && Telegram.WebApp && Telegram.WebApp.initData),
  free(id) { const w = WORLDS.find(w => w.ch.includes(id)); return !w || WORLDS.indexOf(w) === 0 || w.ch[0] === id; },
  canPlay(id) { return !this.on || this.active || this.free(id); },
  async api(path, body) {
    const r = await fetch("api/" + path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {});
    let j = null; try { j = await r.json(); } catch (e) {}
    return { status: r.status, ok: r.ok, j: j || {} };
  },
  /* Узнать, включена ли оплата и действует ли подписка этой семьи */
  async check() {
    const c = Save.d.sub;      // последнее известное состояние — чтобы без интернета не запирать оплаченное
    if (c && c.until && new Date(c.until) > new Date()) this.set(c);
    try {
      const r = await this.api("me?code=" + encodeURIComponent(this.code));
      if (r.status === 503 || r.status === 404 || r.status >= 500) { this.on = false; return; }   // оплата не включена или сервера оплаты нет
      this.on = true;
      if (this.code && r.ok) this.set(r.j); else if (!this.code) this.set({});
    } catch (e) { if (Save.d.sub && Save.d.sub.active) this.on = true; }
  },
  set(s) {
    this.active = !!s.active; this.until = s.until || null; this.plan = s.plan || null; this.autopay = !!s.autopay;
    Save.d.sub = { active: this.active, until: this.until, plan: this.plan, autopay: this.autopay }; Save.save();
  },
  /* Вернулись со страницы оплаты: ?paid=<id> — ждём подтверждения и показываем код */
  async afterReturn() {
    const id = new URLSearchParams(location.search).get("paid"); if (!id) return;
    history.replaceState(null, "", location.pathname);
    const ov = sheet(`<h2>Проверяем оплату…</h2><p class="small">Обычно это несколько секунд</p>`);
    let st = null;
    for (let i = 0; i < 20 && !st; i++) {
      try { const r = await this.api("pay/status?paid=" + encodeURIComponent(id)); if (r.j.status === "succeeded" && r.j.code) st = r.j; else if (r.j.status === "canceled") break; } catch (e) {}
      if (!st) await sleep(2000);
    }
    ov.close();
    if (!st) return sheetMsg("Оплата не прошла", "Деньги не списаны. Можно попробовать ещё раз из списка глав.");
    Save.d.code = st.code; Save.save(); await this.check(); celebrate();
    await sheetMsg("Спасибо! Вся игра открыта", `Код вашей семьи: <b class="pcode">${st.code}</b>Запишите его: с ним игра откроется и на другом телефоне.`);
  },
  /* Глава закрыта: экран для родителей. Возвращает true, если после него можно играть */
  wall() {
    return new Promise(res => {
      Voice.stop();
      const buy = this.inTG ? `<p class="small pnote">Полную версию оформляют на сайте рахмат.рус. Если код уже есть — введите его.</p>` :
        `<div class="plans"><button class="plan main" data-p="year"><b>${PRICES.year.toLocaleString("ru-RU")} ₽ в год</b><small>≈${Math.round(PRICES.year / 12)} ₽ в месяц · выгоднее на 40%</small></button>` +
        `<button class="plan" data-p="month"><b>${PRICES.month} ₽ в месяц</b><small>можно отменить в любой момент</small></button></div>`;
      const ov = sheet(`<h2>Полная версия</h2><p class="small">Для родителей</p>
        <ul class="pfeat"><li>Все 5 уровней — 29 глав</li><li>Новые главы каждый месяц</li><li>Одна подписка на всех детей в семье</li></ul>
        <div class="pgate"><p>Сколько будет <b class="gq"></b>?</p><div class="gans"></div></div>
        <div class="pbuy" hidden>${buy}<button class="btn line pcodebtn">У меня есть код</button>
        <p class="small poffer">Автопродление, отключить можно в любой момент. <a href="oferta.html" target="_blank">Оферта</a></p></div>
`);
      ov.classList.add("paysheet");
      /* «Для взрослых»: малыш не дойдёт до оплаты случайно */
      const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 5), sum = a + b;
      ov.querySelector(".gq").textContent = `${a} + ${b}`;
      const opts = [sum, sum + 1, sum - 2].sort(() => Math.random() - 0.5);
      ov.querySelector(".gans").innerHTML = opts.map(n => `<button class="gbtn">${n}</button>`).join("");
      ov.querySelectorAll(".gbtn").forEach(g => g.onclick = () => {
        Snd.tap();
        if (+g.textContent === sum) { ov.querySelector(".pgate").hidden = true; ov.querySelector(".pbuy").hidden = false; }
        else { g.disabled = true; g.classList.add("no"); }
      });
      const done = v => { ov.close(); res(v); };
      ov.withX(() => done(false));
      ov.querySelectorAll(".plan").forEach(p => p.onclick = async () => {
        Snd.tap(); p.disabled = true;
        try {
          const r = await this.api("pay/start", { plan: p.dataset.p, code: this.code || undefined });
          if (r.ok && r.j.confirmation_url) { location.href = r.j.confirmation_url; return; }
        } catch (e) {}
        p.disabled = false; toast("<b>Не получилось открыть оплату</b><i>Попробуйте чуть позже</i>", 2600);
      });
      ov.querySelector(".pcodebtn").onclick = async () => { Snd.tap(); if (await this.codeSheet()) done(true); };
    });
  },
  /* Ввести код семьи (купили на другом устройстве) */
  codeSheet() {
    return new Promise(res => {
      const ov = sheet(`<h2>Код семьи</h2><input class="nmin pcin" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="АБВ-1234">
        <p class="small pmsg"></p><div class="row"><button class="btn" data-a="ok">Открыть игру</button></div>`);
      const inp = ov.querySelector(".pcin"), msg = ov.querySelector(".pmsg");
      ov.withX(() => { ov.close(); res(false); });
      ov.querySelector("[data-a=ok]").onclick = async () => {
        Snd.tap(); const code = inp.value.trim().toUpperCase(); if (!code) return;
        let r; try { r = await this.api("me?code=" + encodeURIComponent(code)); } catch (e) { msg.textContent = "Нет связи, попробуйте ещё раз"; return; }
        if (r.ok && r.j.active) { Save.d.code = code; Save.save(); this.set(r.j); celebrate(); ov.close(); res(true); }
        else msg.textContent = r.status === 429 ? "Слишком много попыток, подождите немного" : r.ok ? "Подписка по этому коду закончилась" : "Такого кода нет — проверьте буквы и цифры";
      };
      setTimeout(() => inp.focus(), 300);
    });
  },
  /* Для родителей: состояние подписки, код, автопродление */
  async manage() {
    await this.check();
    const d = this.until ? new Date(this.until).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "";
    const body = this.active
      ? `<p class="small">Полная версия открыта до <b>${d}</b></p><p class="small">Код семьи: <b class="pcode">${this.code}</b></p>
         <div class="row"><button class="btn line" data-a="auto">${this.autopay ? "Отключить автопродление" : "Включить автопродление"}</button></div>`
      : `<p class="small">Сейчас открыта бесплатная часть: уровень 1 и первые главы остальных уровней.</p>`;
    const ov = sheet(`<h2>Подписка</h2>${body}<div class="row"><button class="btn" data-a="close">Готово</button></div>`);
    ov.classList.add("paysheet");
    ov.querySelector("[data-a=close]").onclick = () => { Snd.tap(); ov.close(); };
    ov.withX(() => ov.close());
    const au = ov.querySelector("[data-a=auto]");
    if (au) au.onclick = async () => {
      Snd.tap(); au.disabled = true;
      const r = await this.api(this.autopay ? "autopay/off" : "autopay/on", { code: this.code }).catch(() => null);
      if (r && r.ok) { this.autopay = !this.autopay; Save.d.sub.autopay = this.autopay; Save.save(); au.textContent = this.autopay ? "Отключить автопродление" : "Включить автопродление"; }
      au.disabled = false;
    };
  }
};
/* Короткое сообщение в листе */
function sheetMsg(title, html) {
  return new Promise(res => {
    const ov = sheet(`<h2>${title}</h2><p class="small pmsgbig">${html}</p><div class="row"><button class="btn">Хорошо</button></div>`);
    ov.querySelector(".btn").onclick = () => { Snd.tap(); ov.close(); res(); };
  });
}
