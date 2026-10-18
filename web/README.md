# рахмат.рус

Трекер «Трекер». Timeweb App Platform собирает корневой `Dockerfile` из `main` при каждом пуше. В образ попадает только `web/`.

## Переменные окружения (панель Timeweb → приложение → Переменные)

| Переменная | Зачем |
|---|---|
| `TRACKER_KEY` | необязательно (сейчас не задан — сайт открыт без ключа). Если задать: один раз открыть `https://рахмат.рус/?k=КЛЮЧ` на каждом устройстве |
| `ANTHROPIC_API_KEY` | ключ Claude API (console.anthropic.com → API Keys) для вкладки «ИИ». Без него вкладка пишет, что ключа нет; остальное работает. Сервер ограничивает 20 разборов в сутки |
| `GITHUB_TOKEN` | fine-grained токен GitHub: только репо `vseum/jarvis-azata`, Contents: Read and write. Без него данные живут только в контейнере и **стираются при каждом деплое** |
| `GITHUB_REPO` | по умолчанию `vseum/jarvis-azata` |
| `DATA_BRANCH` | по умолчанию `data` |
| `IGRA_DB_URL` | подписка игры (`igra-pay.js`): строка PostgreSQL `postgres://user:pass@host:5432/db` (для облачной базы с TLS добавить `?sslmode=require`). Таблицы `igra_accounts`, `igra_payments` создаются сами. Без неё эндпоинты оплаты отвечают 503, игра работает |
| `ROBOKASSA_LOGIN`, `ROBOKASSA_PASS1`, `ROBOKASSA_PASS2` | основной провайдер оплаты игры — Робокасса (кабинет → Магазин → Технические настройки: идентификатор магазина, Пароль #1, Пароль #2). В тестовом режиме — тестовые пароли |
| `ROBOKASSA_HASH` | алгоритм подписи, как выбран в технических настройках: `md5` (по умолчанию) или `sha256` |
| `ROBOKASSA_TEST` | `1` — тестовые платежи (`IsTest=1`). Автопродление и OpStateExt в тесте у Робокассы не работают |
| `ROBOKASSA_RECEIPT` | `0` — не передавать номенклатуру чека (`Receipt`). По умолчанию передаётся одна позиция «Доступ к полной версии игры…» |
| `IGRA_PAY` | `robokassa` или `yookassa` — кем принимать новые оплаты. По умолчанию Робокасса, если заданы её ключи |
| `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` | запасной провайдер ЮKassa (Интеграция → Ключи API). Уведомления: `https://xn--80aa9aonp.xn--p1acf/igra/api/pay/hook`, события `payment.succeeded`, `payment.canceled`, `refund.succeeded` |

Робокасса, технические настройки магазина: Result URL `https://xn--80aa9aonp.xn--p1acf/igra/api/pay/hook/robokassa` (метод POST); Success URL и Fail URL — `https://xn--80aa9aonp.xn--p1acf/igra/api/pay/return` (метод GET); алгоритм хеша = `ROBOKASSA_HASH`.

Проверка подписки локально: `node tools/igra-pay-test-robokassa.js [postgres://…] [md5|sha256]` и `node tools/igra-pay-test.js [postgres://…]` (ЮKassa). С адресом базы тесты очищают таблицы `igra_*`!

## Где данные

Ветка `data`, файл `habits/days.json` (создаётся сама, отдельная ветка без кода — пуши в неё не запускают деплой). Сервер пишет туда через 15 с после последней отметки и при остановке контейнера. Телефон держит свою копию и досылает дни, которых нет на сервере.

## API (заголовок `X-Key` или `?k=`)

- `GET /api/days` — все дни
- `PUT /api/days/YYYY-MM-DD` — `{v, score, pct}`
- `GET /api/days/YYYY-MM-DD` — один день (для виджета)
- `GET /api/widget/YYYY-MM-DD` — для виджета: документ дня, привычки дня (`{id, n, note, block, s, miss, tap}`) и счёт, как на сайте
- `POST /api/toggle` — `{d, kind: focus|_tasks|_fun|habit, id, done}`: отметить дело или простую привычку из виджета, не трогая остальной документ
- `/widget` — виджет «План дня» для iPhone (Scriptable): инструкция и код (`widget.js`)
- `GET /api/status` — число дней, последняя синхронизация с GitHub, ошибка
- `GET /healthz`

## Локально

```
cd web && TRACKER_KEY=test node server.js   # http://localhost:8080/?k=test
```
