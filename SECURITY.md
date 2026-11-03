# Security Policy / Политика безопасности

<p align="center">
  <a href="#english">English</a> · <a href="#русский">Русский</a>
</p>

---

# English

## Supported Versions

Only the latest release of **Discord Username Checker (`index.js`)** receives security patches and compatibility updates.

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 2.x.x   | :white_check_mark: | Active |
| 1.x.x   | :x:                | Deprecated / End-of-Life |

---

## Zero-Token & Privacy Guarantee

This project is built with security, transparency, and user privacy as foundational principles:

1. **No External Network Calls**:
   - `index.js` contains **zero** `fetch()`, `XMLHttpRequest`, `WebSocket`, or external resource requests.
   - All network traffic originating during username validation is strictly the native communication between the official Discord client and Discord's own gateway/internal endpoints.
   - No data, statistics, usernames, or telemetry are ever transmitted to third-party servers, webhooks, or external destinations.

2. **Zero-Token Architecture**:
   - The script **never** inspects, reads, dumps, or accesses your Discord authorization token, email, passwords, phone numbers, or account secrets from `localStorage`, `sessionStorage`, or client memory.
   - It does not modify client core modules or hook into Discord’s private networking internals.

3. **In-Client DOM Emulation**:
   - Checking is performed 100% locally by emulating standard user typing via native React input dispatchers inside Discord’s existing "Change Username" dialog.
   - Results are kept strictly in local memory and are only exported when you explicitly click **"Download free.txt"** (using a local browser `Blob`) or **"Copy to clipboard"**.

4. **Open Source & Verifiable**:
   - The code is fully unminified and commented. You can audit every line of `index.js` before executing it in your DevTools console.

---

## Reporting a Vulnerability

If you discover a security vulnerability or privacy concern within this repository:

1. **Do not create a public issue** on GitHub.
2. Please submit your finding via **GitHub Private Vulnerability Reporting** (under the **Security** tab of this repository) or contact the maintainer directly.
3. Provide a clear description of:
   - The affected component or logic in `index.js`.
   - Steps to reproduce the issue.
   - Potential impact.
4. We aim to acknowledge reports within 48 hours and provide a resolution or mitigation as quickly as possible.

---

## Disclaimer

This project is intended strictly for educational, security auditing, and personal research purposes. Use this tool responsibly and in compliance with [Discord's Terms of Service](https://discord.com/terms) and [Community Guidelines](https://discord.com/guidelines). The maintainers accept no liability for misuse, rate limits, or any administrative actions taken on your account.

---

# Русский

## Поддерживаемые версии

Поддержка и обновления безопасности предоставляются только для актуальной мажорной версии **Discord Username Checker (`index.js`)**.

| Версия  | Поддержка          | Статус |
| ------- | ------------------ | ------ |
| 2.x.x   | :white_check_mark: | Актуальная |
| 1.x.x   | :x:                | Устарела / Не поддерживается |

---

## Гарантия безопасности и конфиденциальности

Данный скрипт разработан с акцентом на максимальную безопасность аккаунта и прозрачность:

1. **Полное отсутствие внешних сетевых запросов**:
   - В коде `index.js` **нет** вызовов `fetch()`, `XMLHttpRequest`, `WebSocket` или загрузки внешних скриптов/стилей.
   - Все запросы проверки отправляет сам официальный клиент Discord на свои штатные сервера ровно так же, как при ручном вводе.
   - Никакие собранные ники, результаты или данные не передаются на сторонние сервера или Discord-вебхуки.

2. **Архитектура без использования токенов (Zero-Token)**:
   - Скрипт **не читает** и не выгружает токен авторизации Discord, логин, пароль, телефон или сессионные куки из `localStorage` / памяти приложения.
   - Скрипт не вмешивается в ядро приложения Discord и не модифицирует файлы клиента.

3. **Работа исключительно через пользовательский интерфейс (DOM)**:
   - Проверка осуществляется локально через штатное модальное окно «Изменение имени пользователя» с помощью нативных React-диспатчеров событий ввода.
   - Все списки хранятся только в оперативной памяти текущей сессии и сохраняются на диск только по вашей явной команде («Скачать free.txt» через локальный browser `Blob`).

4. **Открытый читаемый код**:
   - Код скрипта не обфусцирован. Любой разработчик может проверить каждую строку `index.js` перед вставкой в консоль.

---

## Сообщение об уязвимости

Если вы обнаружили потенциальную уязвимость или проблему безопасности:

1. **Пожалуйста, не создавайте публичный Issue** в репозитории.
2. Отправьте отчёт через **GitHub Private Vulnerability Reporting** (вкладка **Security** репозитория) или свяжитесь со мной напрямую (Discord: foreverfame).
3. Опишите:
   - Место в коде `index.js`, вызывающее опасение.
   - Шаги для воспроизведения.
   - Возможные последствия.
4. Ответ обычно предоставляются в течение 48 часов.

---

## Отказ от ответственности

Инструмент создан исключительно в образовательных и исследовательских целях. Соблюдайте [Условия обслуживания Discord](https://discord.com/terms) и правила сообщества. Разработчики не несут ответственности за возможные ограничения аккаунта или временные rate-limit блокировки, вызванные злоупотреблением проверками.
