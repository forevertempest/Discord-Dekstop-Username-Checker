/**
 * Discord Username Checker — In-Client DevTools Console Edition
 * 
 * Minimalist High-End UI with Fluid Micro-Animations & Reliable Window Controls
 * 100% In-Client Native Verification (Zero APIs, Zero Tokens, Pure React DOM)
 * Aesthetic: Architectural Monochrome / Obsidian Glass / Pure White Accents
 *
 * Architecture:
 * ├── CONFIG          - Core constants, DOM identifiers, timings, regexes
 * ├── I18N            - Localization dictionary & string interpolation (RU / EN)
 * ├── ASSETS          - High-DPI crisp vector SVG icons
 * ├── STATE           - Central application state store
 * ├── UTILS           - Async timers, clipboard fallbacks, file exports, sanitizers
 * ├── DISCORD_BRIDGE  - React synthetic DOM setter, modal navigation, status parser
 * ├── GRAPHICS        - High-performance Canvas rendering engines
 * │   ├── DotMatrix   - Dynamic mouse-tracking canvas grid with spotlight & parallax
 * │   └── Prism3D     - Mathematical 3D wireframe prism with dynamic lighting
 * ├── UI              - View layer & window controls
 * │   ├── Styles      - Obsidian Glass CSS injection
 * │   ├── Template    - Component HTML markup builder
 * │   ├── Window      - Draggable physics, boundary clamping, minimization
 * │   └── View        - Reactive DOM bindings, stats pop animations, logs & filters
 * ├── CONTROLLER      - Verification queue, rate-limit backoff, tools & export
 * └── APP             - Application lifecycle, singleton management, teardown hooks
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. CONFIGURATION
    // =========================================================================

    const CONFIG = {
        PANEL_ID: 'discord-pomelo-checker-overlay',
        STYLE_ID: 'dpc-styles',
        SPEED_DELAY: 250,
        MAX_WAIT_MS: 3200,
        POLL_INTERVAL_MS: 40,
        RATE_LIMIT_PAUSE_SEC: 4.0,
        INPUT_SETTLE_MS: 100,
        DOT_SPACING: 20,
        SPOTLIGHT_RADIUS: 140,
        USERNAME_REGEX: /^[a-z0-9_.]{2,32}$/,
    };

    // =========================================================================
    // 2. LOCALIZATION ENGINE (RU / EN)
    // =========================================================================

    const I18N = {
        ru: {
            brandTitle: 'Username Checker',
            btnMin: 'Свернуть',
            btnExpand: 'Развернуть',
            btnClose: 'Закрыть',
            statusReady: 'Готов к проверке',
            statusChecking: 'Проверка',
            statusRateLimit: 'Ограничение запросов (пауза {s}с)',
            statusDone: 'Завершено: найдено {count}',
            statusStopped: 'Остановлено пользователем',
            locateBtn: 'Найти поле ввода',
            locateSearching: 'Поиск...',
            locateFound: 'Поле найдено',
            locateNotFound: 'Не найдено',
            statFree: 'Свободно',
            statTaken: 'Занято',
            statInvalid: 'Ошибки',
            statRate: 'Лимит',
            inputLabel: 'Список имён:',
            inputPlaceholder: 'Введите юзернеймы (по одному на строку)...',
            toolClean: 'Без @',
            toolDedup: 'Без дублей',
            toolClear: 'Очистить',
            linesCount: '{count} строк',
            progressLabel: 'Прогресс',
            btnStart: 'Начать проверку',
            btnStop: 'Остановить',
            logHeader: 'Журнал событий',
            filterAll: 'Все',
            filterFree: 'Свободные',
            filterTaken: 'Занятые',
            filterInvalid: 'Ошибки',
            logEmpty: 'Нажмите «Начать проверку» для запуска',
            copyFree: 'Скопировать свободные',
            copyFreeCount: 'Скопировать свободные ({count})',
            downloadFree: 'Скачать free.txt',
            toastCopied: 'Скопировано в буфер обмена',
            toastDownloaded: 'Файл free.txt сохранён',
            toastEmpty: 'Список пуст',
            toastNoFree: 'Свободные имена не найдены',
            toastCleaned: 'Символы @ и пробелы удалены',
            toastDeduped: 'Дубликаты удалены (осталось {count})',
            logStarted: 'Запуск проверки: {count} имён',
            logErrorField: 'Ошибка: поле ввода не найдено в окне',
            logFinished: 'Проверка завершена. Свободно: {free} из {total}',
            logRateWait: 'Пауза из-за лимита запросов: {s}с',
            detailFree: 'Свободно',
            detailTaken: 'Занято',
            detailInvalid: 'Некорректный формат',
            detailTimeout: 'Таймаут ответа',
            miniFreeText: '{count} свободно',
        },
        en: {
            brandTitle: 'Username Checker',
            btnMin: 'Minimize',
            btnExpand: 'Expand',
            btnClose: 'Close',
            statusReady: 'Ready to check',
            statusChecking: 'Checking',
            statusRateLimit: 'Rate limited (wait {s}s)',
            statusDone: 'Done: found {count}',
            statusStopped: 'Stopped by user',
            locateBtn: 'Locate input field',
            locateSearching: 'Searching...',
            locateFound: 'Field ready',
            locateNotFound: 'Not found',
            statFree: 'Available',
            statTaken: 'Taken',
            statInvalid: 'Invalid',
            statRate: 'Rate Limit',
            inputLabel: 'Usernames list:',
            inputPlaceholder: 'Enter usernames (one per line)...',
            toolClean: 'Trim @',
            toolDedup: 'Deduplicate',
            toolClear: 'Clear',
            linesCount: '{count} lines',
            progressLabel: 'Progress',
            btnStart: 'Start check',
            btnStop: 'Stop check',
            logHeader: 'Activity log',
            filterAll: 'All',
            filterFree: 'Available',
            filterTaken: 'Taken',
            filterInvalid: 'Invalid',
            logEmpty: 'Press "Start check" to begin',
            copyFree: 'Copy available',
            copyFreeCount: 'Copy available ({count})',
            downloadFree: 'Download free.txt',
            toastCopied: 'Copied to clipboard',
            toastDownloaded: 'free.txt saved',
            toastEmpty: 'List is empty',
            toastNoFree: 'No available usernames found',
            toastCleaned: 'Trimmed @ symbols and whitespace',
            toastDeduped: 'Duplicates removed ({count} left)',
            logStarted: 'Starting verification of {count} names',
            logErrorField: 'Error: username input not found',
            logFinished: 'Check complete. Available: {free} of {total}',
            logRateWait: 'Rate limit pause: {s}s',
            detailFree: 'Available',
            detailTaken: 'Taken',
            detailInvalid: 'Invalid format',
            detailTimeout: 'Response timeout',
            miniFreeText: '{count} free',
        }
    };

    function t(key, params = {}) {
        let str = I18N[STATE.lang]?.[key] || I18N['en']?.[key] || key;
        for (const [k, v] of Object.entries(params)) {
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
        return str;
    }

    // =========================================================================
    // 3. VECTOR ASSETS (High-DPI Inline SVGs)
    // =========================================================================

    const ASSETS = {
        search: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
        play: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>`,
        stop: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
        copy: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
        download: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
        check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        min: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        expand: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
        clean: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
        dedup: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="1"/><rect width="8" height="8" x="13" y="13" rx="1"/></svg>`,
        clear: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    };

    // =========================================================================
    // 4. CENTRAL APPLICATION STATE
    // =========================================================================

    const STATE = {
        lang: 'ru',
        isMinimized: false,
        isRunning: false,
        usernames: [],
        currentIndex: 0,
        filter: 'ALL',
        gemState: 'idle', // 'idle' | 'running' | 'free'
        stats: {
            total: 0,
            free: 0,
            taken: 0,
            invalid: 0,
            rateLimit: 0,
            error: 0,
        },
        freeList: [],
        animationFrameId: null,
        toastTimer: null,
    };

    // =========================================================================
    // 5. UTILITY FUNCTIONS
    // =========================================================================

    const Utils = {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        cancellableSleep(ms) {
            return new Promise(resolve => {
                const start = performance.now();
                const interval = setInterval(() => {
                    if (!STATE.isRunning || performance.now() - start >= ms) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 40);
            });
        },

        sanitizeUsername(line) {
            return (line || '').trim().replace(/^@+/, '').trim().toLowerCase();
        },

        parseUsernames(rawText) {
            const rawLines = rawText.split('\n');
            const result = [];
            const seen = new Set();

            for (const line of rawLines) {
                const u = Utils.sanitizeUsername(line);
                if (!u || u.startsWith('#')) continue;
                if (seen.has(u)) continue;
                seen.add(u);
                result.push(u);
            }
            return result;
        },

        fallbackCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            ta.style.pointerEvents = 'none';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('[Discord Checker] Fallback copy failed:', err);
            }
            ta.remove();
        },

        async copyToClipboard(text) {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    Utils.fallbackCopy(text);
                }
                return true;
            } catch (err) {
                Utils.fallbackCopy(text);
                return true;
            }
        },

        downloadTextFile(filename, text) {
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
    };

    // =========================================================================
    // 6. DISCORD CLIENT BRIDGE (Pure React DOM & Webpack Internals)
    // =========================================================================

    const DiscordBridge = {
        setNativeValue(element, value) {
            const lastValue = element.value;
            const prototypeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (prototypeSetter) {
                prototypeSetter.call(element, value);
            } else {
                element.value = value;
            }
            const tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        },

        findUsernameInput() {
            let inp = document.querySelector('input[name="username"]');
            if (inp && !inp.closest('#' + CONFIG.PANEL_ID)) return inp;

            const allInputs = Array.from(document.querySelectorAll('input:not([type="password"]):not([type="file"])'));
            inp = allInputs.find(i => {
                if (i.closest('#' + CONFIG.PANEL_ID)) return false;
                const role = (i.getAttribute('role') || '').toLowerCase();
                const ph = (i.getAttribute('placeholder') || '').toLowerCase();
                const aria = (i.getAttribute('aria-label') || '').toLowerCase();
                const isSearch = role === 'searchbox' || ph.includes('поиск') || ph.includes('search') || aria.includes('поиск') || aria.includes('search');
                return !isSearch && (i.closest('[role="dialog"]') || i.closest('form'));
            });
            return inp || null;
        },

        findSettingsGear() {
            const exact = document.querySelector('button[aria-label="Настройки пользователя"], button[aria-label="User Settings"]');
            if (exact) return exact;

            const userPanel = document.querySelector('section[class*="panels_"], [aria-label="Панель пользователя"], [aria-label="User area"]');
            if (userPanel) {
                const btns = Array.from(userPanel.querySelectorAll('button')).filter(b => {
                    const label = (b.getAttribute('aria-label') || '').toLowerCase();
                    return !label.includes('микрофон') && !label.includes('mute') && !label.includes('звук') && !label.includes('deafen');
                });
                if (btns.length > 0) return btns[btns.length - 1];
            }
            return null;
        },

        async ensureMyAccountSection() {
            if (DiscordBridge.findUsernameEditButton()) return true;

            const tabs = Array.from(document.querySelectorAll('[role="tab"], [class*="item_"], [class*="side_"] div'));
            for (const t of tabs) {
                const txt = (t.textContent || '').trim().toLowerCase();
                const tabId = t.getAttribute('data-tab-id');
                if (tabId === 'ACCOUNT' || txt === 'моя учётная запись' || txt === 'моя учетная запись' || txt === 'my account' || txt === 'учётная запись' || txt === 'учетная запись') {
                    t.click();
                    await Utils.sleep(350);
                    return true;
                }
            }
            return false;
        },

        findUsernameEditButton() {
            const scrollers = Array.from(document.querySelectorAll('[class*="contentColumn_"], [class*="customScroller_"], [class*="scroller_"]'));
            for (const s of scrollers) {
                try { s.scrollTop = 0; } catch (e) {}
            }

            const allLabels = Array.from(document.querySelectorAll('h2, h3, h4, h5, div, span'));
            const label = allLabels.find(el => {
                const txt = (el.textContent || '').trim().toLowerCase();
                return (txt === 'имя пользователя' || txt === 'username') && !txt.includes('отображаемое') && !txt.includes('display');
            });

            if (label) {
                let cur = label.parentElement;
                for (let i = 0; i < 5 && cur; i++) {
                    const btn = cur.querySelector('button');
                    if (btn && (btn.textContent.includes('Изменить') || btn.textContent.includes('Edit'))) {
                        return btn;
                    }
                    cur = cur.parentElement;
                }
            }

            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
                const text = (b.textContent || '').trim();
                if (text !== 'Изменить' && text !== 'Edit') return false;
                const pTxt = ((b.parentElement?.textContent || '') + ' ' + (b.parentElement?.parentElement?.textContent || '')).toLowerCase();
                const isEmail = pTxt.includes('@');
                const isPhone = pTxt.includes('+') || pTxt.includes('показать') || pTxt.includes('reveal');
                const isPassword = pTxt.includes('пароль') || pTxt.includes('password');
                const isDelete = pTxt.includes('удалить') || pTxt.includes('отключить') || pTxt.includes('delete') || pTxt.includes('disable');
                return !isEmail && !isPhone && !isPassword && !isDelete;
            });

            return btn || null;
        },

        async openUsernameEditModal() {
            let input = DiscordBridge.findUsernameInput();
            if (input) {
                DiscordBridge.highlightInput(input);
                return input;
            }

            let editBtn = DiscordBridge.findUsernameEditButton();
            if (editBtn) {
                editBtn.click();
                await Utils.sleep(400);
                input = DiscordBridge.findUsernameInput();
                if (input) {
                    DiscordBridge.highlightInput(input);
                    return input;
                }
            }

            let openedViaWebpack = false;
            try {
                if (window.webpackChunkdiscord_app) {
                    window.webpackChunkdiscord_app.push([[Symbol()], {}, (req) => {
                        for (const m of Object.keys(req.c).map(x => req.c[x]?.exports).filter(Boolean)) {
                            if (typeof m.openUserSettings === 'function') {
                                m.openUserSettings();
                                openedViaWebpack = true;
                                break;
                            }
                        }
                    }]);
                }
            } catch (e) {}

            if (openedViaWebpack) {
                await Utils.sleep(400);
            } else {
                const gear = DiscordBridge.findSettingsGear();
                if (gear) {
                    gear.click();
                    await Utils.sleep(450);
                }
            }

            await DiscordBridge.ensureMyAccountSection();
            await Utils.sleep(350);

            editBtn = DiscordBridge.findUsernameEditButton();
            if (editBtn) {
                editBtn.click();
                await Utils.sleep(450);
            }

            input = DiscordBridge.findUsernameInput();
            if (input) {
                DiscordBridge.highlightInput(input);
                return input;
            }

            return null;
        },

        highlightInput(input) {
            if (!input) return;
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.style.outline = '2px solid #ffffff';
            input.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.45)';
            input.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                if (input) {
                    input.style.outline = '';
                    input.style.boxShadow = '';
                }
            }, 1800);
        },

        async evaluateStatus(username, inputElement) {
            const started = performance.now();
            const container = inputElement.closest('[role="dialog"]') ||
                              inputElement.closest('form') ||
                              inputElement.closest('[class*="contentColumn_"]') ||
                              inputElement.closest('section') ||
                              inputElement.parentElement?.parentElement?.parentElement ||
                              inputElement.parentElement;

            DiscordBridge.setNativeValue(inputElement, '');
            await Utils.sleep(90);

            DiscordBridge.setNativeValue(inputElement, username);
            await Utils.sleep(CONFIG.INPUT_SETTLE_MS);

            let waited = CONFIG.INPUT_SETTLE_MS;

            while (waited < CONFIG.MAX_WAIT_MS) {
                await Utils.sleep(CONFIG.POLL_INTERVAL_MS);
                waited += CONFIG.POLL_INTERVAL_MS;

                const statusEl = container ? container.querySelector(
                    '[class*="statusMessageContainer_"], [class*="helperTextContainer_"], [class*="statusContainer_"], [class*="errorMessage_"], [class*="success_"], [class*="colorStatusPositive_"], [class*="colorStatusDanger_"], [class*="description_"], [class*="defaultColor_"]'
                ) : null;

                let txt = '';
                if (statusEl) {
                    txt = statusEl.innerText || statusEl.textContent || '';
                } else if (container && !container.closest('#' + CONFIG.PANEL_ID)) {
                    txt = container.innerText || container.textContent || '';
                }
                const lower = txt.toLowerCase();

                // 1. FREE (English & Russian detection + CSS classes)
                const hasSuccessClass = Boolean(container && container.querySelector('[class*="success_"], [class*="colorStatusPositive_"], [class*="positive_"]'));
                const hasFreeText = lower.includes('свободно') ||
                                    lower.includes('доступно') ||
                                    lower.includes('is available') ||
                                    (lower.includes('available') && !lower.includes('unavailable'));

                if (hasSuccessClass || hasFreeText) {
                    const elapsed = ((performance.now() - started) / 1000).toFixed(2);
                    return { status: 'FREE', elapsed, detail: t('detailFree') };
                }

                // 2. TAKEN (English & Russian detection)
                const hasTakenText = lower.includes('занято') ||
                                     lower.includes('недоступно') ||
                                     lower.includes('already taken') ||
                                     lower.includes('unavailable') ||
                                     lower.includes('not available');

                if (hasTakenText) {
                    const elapsed = ((performance.now() - started) / 1000).toFixed(2);
                    return { status: 'TAKEN', elapsed, detail: t('detailTaken') };
                }

                // 3. RATE LIMIT (English & Russian detection)
                const hasRateLimitText = lower.includes('позже') ||
                                         lower.includes('слишком много') ||
                                         lower.includes('лимит') ||
                                         lower.includes('подождите') ||
                                         lower.includes('rate limit') ||
                                         lower.includes('slow down') ||
                                         lower.includes('too many') ||
                                         lower.includes('try again') ||
                                         lower.includes('please wait');

                if (hasRateLimitText) {
                    const elapsed = ((performance.now() - started) / 1000).toFixed(2);
                    return { status: 'RATE_LIMIT', elapsed, retryAfter: CONFIG.RATE_LIMIT_PAUSE_SEC, detail: 'Rate Limit' };
                }

                // 4. INVALID (English & Russian detection)
                const hasInvalidText = lower.includes('длина должна') ||
                                       lower.includes('используйте только') ||
                                       lower.includes('недопустим') ||
                                       lower.includes('от 2 до 32') ||
                                       lower.includes('must be') ||
                                       lower.includes('characters') ||
                                       lower.includes('only use') ||
                                       lower.includes('cannot contain') ||
                                       lower.includes('invalid');

                if (hasInvalidText && waited > 500) {
                    const elapsed = ((performance.now() - started) / 1000).toFixed(2);
                    return { status: 'INVALID', elapsed, detail: t('detailInvalid') };
                }
            }

            const elapsed = ((performance.now() - started) / 1000).toFixed(2);
            return { status: 'UNKNOWN', elapsed, detail: t('detailTimeout') };
        }
    };

    // =========================================================================
    // 7. GRAPHICS & VISUAL ENGINES (Pure Canvas 2D)
    // =========================================================================

    const Graphics = {
        DotMatrix: {
            canvas: null,
            ctx: null,
            panel: null,
            mouseX: window.innerWidth / 2,
            mouseY: window.innerHeight / 2,
            targetOffsetX: 0,
            targetOffsetY: 0,
            curOffsetX: 0,
            curOffsetY: 0,

            init(canvas, panel) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.panel = panel;
                this.onMouseMove = this.onMouseMove.bind(this);
                window.addEventListener('mousemove', this.onMouseMove);
            },

            onMouseMove(e) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.targetOffsetX = ((this.mouseX / window.innerWidth) - 0.5) * 44;
                this.targetOffsetY = ((this.mouseY / window.innerHeight) - 0.5) * 44;
            },

            render() {
                if (!this.canvas || !this.panel) return;
                const rect = this.panel.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const targetW = Math.round(rect.width * dpr);
                const targetH = Math.round(rect.height * dpr);

                if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
                    this.canvas.width = targetW;
                    this.canvas.height = targetH;
                }

                const ctx = this.ctx;
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.save();
                ctx.scale(dpr, dpr);

                const w = rect.width;
                const h = rect.height;
                const cornerRadius = STATE.isMinimized ? 12 : 16;

                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                    ctx.roundRect(0, 0, w, h, cornerRadius);
                } else {
                    ctx.moveTo(cornerRadius, 0);
                    ctx.lineTo(w - cornerRadius, 0);
                    ctx.arcTo(w, 0, w, cornerRadius, cornerRadius);
                    ctx.lineTo(w, h - cornerRadius);
                    ctx.arcTo(w, h, w - cornerRadius, h, cornerRadius);
                    ctx.lineTo(cornerRadius, h);
                    ctx.arcTo(0, h, 0, h - cornerRadius, cornerRadius);
                    ctx.lineTo(0, cornerRadius);
                    ctx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
                    ctx.closePath();
                }
                ctx.clip();

                this.curOffsetX += (this.targetOffsetX - this.curOffsetX) * 0.08;
                this.curOffsetY += (this.targetOffsetY - this.curOffsetY) * 0.08;

                const localMouseX = this.mouseX - rect.left;
                const localMouseY = this.mouseY - rect.top;

                const startX = (this.curOffsetX % CONFIG.DOT_SPACING) - CONFIG.DOT_SPACING;
                const startY = (this.curOffsetY % CONFIG.DOT_SPACING) - CONFIG.DOT_SPACING;
                const endX = w + CONFIG.DOT_SPACING;
                const endY = h + CONFIG.DOT_SPACING;

                for (let x = startX; x < endX; x += CONFIG.DOT_SPACING) {
                    for (let y = startY; y < endY; y += CONFIG.DOT_SPACING) {
                        const dx = x - localMouseX;
                        const dy = y - localMouseY;
                        const dist = Math.hypot(dx, dy);

                        let r = 1.15;
                        let alpha = 0.085;

                        if (dist < CONFIG.SPOTLIGHT_RADIUS) {
                            const norm = 1 - dist / CONFIG.SPOTLIGHT_RADIUS;
                            const factor = norm * norm;
                            r = 1.15 + factor * 1.85;
                            alpha = 0.085 + factor * 0.65;
                        }

                        const edgeX = Math.min(x, w - x);
                        const edgeY = Math.min(y, h - y);
                        const edgeDamp = Math.min(1, Math.min(edgeX, edgeY) / 28);

                        if (edgeDamp <= 0) continue;

                        ctx.beginPath();
                        ctx.arc(x, y, r, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * edgeDamp).toFixed(3)})`;
                        ctx.fill();
                    }
                }

                ctx.restore();
            },

            destroy() {
                window.removeEventListener('mousemove', this.onMouseMove);
            }
        },

        Prism3D: {
            canvas: null,
            ctx: null,
            vertices: [
                [0, 1.2, 0],
                [0.9, 0, 0.6],
                [-0.9, 0, 0.6],
                [0, 0, -1.0],
                [0, -1.2, 0],
            ],
            faces: [
                [0, 1, 2], [0, 2, 3], [0, 3, 1],
                [4, 2, 1], [4, 3, 2], [4, 1, 3],
            ],
            rotX: 0.25,
            rotY: 0.4,
            spinSpeed: 0.012,

            init(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
            },

            render() {
                if (!this.canvas) return;
                const ctx = this.ctx;
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const cx = this.canvas.width / 2;
                const cy = this.canvas.height / 2;
                const scale = 20;

                if (STATE.gemState === 'running') {
                    this.spinSpeed = 0.048;
                } else if (STATE.gemState === 'free') {
                    this.spinSpeed = 0.035;
                } else {
                    this.spinSpeed = 0.012;
                }

                this.rotY += this.spinSpeed;
                this.rotX += this.spinSpeed * 0.3;

                const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
                const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);

                const projected = this.vertices.map(([x, y, z]) => {
                    let x1 = x * cosY + z * sinY;
                    let z1 = -x * sinY + z * cosY;
                    let y2 = y * cosX - z1 * sinX;
                    let z2 = y * sinX + z1 * cosX;

                    const dist = 3.5;
                    const fov = 1 / (z2 + dist);
                    return {
                        x: cx + x1 * scale * fov * 2.8,
                        y: cy - y2 * scale * fov * 2.8,
                        z: z2,
                    };
                });

                const faceData = this.faces.map(face => {
                    const p0 = projected[face[0]];
                    const p1 = projected[face[1]];
                    const p2 = projected[face[2]];
                    const cp = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
                    const avgZ = (p0.z + p1.z + p2.z) / 3;
                    return { face, p0, p1, p2, cp, avgZ };
                });

                faceData.sort((a, b) => b.avgZ - a.avgZ);

                for (const { face, p0, p1, p2, cp } of faceData) {
                    if (cp <= 0) continue;

                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.closePath();

                    let baseR = 215, baseG = 215, baseB = 220;
                    if (STATE.gemState === 'free') {
                        baseR = 255; baseG = 255; baseB = 255;
                    } else if (STATE.gemState === 'running') {
                        baseR = 235; baseG = 235; baseB = 240;
                    }

                    const lightness = Math.min(1, Math.max(0.15, cp / 280));
                    const r = Math.floor(baseR * lightness + (1 - lightness) * 20);
                    const g = Math.floor(baseG * lightness + (1 - lightness) * 22);
                    const b = Math.floor(baseB * lightness + (1 - lightness) * 26);

                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fill();

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        },

        startLoop() {
            const loop = () => {
                Graphics.DotMatrix.render();
                Graphics.Prism3D.render();
                STATE.animationFrameId = requestAnimationFrame(loop);
            };
            STATE.animationFrameId = requestAnimationFrame(loop);
        },

        stopLoop() {
            if (STATE.animationFrameId) {
                cancelAnimationFrame(STATE.animationFrameId);
                STATE.animationFrameId = null;
            }
        }
    };

    // =========================================================================
    // 8. USER INTERFACE & STYLES
    // =========================================================================

    const UI = {
        Styles: {
            element: null,

            inject() {
                const prev = document.getElementById(CONFIG.STYLE_ID);
                if (prev) prev.remove();

                const style = document.createElement('style');
                style.id = CONFIG.STYLE_ID;
                style.textContent = `
                    @keyframes dpcEnter {
                        from { opacity: 0; transform: translateY(-12px) scale(0.97); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes dpcBeaconWave {
                        0% { transform: scale(0.6); opacity: 0.8; }
                        60% { transform: scale(1.6); opacity: 0.15; }
                        100% { transform: scale(2.2); opacity: 0; }
                    }
                    @keyframes dpcShimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes dpcRowSlideIn {
                        from { opacity: 0; transform: translateX(-6px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes dpcStatPop {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.18); }
                        100% { transform: scale(1); }
                    }
                    @keyframes dpcAmbientBreathe {
                        0%, 100% { opacity: 0.45; }
                        50% { opacity: 0.85; }
                    }

                    #${CONFIG.PANEL_ID} {
                        position: fixed;
                        top: 24px;
                        right: 24px;
                        width: 440px;
                        max-height: 90vh;
                        border-radius: 16px !important;
                        background: rgba(10, 10, 12, 0.90) !important;
                        backdrop-filter: blur(28px) saturate(180%) !important;
                        -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
                        border: 1px solid rgba(255, 255, 255, 0.13) !important;
                        box-shadow: 
                            0 28px 60px -12px rgba(0, 0, 0, 0.9),
                            0 0 0 1px rgba(255, 255, 255, 0.05),
                            inset 0 1px 0 0 rgba(255, 255, 255, 0.18) !important;
                        color: #e4e4e7;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif;
                        font-size: 13px;
                        z-index: 99999999 !important;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden !important;
                        user-select: none;
                        animation: dpcEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    #${CONFIG.PANEL_ID} * { box-sizing: border-box; }

                    #${CONFIG.PANEL_ID}.dpc-minimized {
                        width: auto !important;
                        min-width: 290px !important;
                        max-width: 340px !important;
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.14) !important;
                    }
                    #${CONFIG.PANEL_ID}.dpc-minimized .dpc-body,
                    #${CONFIG.PANEL_ID}.dpc-minimized .dpc-lang-switch {
                        display: none !important;
                    }
                    #${CONFIG.PANEL_ID}.dpc-minimized .dpc-mini-counter {
                        display: inline-flex !important;
                    }

                    .dpc-dot-canvas {
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        pointer-events: none;
                        z-index: 0;
                        border-radius: inherit;
                    }
                    .dpc-radial-bg {
                        position: absolute;
                        top: 0; left: 0; right: 0; height: 160px;
                        background: radial-gradient(80% 100% at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
                        pointer-events: none;
                        z-index: 0;
                        border-radius: 16px 16px 0 0;
                        animation: dpcAmbientBreathe 7s ease-in-out infinite;
                    }
                    .dpc-inner {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }
                    .dpc-header {
                        padding: 12px 16px;
                        background: rgba(255, 255, 255, 0.02);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        cursor: move;
                    }
                    .dpc-brand {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .dpc-canvas-prism {
                        width: 34px; height: 34px;
                        border-radius: 9px;
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        display: block;
                        flex-shrink: 0;
                        transition: transform 0.2s ease, border-color 0.2s ease;
                    }
                    .dpc-canvas-prism:hover {
                        transform: scale(1.08);
                        border-color: rgba(255, 255, 255, 0.3);
                    }
                    .dpc-brand-info {
                        display: flex;
                        flex-direction: column;
                    }
                    .dpc-brand-title {
                        font-weight: 700;
                        font-size: 13px;
                        color: #ffffff;
                        letter-spacing: -0.01em;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .dpc-mini-counter {
                        display: none;
                        font-size: 10px;
                        font-weight: 700;
                        padding: 1px 6px;
                        border-radius: 4px;
                        background: rgba(255, 255, 255, 0.12);
                        color: #ffffff;
                        border: 1px solid rgba(255, 255, 255, 0.24);
                        margin-left: 4px;
                    }
                    .dpc-header-controls {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        flex-shrink: 0;
                    }
                    .dpc-lang-switch {
                        display: flex;
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.10);
                        border-radius: 6px;
                        padding: 2px;
                        gap: 2px;
                    }
                    .dpc-lang-btn {
                        background: transparent;
                        border: none;
                        color: #71717a;
                        font-size: 10px;
                        font-weight: 700;
                        padding: 2px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-lang-btn.active {
                        background: #ffffff;
                        color: #09090b;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
                    }
                    .dpc-icon-btn {
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        color: #a1a1aa;
                        cursor: pointer;
                        width: 26px; height: 26px;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-icon-btn:hover {
                        background: rgba(255, 255, 255, 0.12);
                        border-color: rgba(255, 255, 255, 0.25);
                        color: #ffffff;
                        transform: translateY(-1px);
                    }
                    .dpc-icon-btn:active { transform: translateY(1px); }
                    .dpc-icon-btn-close:hover {
                        background: rgba(255, 255, 255, 0.18);
                        border-color: rgba(255, 255, 255, 0.4);
                        color: #ffffff;
                    }
                    .dpc-body {
                        padding: 14px 16px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        max-height: calc(90vh - 60px);
                    }
                    .dpc-status-card {
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 10px;
                        padding: 9px 12px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .dpc-status-left {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .dpc-beacon-wrap {
                        position: relative;
                        width: 10px; height: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .dpc-status-dot {
                        width: 8px; height: 8px;
                        border-radius: 50%;
                        background: #ffffff;
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                        transition: background 0.3s ease, box-shadow 0.3s ease;
                        position: relative;
                        z-index: 2;
                    }
                    .dpc-beacon-wave {
                        position: absolute;
                        width: 20px; height: 20px;
                        border-radius: 50%;
                        border: 1.5px solid rgba(255, 255, 255, 0.65);
                        opacity: 0.6;
                        animation: dpcBeaconWave 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
                        pointer-events: none;
                        z-index: 1;
                    }
                    .dpc-status-text {
                        font-size: 12px;
                        font-weight: 600;
                        color: #ffffff;
                    }
                    .dpc-btn-locate {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.14);
                        color: #ffffff;
                        padding: 5px 11px;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-btn-locate:hover {
                        background: rgba(255, 255, 255, 0.12);
                        color: #ffffff;
                        border-color: rgba(255, 255, 255, 0.3);
                        transform: translateY(-1px);
                    }
                    .dpc-btn-locate:active { transform: translateY(1px); }
                    .dpc-stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 6px;
                    }
                    .dpc-stat-card {
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 8px;
                        padding: 8px 6px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-stat-card:hover {
                        background: rgba(255, 255, 255, 0.07);
                        border-color: rgba(255, 255, 255, 0.22);
                        transform: translateY(-2px);
                    }
                    .dpc-stat-num {
                        font-size: 17px;
                        font-weight: 700;
                        font-variant-numeric: tabular-nums;
                        margin-bottom: 2px;
                        line-height: 1.1;
                    }
                    .dpc-stat-num.pop {
                        animation: dpcStatPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-stat-label {
                        font-size: 9px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                        color: #71717a;
                    }
                    .num-free { color: #ffffff; font-weight: 800; text-shadow: 0 0 12px rgba(255, 255, 255, 0.4); }
                    .num-taken { color: #52525b; }
                    .num-invalid { color: #71717a; }
                    .num-rate { color: #a1a1aa; }
                    .dpc-input-wrap {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    }
                    .dpc-toolbar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 11px;
                        color: #71717a;
                    }
                    .dpc-tools-group {
                        display: flex;
                        gap: 4px;
                    }
                    .dpc-tool-btn {
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        color: #a1a1aa;
                        padding: 3px 8px;
                        border-radius: 5px;
                        font-size: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-tool-btn:hover {
                        background: rgba(255, 255, 255, 0.10);
                        color: #ffffff;
                        border-color: rgba(255, 255, 255, 0.22);
                        transform: translateY(-1px);
                    }
                    .dpc-tool-btn:active { transform: translateY(1px); }
                    .dpc-textarea {
                        width: 100%;
                        height: 85px;
                        background: rgba(6, 6, 8, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.10);
                        border-radius: 8px;
                        color: #f4f4f5;
                        padding: 8px 10px;
                        font-family: 'Consolas', 'Fira Code', monospace;
                        font-size: 12px;
                        line-height: 1.5;
                        resize: vertical;
                        outline: none;
                        transition: border-color 0.2s ease, box-shadow 0.2s ease;
                        user-select: text !important;
                        -webkit-user-select: text !important;
                        cursor: text !important;
                        pointer-events: auto !important;
                    }
                    .dpc-textarea:focus {
                        border-color: rgba(255, 255, 255, 0.45);
                        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.12);
                    }
                    .dpc-progress-box {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }
                    .dpc-prog-labels {
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                        font-weight: 600;
                        color: #71717a;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                    }
                    .dpc-progress-track {
                        height: 5px;
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 3px;
                        overflow: hidden;
                        position: relative;
                    }
                    .dpc-progress-bar {
                        height: 100%;
                        width: 0%;
                        background: #ffffff;
                        border-radius: 3px;
                        transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                        position: relative;
                        overflow: hidden;
                    }
                    .dpc-progress-bar::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.35), transparent);
                        background-size: 200% 100%;
                        animation: dpcShimmer 2s infinite linear;
                    }
                    .dpc-actions-row {
                        display: flex;
                        gap: 8px;
                    }
                    .dpc-btn-primary {
                        flex: 1;
                        padding: 10px 14px;
                        background: #ffffff;
                        border: 1px solid #ffffff;
                        border-radius: 8px;
                        color: #09090b;
                        font-size: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        transition: background 0.15s ease, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease;
                        box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.4);
                    }
                    .dpc-btn-primary:hover {
                        background: #e4e4e7;
                        border-color: #e4e4e7;
                        transform: translateY(-1.5px);
                        box-shadow: 0 4px 18px rgba(255, 255, 255, 0.3);
                    }
                    .dpc-btn-primary:active {
                        background: #d4d4d8;
                        transform: translateY(1px);
                    }
                    .dpc-btn-stop {
                        flex: 1;
                        padding: 10px 14px;
                        background: rgba(24, 24, 27, 0.95);
                        border: 1px solid rgba(255, 255, 255, 0.28);
                        border-radius: 8px;
                        color: #ffffff;
                        font-size: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        transition: background 0.15s ease, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s ease;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
                    }
                    .dpc-btn-stop:hover {
                        background: rgba(39, 39, 42, 1);
                        border-color: rgba(255, 255, 255, 0.45);
                        transform: translateY(-1.5px);
                    }
                    .dpc-btn-stop:active { transform: translateY(1px); }
                    .dpc-filter-bar {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .dpc-filter-chips {
                        display: flex;
                        gap: 4px;
                    }
                    .dpc-chip {
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        color: #71717a;
                        padding: 3px 8px;
                        border-radius: 5px;
                        font-size: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-chip:hover {
                        background: rgba(255, 255, 255, 0.09);
                        color: #ffffff;
                        transform: translateY(-1px);
                    }
                    .dpc-chip.active {
                        background: #ffffff;
                        border-color: #ffffff;
                        color: #09090b;
                        font-weight: 700;
                        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
                    }
                    .dpc-log-box {
                        background: rgba(6, 6, 8, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.09);
                        border-radius: 8px;
                        height: 120px;
                        overflow-y: auto;
                        padding: 6px 8px;
                        font-family: 'Consolas', 'Fira Code', monospace;
                        font-size: 11px;
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }
                    .dpc-log-row {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 3px 6px;
                        border-radius: 4px;
                        animation: dpcRowSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    .dpc-log-row:hover {
                        background: rgba(255, 255, 255, 0.06);
                    }
                    .dpc-tag {
                        font-size: 9px;
                        font-weight: 700;
                        letter-spacing: 0.03em;
                        padding: 1px 5px;
                        border-radius: 3px;
                    }
                    .tag-FREE { background: #ffffff; color: #09090b; font-weight: 700; border: 1px solid #ffffff; box-shadow: 0 0 6px rgba(255, 255, 255, 0.4); }
                    .tag-TAKEN { background: rgba(255, 255, 255, 0.04); color: #71717a; border: 1px solid rgba(255, 255, 255, 0.08); }
                    .tag-INVALID { background: rgba(255, 255, 255, 0.08); color: #a1a1aa; border: 1px solid rgba(255, 255, 255, 0.14); }
                    .tag-RATE_LIMIT { background: rgba(255, 255, 255, 0.14); color: #e4e4e7; border: 1px solid rgba(255, 255, 255, 0.24); }
                    .tag-INFO { background: rgba(255, 255, 255, 0.05); color: #71717a; border: 1px solid rgba(255, 255, 255, 0.08); }
                    .tag-ERROR { background: rgba(255, 255, 255, 0.12); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.22); }
                    .dpc-footer-row {
                        display: flex;
                        gap: 8px;
                    }
                    .dpc-btn-secondary {
                        flex: 1;
                        padding: 9px 12px;
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.10);
                        border-radius: 6px;
                        color: #d4d4d8;
                        font-size: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .dpc-btn-secondary:hover {
                        background: rgba(255, 255, 255, 0.08);
                        color: #ffffff;
                        border-color: rgba(255, 255, 255, 0.22);
                        transform: translateY(-1.5px);
                    }
                    .dpc-btn-secondary:active { transform: translateY(1px); }
                    .dpc-btn-accent {
                        flex: 1.5;
                        padding: 9px 12px;
                        background: rgba(255, 255, 255, 0.12);
                        border: 1px solid rgba(255, 255, 255, 0.24);
                        border-radius: 6px;
                        color: #ffffff;
                        font-size: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        transition: background 0.15s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s ease;
                    }
                    .dpc-btn-accent:hover {
                        background: rgba(255, 255, 255, 0.20);
                        border-color: rgba(255, 255, 255, 0.38);
                        transform: translateY(-1.5px);
                        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
                    }
                    .dpc-btn-accent:active { transform: translateY(1px); }
                    .dpc-toast {
                        position: absolute;
                        top: 54px;
                        left: 50%;
                        transform: translateX(-50%) translateY(-12px);
                        background: #09090b;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: #ffffff;
                        padding: 7px 16px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 600;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
                        opacity: 0;
                        pointer-events: none;
                        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                        z-index: 100;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .dpc-toast.show {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                `;
                document.head.appendChild(style);
                this.element = style;
            },

            remove() {
                if (this.element) {
                    this.element.remove();
                    this.element = null;
                }
            }
        },

        Template: {
            buildHtml() {
                return `
                    <canvas class="dpc-dot-canvas" id="dpc-dot-canvas"></canvas>
                    <div class="dpc-radial-bg"></div>
                    <div class="dpc-toast" id="dpc-toast">
                        <span id="dpc-toast-icon">${ASSETS.check}</span>
                        <span id="dpc-toast-msg"></span>
                    </div>
                    <div class="dpc-inner">
                        <!-- Header -->
                        <div class="dpc-header" id="dpc-drag-handle">
                            <div class="dpc-brand">
                                <canvas class="dpc-canvas-prism" id="dpc-prism-canvas" width="68" height="68"></canvas>
                                <div class="dpc-brand-info">
                                    <div class="dpc-brand-title">
                                        <span id="dpc-txt-title">Username Checker</span>
                                        <span class="dpc-mini-counter" id="dpc-mini-counter">0 free</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dpc-header-controls">
                                <div class="dpc-lang-switch">
                                    <button class="dpc-lang-btn active" id="dpc-lang-ru">RU</button>
                                    <button class="dpc-lang-btn" id="dpc-lang-en">EN</button>
                                </div>
                                <button class="dpc-icon-btn" id="dpc-btn-min" title="Свернуть">${ASSETS.min}</button>
                                <button class="dpc-icon-btn dpc-icon-btn-close" id="dpc-btn-close" title="Закрыть">${ASSETS.close}</button>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="dpc-body" id="dpc-body">
                            <!-- Status Card -->
                            <div class="dpc-status-card">
                                <div class="dpc-status-left">
                                    <div class="dpc-beacon-wrap">
                                        <div class="dpc-beacon-wave" id="dpc-beacon-wave"></div>
                                        <div class="dpc-status-dot" id="dpc-status-dot"></div>
                                    </div>
                                    <span class="dpc-status-text" id="dpc-status-text">Готов к проверке</span>
                                </div>
                                <button class="dpc-btn-locate" id="dpc-btn-find-field">
                                    <span>${ASSETS.search}</span>
                                    <span id="dpc-txt-locate">Найти поле ввода</span>
                                </button>
                            </div>

                            <!-- Stats Grid -->
                            <div class="dpc-stats-grid">
                                <div class="dpc-stat-card" id="dpc-card-free">
                                    <div class="dpc-stat-num num-free" id="dpc-stat-free">0</div>
                                    <div class="dpc-stat-label" id="dpc-txt-stat-free">Свободно</div>
                                </div>
                                <div class="dpc-stat-card" id="dpc-card-taken">
                                    <div class="dpc-stat-num num-taken" id="dpc-stat-taken">0</div>
                                    <div class="dpc-stat-label" id="dpc-txt-stat-taken">Занято</div>
                                </div>
                                <div class="dpc-stat-card" id="dpc-card-invalid">
                                    <div class="dpc-stat-num num-invalid" id="dpc-stat-invalid">0</div>
                                    <div class="dpc-stat-label" id="dpc-txt-stat-invalid">Ошибки</div>
                                </div>
                                <div class="dpc-stat-card" id="dpc-card-rate">
                                    <div class="dpc-stat-num num-rate" id="dpc-stat-rate">0</div>
                                    <div class="dpc-stat-label" id="dpc-txt-stat-rate">Лимит</div>
                                </div>
                            </div>

                            <!-- Input & Toolbar -->
                            <div class="dpc-input-wrap">
                                <div class="dpc-toolbar">
                                    <span id="dpc-txt-input-label">Список имён:</span>
                                    <div class="dpc-tools-group">
                                        <button class="dpc-tool-btn" id="dpc-tool-clean">${ASSETS.clean} <span id="dpc-txt-tool-clean">Без @</span></button>
                                        <button class="dpc-tool-btn" id="dpc-tool-dedup">${ASSETS.dedup} <span id="dpc-txt-tool-dedup">Без дублей</span></button>
                                        <button class="dpc-tool-btn" id="dpc-tool-clear">${ASSETS.clear} <span id="dpc-txt-tool-clear">Очистить</span></button>
                                        <span id="dpc-count-badge" style="margin-left: 4px; font-weight: 600; color: #71717a;">0 строк</span>
                                    </div>
                                </div>
                                <textarea class="dpc-textarea" id="dpc-input" placeholder=""></textarea>
                            </div>

                            <!-- Progress Track -->
                            <div class="dpc-progress-box">
                                <div class="dpc-prog-labels">
                                    <span id="dpc-txt-prog-label">Прогресс</span>
                                    <span id="dpc-prog-pct">0%</span>
                                </div>
                                <div class="dpc-progress-track">
                                    <div class="dpc-progress-bar" id="dpc-progress"></div>
                                </div>
                            </div>

                            <!-- Action Row -->
                            <div class="dpc-actions-row">
                                <button class="dpc-btn-primary" id="dpc-btn-start">
                                    <span>${ASSETS.play}</span>
                                    <span id="dpc-txt-btn-start">Начать проверку</span>
                                </button>
                                <button class="dpc-btn-stop" id="dpc-btn-stop" style="display: none;">
                                    <span>${ASSETS.stop}</span>
                                    <span id="dpc-txt-btn-stop">Остановить</span>
                                </button>
                            </div>

                            <!-- Log Stream & Filters -->
                            <div class="dpc-filter-bar">
                                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;" id="dpc-txt-log-header">ЖУРНАЛ СОБЫТИЙ</span>
                                <div class="dpc-filter-chips">
                                    <button class="dpc-chip active" data-filter="ALL" id="dpc-filter-all">Все</button>
                                    <button class="dpc-chip" data-filter="FREE" id="dpc-filter-free">Свободные</button>
                                    <button class="dpc-chip" data-filter="TAKEN" id="dpc-filter-taken">Занятые</button>
                                    <button class="dpc-chip" data-filter="INVALID" id="dpc-filter-invalid">Ошибки</button>
                                </div>
                            </div>

                            <div class="dpc-log-box" id="dpc-logs">
                                <div style="color: #52525b; text-align: center; margin-top: 45px;" id="dpc-log-placeholder">
                                    Нажмите «Начать проверку» для запуска
                                </div>
                            </div>

                            <!-- Footer Exports -->
                            <div class="dpc-footer-row">
                                <button class="dpc-btn-accent" id="dpc-btn-copy-free">
                                    <span>${ASSETS.copy}</span>
                                    <span id="dpc-txt-copy-free">Скопировать свободные</span>
                                </button>
                                <button class="dpc-btn-secondary" id="dpc-btn-download">
                                    <span>${ASSETS.download}</span>
                                    <span id="dpc-txt-download">Скачать free.txt</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        },

        WindowManager: {
            panel: null,
            handle: null,
            isDown: false,
            startX: 0,
            startY: 0,
            initLeft: 0,
            initTop: 0,

            init(panel, handle) {
                this.panel = panel;
                this.handle = handle;

                this.onMouseDown = this.onMouseDown.bind(this);
                this.onMouseMove = this.onMouseMove.bind(this);
                this.onMouseUp = this.onMouseUp.bind(this);

                this.handle.addEventListener('mousedown', this.onMouseDown);
                window.addEventListener('mousemove', this.onMouseMove);
                window.addEventListener('mouseup', this.onMouseUp);
            },

            onMouseDown(e) {
                if (e.target.closest('.dpc-header-controls') || e.target.closest('.dpc-canvas-prism')) return;
                this.isDown = true;
                this.panel.dataset.dragging = 'true';
                this.startX = e.clientX;
                this.startY = e.clientY;
                const rect = this.panel.getBoundingClientRect();
                this.initLeft = rect.left;
                this.initTop = rect.top;
                this.panel.style.right = 'auto';
                this.panel.style.bottom = 'auto';
                this.panel.style.left = `${this.initLeft}px`;
                this.panel.style.top = `${this.initTop}px`;
                e.preventDefault();
            },

            onMouseMove(e) {
                if (!this.isDown) return;
                const dx = e.clientX - this.startX;
                const dy = e.clientY - this.startY;
                const curWidth = this.panel.offsetWidth || 300;
                const curHeight = this.panel.offsetHeight || 50;
                const maxL = Math.max(10, window.innerWidth - curWidth - 10);
                const maxT = Math.max(10, window.innerHeight - curHeight - 10);
                this.panel.style.left = `${Math.max(10, Math.min(maxL, this.initLeft + dx))}px`;
                this.panel.style.top = `${Math.max(10, Math.min(maxT, this.initTop + dy))}px`;
            },

            onMouseUp() {
                if (this.isDown) {
                    this.isDown = false;
                    this.panel.dataset.dragging = 'false';
                }
            },

            toggleMinimize() {
                STATE.isMinimized = !STATE.isMinimized;
                const btnMin = this.panel.querySelector('#dpc-btn-min');
                if (STATE.isMinimized) {
                    this.panel.classList.add('dpc-minimized');
                    if (btnMin) {
                        btnMin.innerHTML = ASSETS.expand;
                        btnMin.title = t('btnExpand');
                    }
                } else {
                    this.panel.classList.remove('dpc-minimized');
                    if (btnMin) {
                        btnMin.innerHTML = ASSETS.min;
                        btnMin.title = t('btnMin');
                    }
                }
            },

            destroy() {
                if (this.handle) this.handle.removeEventListener('mousedown', this.onMouseDown);
                window.removeEventListener('mousemove', this.onMouseMove);
                window.removeEventListener('mouseup', this.onMouseUp);
            }
        },

        View: {
            panel: null,
            dom: {},

            bind(panel) {
                this.panel = panel;
                this.dom = {
                    textarea: panel.querySelector('#dpc-input'),
                    countBadge: panel.querySelector('#dpc-count-badge'),
                    btnStart: panel.querySelector('#dpc-btn-start'),
                    btnStop: panel.querySelector('#dpc-btn-stop'),
                    btnCopyFree: panel.querySelector('#dpc-btn-copy-free'),
                    btnDownload: panel.querySelector('#dpc-btn-download'),
                    btnFindField: panel.querySelector('#dpc-btn-find-field'),
                    progressBar: panel.querySelector('#dpc-progress'),
                    progPct: panel.querySelector('#dpc-prog-pct'),
                    statFree: panel.querySelector('#dpc-stat-free'),
                    statTaken: panel.querySelector('#dpc-stat-taken'),
                    statInvalid: panel.querySelector('#dpc-stat-invalid'),
                    statRate: panel.querySelector('#dpc-stat-rate'),
                    logsBox: panel.querySelector('#dpc-logs'),
                    statusText: panel.querySelector('#dpc-status-text'),
                    statusDot: panel.querySelector('#dpc-status-dot'),
                    beaconWave: panel.querySelector('#dpc-beacon-wave'),
                    miniCounter: panel.querySelector('#dpc-mini-counter'),
                    toast: panel.querySelector('#dpc-toast'),
                    toastMsg: panel.querySelector('#dpc-toast-msg'),
                    langBtnRu: panel.querySelector('#dpc-lang-ru'),
                    langBtnEn: panel.querySelector('#dpc-lang-en'),
                };

                // Prevent Discord hotkeys inside textarea
                const ta = this.dom.textarea;
                ['keydown', 'keyup', 'keypress', 'contextmenu'].forEach(evt => {
                    ta.addEventListener(evt, e => e.stopPropagation());
                });

                ta.addEventListener('input', () => this.updateCountBadge());
            },

            updateLanguage() {
                const p = this.panel;
                if (!p) return;

                const setTxt = (sel, val) => {
                    const el = p.querySelector(sel);
                    if (el) el.textContent = val;
                };

                setTxt('#dpc-txt-title', t('brandTitle'));
                setTxt('#dpc-txt-locate', t('locateBtn'));
                setTxt('#dpc-txt-stat-free', t('statFree'));
                setTxt('#dpc-txt-stat-taken', t('statTaken'));
                setTxt('#dpc-txt-stat-invalid', t('statInvalid'));
                setTxt('#dpc-txt-stat-rate', t('statRate'));
                setTxt('#dpc-txt-input-label', t('inputLabel'));
                setTxt('#dpc-txt-tool-clean', t('toolClean'));
                setTxt('#dpc-txt-tool-dedup', t('toolDedup'));
                setTxt('#dpc-txt-tool-clear', t('toolClear'));
                setTxt('#dpc-txt-prog-label', t('progressLabel'));
                setTxt('#dpc-txt-btn-start', t('btnStart'));
                setTxt('#dpc-txt-btn-stop', t('btnStop'));
                setTxt('#dpc-txt-log-header', t('logHeader'));
                setTxt('#dpc-filter-all', t('filterAll'));
                setTxt('#dpc-filter-free', t('filterFree'));
                setTxt('#dpc-filter-taken', t('filterTaken'));
                setTxt('#dpc-filter-invalid', t('filterInvalid'));
                setTxt('#dpc-txt-download', t('downloadFree'));

                if (this.dom.textarea) {
                    this.dom.textarea.placeholder = t('inputPlaceholder');
                }

                const count = STATE.freeList.length;
                setTxt('#dpc-txt-copy-free', count > 0 ? t('copyFreeCount', { count }) : t('copyFree'));
                if (this.dom.miniCounter) {
                    this.dom.miniCounter.textContent = t('miniFreeText', { count });
                }

                const btnMin = p.querySelector('#dpc-btn-min');
                if (btnMin) btnMin.title = STATE.isMinimized ? t('btnExpand') : t('btnMin');

                const btnClose = p.querySelector('#dpc-btn-close');
                if (btnClose) btnClose.title = t('btnClose');

                const placeholder = p.querySelector('#dpc-log-placeholder');
                if (placeholder) placeholder.textContent = t('logEmpty');

                if (!STATE.isRunning) {
                    if (STATE.stats.total === 0) {
                        this.dom.statusText.textContent = t('statusReady');
                    } else if (STATE.stats.total > 0 && STATE.currentIndex >= STATE.usernames.length) {
                        this.dom.statusText.textContent = t('statusDone', { count: STATE.freeList.length });
                    }
                }

                this.updateCountBadge();
            },

            updateCountBadge() {
                if (!this.dom.textarea || !this.dom.countBadge) return;
                const lines = this.dom.textarea.value.split('\n')
                    .map(Utils.sanitizeUsername)
                    .filter(Boolean);
                this.dom.countBadge.textContent = t('linesCount', { count: lines.length });
            },

            bumpStat(el, val) {
                if (!el) return;
                el.textContent = String(val);
                el.classList.remove('pop');
                void el.offsetWidth;
                el.classList.add('pop');
            },

            showToast(message) {
                if (!this.dom.toast || !this.dom.toastMsg) return;
                this.dom.toastMsg.textContent = message;
                this.dom.toast.classList.add('show');
                if (STATE.toastTimer) clearTimeout(STATE.toastTimer);
                STATE.toastTimer = setTimeout(() => {
                    if (this.dom.toast) this.dom.toast.classList.remove('show');
                }, 2200);
            },

            addLog(text, tag = 'INFO', elapsed = '') {
                const logsBox = this.dom.logsBox;
                if (!logsBox) return;

                const placeholder = logsBox.querySelector('#dpc-log-placeholder');
                if (placeholder) placeholder.remove();

                const row = document.createElement('div');
                row.className = 'dpc-log-row';
                row.dataset.tag = tag;
                row.innerHTML = `
                    <span>${text}</span>
                    <span style="display: flex; align-items: center; gap: 6px;">
                        ${elapsed ? `<span style="color: #71717a; font-size: 10px;">${elapsed}s</span>` : ''}
                        <span class="dpc-tag tag-${tag}">${tag}</span>
                    </span>
                `;
                logsBox.appendChild(row);

                if (STATE.filter !== 'ALL' && tag !== STATE.filter) {
                    row.style.display = 'none';
                }

                logsBox.scrollTop = logsBox.scrollHeight;
            },

            applyFilter(tag) {
                STATE.filter = tag;
                const rows = this.dom.logsBox.querySelectorAll('.dpc-log-row');
                rows.forEach(r => {
                    if (STATE.filter === 'ALL' || r.dataset.tag === STATE.filter) {
                        r.style.display = 'flex';
                    } else {
                        r.style.display = 'none';
                    }
                });
            }
        }
    };

    // =========================================================================
    // 9. VERIFICATION CONTROLLER
    // =========================================================================

    const Controller = {
        initEventListeners() {
            const d = UI.View.dom;
            const p = UI.View.panel;

            // Language Toggles
            d.langBtnRu.addEventListener('click', (e) => {
                e.stopPropagation();
                STATE.lang = 'ru';
                d.langBtnRu.classList.add('active');
                d.langBtnEn.classList.remove('active');
                UI.View.updateLanguage();
            });

            d.langBtnEn.addEventListener('click', (e) => {
                e.stopPropagation();
                STATE.lang = 'en';
                d.langBtnEn.classList.add('active');
                d.langBtnRu.classList.remove('active');
                UI.View.updateLanguage();
            });

            // Clean Tool
            p.querySelector('#dpc-tool-clean').addEventListener('click', (e) => {
                e.stopPropagation();
                const cleaned = d.textarea.value
                    .split('\n')
                    .map(Utils.sanitizeUsername)
                    .filter(Boolean)
                    .join('\n');
                d.textarea.value = cleaned;
                UI.View.updateCountBadge();
                UI.View.showToast(t('toastCleaned'));
            });

            // Dedup Tool
            p.querySelector('#dpc-tool-dedup').addEventListener('click', (e) => {
                e.stopPropagation();
                const unique = Utils.parseUsernames(d.textarea.value);
                d.textarea.value = unique.join('\n');
                UI.View.updateCountBadge();
                UI.View.showToast(t('toastDeduped', { count: unique.length }));
            });

            // Clear Tool
            p.querySelector('#dpc-tool-clear').addEventListener('click', (e) => {
                e.stopPropagation();
                d.textarea.value = '';
                UI.View.updateCountBadge();
            });

            // Filter Chips
            p.querySelectorAll('.dpc-chip').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    e.stopPropagation();
                    p.querySelectorAll('.dpc-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    UI.View.applyFilter(chip.getAttribute('data-filter'));
                });
            });

            // Locate Modal Helper
            d.btnFindField.addEventListener('click', async (e) => {
                e.stopPropagation();
                const locateTxt = p.querySelector('#dpc-txt-locate');
                if (locateTxt) locateTxt.textContent = t('locateSearching');
                d.statusText.textContent = t('locateSearching');
                d.statusDot.style.background = '#ffffff';
                d.beaconWave.style.borderColor = 'rgba(255, 255, 255, 0.7)';

                const input = await DiscordBridge.openUsernameEditModal();
                if (input) {
                    if (locateTxt) locateTxt.textContent = t('locateFound');
                    d.statusText.textContent = t('locateFound');
                    d.statusDot.style.background = '#ffffff';
                    d.beaconWave.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                    UI.View.addLog(t('locateFound'), 'INFO');
                    UI.View.showToast(t('locateFound'));
                } else {
                    if (locateTxt) locateTxt.textContent = t('locateNotFound');
                    d.statusText.textContent = t('locateNotFound');
                    d.statusDot.style.background = '#71717a';
                    d.beaconWave.style.borderColor = 'rgba(113, 113, 122, 0.5)';
                    UI.View.addLog(t('locateNotFound'), 'ERROR');
                }
                setTimeout(() => {
                    if (locateTxt) locateTxt.textContent = t('locateBtn');
                }, 2500);
            });

            // Start & Stop
            d.btnStart.addEventListener('click', (e) => {
                e.stopPropagation();
                Controller.start();
            });

            d.btnStop.addEventListener('click', (e) => {
                e.stopPropagation();
                Controller.stop();
            });

            // Copy to Clipboard
            d.btnCopyFree.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (STATE.freeList.length === 0) {
                    UI.View.showToast(t('toastNoFree'));
                    return;
                }
                await Utils.copyToClipboard(STATE.freeList.join('\n'));
                UI.View.showToast(t('toastCopied'));
            });

            // Download File
            d.btnDownload.addEventListener('click', (e) => {
                e.stopPropagation();
                if (STATE.freeList.length === 0) {
                    UI.View.showToast(t('toastNoFree'));
                    return;
                }
                Utils.downloadTextFile('free.txt', STATE.freeList.join('\n') + '\n');
                UI.View.showToast(t('toastDownloaded'));
            });

            // Window Header Actions
            p.querySelector('#dpc-btn-close').addEventListener('click', (e) => {
                e.stopPropagation();
                App.destroy();
            });

            p.querySelector('#dpc-btn-min').addEventListener('click', (e) => {
                e.stopPropagation();
                UI.WindowManager.toggleMinimize();
            });

            p.querySelector('#dpc-drag-handle').addEventListener('dblclick', (e) => {
                if (e.target.closest('.dpc-header-controls') || e.target.closest('.dpc-canvas-prism')) return;
                UI.WindowManager.toggleMinimize();
            });
        },

        async start() {
            const d = UI.View.dom;
            const p = UI.View.panel;
            const usernames = Utils.parseUsernames(d.textarea.value);

            if (usernames.length === 0) {
                UI.View.showToast(t('toastEmpty'));
                return;
            }

            STATE.isRunning = true;
            STATE.gemState = 'running';
            STATE.usernames = usernames;
            STATE.freeList = [];
            STATE.currentIndex = 0;
            STATE.stats = { total: usernames.length, free: 0, taken: 0, invalid: 0, rateLimit: 0, error: 0 };

            UI.View.bumpStat(d.statFree, 0);
            UI.View.bumpStat(d.statTaken, 0);
            UI.View.bumpStat(d.statInvalid, 0);
            UI.View.bumpStat(d.statRate, 0);
            d.progressBar.style.width = '0%';
            d.progPct.textContent = '0%';
            d.logsBox.innerHTML = '';

            const copyEl = p.querySelector('#dpc-txt-copy-free');
            if (copyEl) copyEl.textContent = t('copyFree');
            if (d.miniCounter) d.miniCounter.textContent = t('miniFreeText', { count: 0 });

            d.btnStart.style.display = 'none';
            d.btnStop.style.display = 'flex';
            d.statusDot.style.background = '#ffffff';
            d.beaconWave.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            d.statusText.textContent = `${t('statusChecking')} 0/${usernames.length}`;

            UI.View.addLog(t('logStarted', { count: usernames.length }), 'INFO');

            const domInput = await DiscordBridge.openUsernameEditModal();
            if (!domInput) {
                UI.View.addLog(t('logErrorField'), 'ERROR');
                d.statusText.textContent = t('locateNotFound');
                d.statusDot.style.background = '#71717a';
                d.beaconWave.style.borderColor = 'rgba(113, 113, 122, 0.5)';
                this.stop();
                return;
            }

            let completedAll = true;

            for (let i = 0; i < usernames.length; i++) {
                if (!STATE.isRunning) {
                    completedAll = false;
                    break;
                }

                STATE.currentIndex = i;
                const username = usernames[i];
                const progressPct = Math.round(((i + 1) / usernames.length) * 100);
                d.progressBar.style.width = `${progressPct}%`;
                d.progPct.textContent = `${progressPct}%`;
                d.statusText.textContent = `@${username}`;

                // Fast client-side format pre-check
                if (!CONFIG.USERNAME_REGEX.test(username) || username.includes('..')) {
                    STATE.stats.invalid++;
                    UI.View.bumpStat(d.statInvalid, STATE.stats.invalid);
                    UI.View.addLog(`@${username}`, 'INVALID', '0.00');
                    continue;
                }

                const result = await DiscordBridge.evaluateStatus(username, domInput);
                if (!STATE.isRunning) {
                    completedAll = false;
                    break;
                }

                if (result.status === 'RATE_LIMIT') {
                    STATE.stats.rateLimit++;
                    UI.View.bumpStat(d.statRate, STATE.stats.rateLimit);
                    const waitSec = result.retryAfter || CONFIG.RATE_LIMIT_PAUSE_SEC;
                    d.statusText.textContent = t('statusRateLimit', { s: waitSec });
                    d.statusDot.style.background = '#d4d4d8';
                    d.beaconWave.style.borderColor = 'rgba(212, 212, 216, 0.6)';
                    UI.View.addLog(`@${username} (${t('logRateWait', { s: waitSec })})`, 'RATE_LIMIT', result.elapsed);
                    await Utils.cancellableSleep(waitSec * 1000 + 400);
                    if (!STATE.isRunning) {
                        completedAll = false;
                        break;
                    }
                    i--;
                    continue;
                }

                if (result.status === 'FREE') {
                    STATE.stats.free++;
                    UI.View.bumpStat(d.statFree, STATE.stats.free);
                    STATE.freeList.push(username);
                    const copyFreeEl = p.querySelector('#dpc-txt-copy-free');
                    if (copyFreeEl) copyFreeEl.textContent = t('copyFreeCount', { count: STATE.freeList.length });
                    if (d.miniCounter) d.miniCounter.textContent = t('miniFreeText', { count: STATE.freeList.length });
                    STATE.gemState = 'free';
                    setTimeout(() => { if (STATE.isRunning) STATE.gemState = 'running'; }, 1000);
                    d.statusDot.style.background = '#ffffff';
                    d.beaconWave.style.borderColor = '#ffffff';
                    UI.View.addLog(`@${username}`, 'FREE', result.elapsed);
                } else if (result.status === 'TAKEN') {
                    STATE.stats.taken++;
                    UI.View.bumpStat(d.statTaken, STATE.stats.taken);
                    d.statusDot.style.background = '#71717a';
                    d.beaconWave.style.borderColor = 'rgba(113, 113, 122, 0.4)';
                    UI.View.addLog(`@${username}`, 'TAKEN', result.elapsed);
                } else if (result.status === 'INVALID') {
                    STATE.stats.invalid++;
                    UI.View.bumpStat(d.statInvalid, STATE.stats.invalid);
                    d.statusDot.style.background = '#a1a1aa';
                    d.beaconWave.style.borderColor = 'rgba(161, 161, 170, 0.5)';
                    UI.View.addLog(`@${username}`, 'INVALID', result.elapsed);
                } else {
                    STATE.stats.error++;
                    UI.View.addLog(`@${username} (${result.detail})`, 'ERROR', result.elapsed);
                }

                await Utils.cancellableSleep(CONFIG.SPEED_DELAY);
            }

            STATE.isRunning = false;
            STATE.gemState = 'idle';
            d.btnStart.style.display = 'flex';
            d.btnStop.style.display = 'none';

            if (completedAll) {
                d.progressBar.style.width = '100%';
                d.progPct.textContent = '100%';
                d.statusText.textContent = t('statusDone', { count: STATE.freeList.length });
                d.statusDot.style.background = '#ffffff';
                d.beaconWave.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                UI.View.showToast(t('statusDone', { count: STATE.freeList.length }));
                UI.View.addLog(t('logFinished', { free: STATE.freeList.length, total: usernames.length }), 'INFO');
            } else {
                d.statusText.textContent = t('statusStopped');
                d.statusDot.style.background = '#71717a';
                d.beaconWave.style.borderColor = 'rgba(113, 113, 122, 0.4)';
            }
        },

        stop() {
            STATE.isRunning = false;
            STATE.gemState = 'idle';
            const d = UI.View.dom;
            if (d.btnStart) d.btnStart.style.display = 'flex';
            if (d.btnStop) d.btnStop.style.display = 'none';
            if (d.statusText) d.statusText.textContent = t('statusStopped');
            if (d.statusDot) d.statusDot.style.background = '#71717a';
            if (d.beaconWave) d.beaconWave.style.borderColor = 'rgba(113, 113, 122, 0.4)';
            UI.View.addLog(t('statusStopped'), 'INFO');
        }
    };

    // =========================================================================
    // 10. APPLICATION LIFECYCLE & INITIALIZATION
    // =========================================================================

    const App = {
        focusInterceptor: null,
        inertObserver: null,

        init() {
            // Remove previous active instances cleanly
            if (typeof window.__DISCORD_CHECKER_CLEANUP__ === 'function') {
                window.__DISCORD_CHECKER_CLEANUP__();
            }

            const existingPanel = document.getElementById(CONFIG.PANEL_ID);
            if (existingPanel) existingPanel.remove();

            // 1. Inject Styles
            UI.Styles.inject();

            // 2. Build DOM Panel
            const panel = document.createElement('div');
            panel.id = CONFIG.PANEL_ID;
            panel.innerHTML = UI.Template.buildHtml();
            document.body.appendChild(panel);

            // 3. Bind UI & Window Manager
            UI.View.bind(panel);
            UI.WindowManager.init(panel, panel.querySelector('#dpc-drag-handle'));

            // 4. Initialize Graphics
            Graphics.DotMatrix.init(panel.querySelector('#dpc-dot-canvas'), panel);
            Graphics.Prism3D.init(panel.querySelector('#dpc-prism-canvas'));
            Graphics.startLoop();

            // 5. Setup Controller Events
            Controller.initEventListeners();

            // 6. Focus Isolation (Stops Discord modal focus interception on panel elements)
            this.focusInterceptor = (e) => {
                if (panel && panel.contains(e.target)) {
                    e.stopImmediatePropagation();
                }
            };
            window.addEventListener('focusin', this.focusInterceptor, true);
            window.addEventListener('focus', this.focusInterceptor, true);

            panel.addEventListener('mousedown', (e) => e.stopPropagation());
            panel.addEventListener('pointerdown', (e) => e.stopPropagation());
            panel.addEventListener('click', (e) => e.stopPropagation());

            // 7. Auto-remove any 'inert' attributes Discord might place on body siblings
            this.inertObserver = new MutationObserver(() => {
                if (panel.hasAttribute('inert')) panel.removeAttribute('inert');
                if (panel.getAttribute('aria-hidden') === 'true') panel.removeAttribute('aria-hidden');
            });
            this.inertObserver.observe(panel, { attributes: true, attributeFilter: ['inert', 'aria-hidden'] });

            // 8. Initial Language Sync
            UI.View.updateLanguage();

            // 9. Register global teardown
            window.__DISCORD_CHECKER_CLEANUP__ = () => App.destroy();
            panel.__cleanup = () => App.destroy();

            console.log(
                '%c[Discord Checker]%c Architectural Monochrome In-Client UI loaded.',
                'color: #ffffff; font-weight: 700;',
                'color: #a1a1aa;'
            );
        },

        destroy() {
            Controller.stop();
            Graphics.stopLoop();
            Graphics.DotMatrix.destroy();
            UI.WindowManager.destroy();

            if (this.focusInterceptor) {
                window.removeEventListener('focusin', this.focusInterceptor, true);
                window.removeEventListener('focus', this.focusInterceptor, true);
            }

            if (this.inertObserver) {
                this.inertObserver.disconnect();
                this.inertObserver = null;
            }

            if (STATE.toastTimer) {
                clearTimeout(STATE.toastTimer);
                STATE.toastTimer = null;
            }

            const panel = document.getElementById(CONFIG.PANEL_ID);
            if (panel) panel.remove();

            UI.Styles.remove();
            window.__DISCORD_CHECKER_CLEANUP__ = null;
        }
    };

    // Bootstrap
    App.init();

})();
