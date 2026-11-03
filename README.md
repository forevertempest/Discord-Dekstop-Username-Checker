<div align="center">

# Discord Username Checker (In-Client Edition)

**Высокоскоростная пакетная проверка доступности юзернеймов Discord прямо в клиенте.**  
*100% Native Client Automation · Zero Tokens · Zero APIs · Obsidian Glass UI*

<p>
  <a href="#русский">Русский</a> · <a href="#english">English</a>
</p>

<p>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-white?style=for-the-badge" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Pure JS">
  <img src="https://img.shields.io/badge/Client-Discord%20%7C%20Web%20%7C%20PTB%20%7C%20Canary-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord Compatible">
  <img src="https://img.shields.io/badge/Security-Zero%20Token-22c55e?style=for-the-badge&logo=shield" alt="Zero Token">
  <img src="https://img.shields.io/badge/Language-RU%20%7C%20EN-white?style=for-the-badge" alt="Bilingual">
</p>

<p>
  <img src="./free.png" alt="Available Status" height="38" />
  <img src="./taken.png" alt="Taken Status" height="38" />
  <img src="./invalid.png" alt="Invalid Status" height="38" />
</p>

<sub>Архитектурный монохромный интерфейс в стиле Obsidian Glass с Canvas Dot Matrix и чистой эмуляцией DOM-событий React</sub>

</div>

---

## Быстрая навигация / Navigation

- [Русский](#русский)
  - [Почему In-Client?](#почему-in-client)
  - [Быстрый старт за 15 секунд](#быстрый-старт-за-15-секунд)
  - [Возможности панели управления](#возможности-панели-управления)
  - [Как включить DevTools в Discord](#как-включить-devtools-в-клиенте-discord)
  - [Безопасность и приватность](#безопасность-и-приватность)
- [English](#english)
  - [Why In-Client?](#why-in-client)
  - [Quick Start in 15 Seconds](#quick-start-in-15-seconds)
  - [Control Panel Features](#control-panel-features)
  - [Enabling DevTools in Discord Client](#enabling-devtools-in-discord-desktop)
  - [Security & Privacy](#security--privacy)

---

# Русский

## Почему In-Client?

Традиционные чекеры юзернеймов Discord используют прямые HTTP-запросы к API и требуют токен учётной записи. Это приводит к мгновенной блокировке токенов, капче (hCaptcha/Cloudflare) и риску перманентного бана аккаунта.

**Discord Username Checker (`index.js`)** работает по принципиально иной схеме:
- **Никаких токенов и логинов**: скрипт выполняется прямо в вашей открытой сессии Discord.
- **Чистый DOM-ввод**: значения вводятся в штатное поле смены имени через React prototype-сеттеры и нативные события.
- **Никаких сторонних запросов**: ни один байт данных не уходит наружу. Только штатное взаимодействие официального клиента Discord со своими серверами.

---

## Быстрый старт за 15 секунд

1. Откройте **Discord** (в браузере или в приложении на ПК).
2. Нажмите **`Ctrl + Shift + I`** (или **`F12`**) для открытия консоли разработчика.
3. Перейдите во вкладку **Console** (**Консоль**).
4. Скопируйте весь код из файла [`index.js`](file:///C:/workspace/discord/user-checker/index.js), вставьте его в консоль и нажмите **Enter**.
5. Поверх окна Discord появится панель управления:
   - Нажмите кнопку **«Найти поле ввода»** — скрипт сам откроет *Настройки пользователя → Моя учётная запись → Имя пользователя → Изменить*.
   - Вставьте список ников в поле ввода (по одному на строку).
   - Нажмите **«Начать проверку»**.
   - По завершении нажмите **«Скопировать свободные»** или **«Скачать free.txt»**.

---

## Возможности панели управления

### Дизайн и визуализация
- **Obsidian Glass aesthetic**: глубокий темный монохромный стиль, тонкие границы `1px rgba(255, 255, 255, 0.08)`, матовое размытие фона (`backdrop-filter: blur(28px)`).
- **Интерактивный Dot Matrix (Canvas)**: динамическая сетка точек с параллакс-откликом на движение курсора мыши и радиальным прожектором (spotlight).
- **3D Canvas Prism**: математический 3D-призм в правом верхнем углу со сменой состояний (ожидание, проверка, успех, занято).
- **Векторные SVG-иконки**: четкие векторные пиктограммы высокого разрешения без эмодзи.
- **Двуязычный интерфейс (RU / EN)**: переключение языка в 1 клик прямо в шапке панели с обновлением всех логов и текстов на лету.

### Логика и автоматизация
- **Авто-навигатор «Найти поле ввода»**: находит шестеренку настроек, переходит в учетную запись и нажимает кнопку изменения никнейма.
- **Чистка списка в 1 клик**:
  - `Без @` — мгновенно срезает символы `@`, пробелы и лишние спецсимволы.
  - `Без дублей` — оставляет только уникальные имена.
  - `Очистить` — быстро сбрасывает поле ввода.
- **Сброс состояния перед проверкой**: перед вводом каждого имени поле полностью очищается, предотвращая залипание предыдущего результата валидатора.
- **Журнал событий и фильтры**: удобные вкладки фильтрации лога — `[Все]`, `[Свободные]`, `[Занятые]`, `[Ошибки]`.
- **Экспорт результатов**:
  - Копирование всех найденных свободных ников в системный буфер обмена.
  - Мгновенное сохранение в файл `free.txt` через нативный browser Blob без серверных запросов.

---

## Как включить DevTools в клиенте Discord

Если по нажатию `Ctrl + Shift + I` или `F12` в официальном десктопном приложении Discord консоль не открывается:

### Вариант 1. Через веб-версию (Самый простой)
Откройте [discord.com/app](https://discord.com/app) в любом браузере (Chrome, Brave, Edge, Firefox, Opera), где DevTools доступен по умолчанию.

### Вариант 2. Включение DevTools в официальном Discord Desktop
1. Закройте Discord.
2. Откройте файл настроек:
   - **Windows**: нажмите `Win + R`, введите `%APPDATA%\discord\settings.json` и нажмите Enter.
   - **macOS**: `~/Library/Application Support/discord/settings.json`
   - **Linux**: `~/.config/discord/settings.json`
3. Добавьте параметр `"DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true`:
   ```json
   {
     "IS_MAXIMIZED": true,
     "IS_MINIMIZED": false,
     "DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true
   }
   ```
4. Сохраните файл и запустите Discord. Теперь `Ctrl + Shift + I` будет открывать консоль.

*(Либо используйте сборку **Discord Canary** или **Discord PTB**, где DevTools включен из коробки).*

---

## Безопасность и приватность

- Скрипт не осуществляет сетевых запросов (`fetch`, `XMLHttpRequest`, `WebSocket`) на сторонние ресурсы.
- Скрипт не читает токен учётной записи из `localStorage` / памяти.
- Подробная информация доступна в [SECURITY.md](SECURITY.md).

---

# English

## Why In-Client?

Conventional username availability checkers make direct HTTP requests to Discord's private endpoints and require an authorization token. This often triggers immediate token termination, strict Cloudflare / hCaptcha challenges, or account flags.

**Discord Username Checker (`index.js`)** runs directly within the client DOM:
- **Zero Tokens Required**: Runs inside your already authenticated session.
- **Pure React DOM Emulation**: Injects input using prototype setters and dispatches synthetic events identical to manual keyboard input.
- **Zero External Telemetry**: No third-party network calls, analytics, or webhooks.

---

## Quick Start in 15 Seconds

1. Open **Discord** (either in the desktop app or in your web browser).
2. Press **`Ctrl + Shift + I`** (or **`F12`**) to open DevTools.
3. Switch to the **Console** tab.
4. Copy the entire contents of [`index.js`](file:///C:/workspace/discord/user-checker/index.js), paste into the console, and hit **Enter**.
5. The overlay interface will appear:
   - Click **"Locate input field"** — the script navigates directly to *User Settings → My Account → Username → Edit*.
   - Paste your usernames list (one per line).
   - Click **"Start check"**.
   - When finished, click **"Copy available"** or **"Download free.txt"**.

---

## Control Panel Features

- **Obsidian Glass Aesthetic**: Frosted glass blur (`backdrop-filter`), monochrome palette, 1px subtle borders.
- **Dynamic Dot Matrix**: Mouse-tracking canvas grid with spotlight reaction.
- **3D Wireframe Prism**: Real-time rendering prism reflecting current verification state.
- **Bilingual (EN / RU)**: Real-time UI and log translation with one click in the header.
- **List Hygiene Utilities**:
  - `Trim @` — strips `@` characters and surrounding whitespace.
  - `Deduplicate` — removes duplicates while maintaining order.
  - `Clear` — clears current username input.
- **Activity Log with Filters**: Toggle between `All`, `Available`, `Taken`, and `Invalid`.
- **One-Click Export**: Instant clipboard copy or client-side `Blob` download of `free.txt`.

---

## Enabling DevTools in Discord Desktop

If `Ctrl + Shift + I` does not open DevTools in your desktop client:

1. Close Discord completely.
2. Open `%APPDATA%\discord\settings.json` (Windows) or `~/.config/discord/settings.json` (Linux).
3. Insert `"DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true`.
4. Relaunch Discord and press `Ctrl + Shift + I`.
*(Alternatively, use [discord.com/app](https://discord.com/app) in Google Chrome or Microsoft Edge).*

---

## License & Security

- Licensed under the [MIT License](LICENSE).
- Security considerations and guarantees are outlined in [SECURITY.md](SECURITY.md).
