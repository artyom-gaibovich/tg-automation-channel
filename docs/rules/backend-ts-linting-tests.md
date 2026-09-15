# Правила линтинга и тестирования (TypeScript)

Нормы контроля качества: конфигурация ESLint с type-aware правилами, уровень строгости `tsconfig`, интеграция с Prettier и настройка тест-раннера Jest. Выведены из `.eslintrc.js`, `tsconfig.json` и `package.json`.

---

## Навигация
- [Таблица правил](#таблица-правил)
- [Принцип](#принцип)
- [Подробное описание](#подробное-описание)
- [Команды](#команды)
- [Исключения и граничные случаи](#исключения-и-граничные-случаи)
- [Версионирование](#версионирование)

---

## Таблица правил
| ID | Правило |
|----|---------|
| QA-001 | Линтер — ESLint с `@typescript-eslint/parser` в type-aware режиме (`parserOptions.project: 'tsconfig.json'`). |
| QA-002 | Базовые наборы: `plugin:@typescript-eslint/recommended` и `plugin:prettier/recommended`. |
| QA-003 | Ошибки промисов запрещены: `no-floating-promises`, `no-misused-promises`, `await-thenable` — уровень `error`. |
| QA-004 | Импорт типов только через `import type` (`consistent-type-imports: error`). |
| QA-005 | Сравнение строгое: `eqeqeq: ['error', 'always']`. |
| QA-006 | `any` допускается лишь как предупреждение (`no-explicit-any: warn`); в код без крайней нужды не попадает. |
| QA-007 | Явные типы возврата и границ модулей не требуются (`explicit-function-return-type`/`explicit-module-boundary-types: off`). |
| QA-008 | Неиспользуемые сущности — предупреждение; имена с префиксом `_` игнорируются. |
| QA-009 | `console.log` запрещён (`no-console: warn`, разрешены только `warn`/`error`); `debugger` — `error`. |
| QA-010 | Компилятор работает со `strictNullChecks: true` (`tsconfig.json`). |
| QA-011 | Тест-раннер — Jest (`ts-jest`); unit-тесты именуются `*.spec.ts` (`testRegex`), e2e — отдельным конфигом `test/jest-e2e.json`. |

---

## Принцип

Качество обеспечивается статически: type-aware ESLint ловит реальные ошибки времени выполнения (незаверешённые промисы, неверные сравнения), а Prettier через `plugin:prettier/recommended` устраняет споры о форматировании. Строгость намеренно сбалансирована — `any` и неиспользуемые переменные лишь предупреждают, чтобы не блокировать итерации, но потенциальные баги (`eqeqeq`, промисы, `debugger`) — жёсткие ошибки. Тестовая инфраструктура (Jest + Supertest) настроена, но покрытие ещё не наполнено.

| Уровень | Что под ним |
|---------|-------------|
| `error` (жёстко) | промисы, `eqeqeq`, `no-debugger` |
| `warn` (мягко) | `no-explicit-any`, `no-unused-vars`, `no-console` |
| `off` (снято) | `explicit-function-return-type`, `interface-name-prefix`, `no-namespace` |

---

## Подробное описание

**[QA-001]** ESLint работает в type-aware режиме — парсер получает проект TypeScript, что включает правила, использующие типовую информацию. См. `.eslintrc.js`:

```js
parser: '@typescript-eslint/parser',
parserOptions: { project: 'tsconfig.json', tsconfigRootDir: __dirname, sourceType: 'module' },
```

**[QA-002]** Конфиг наследует `plugin:@typescript-eslint/recommended` и `plugin:prettier/recommended`. Последний подключает `eslint-plugin-prettier` и отключает конфликтующие стилевые правила через `eslint-config-prettier`, делая Prettier единственным источником форматирования (см. отдельный документ правил Prettier).

**[QA-003]** Небезопасная работа с промисами запрещена на уровне `error`: `@typescript-eslint/no-floating-promises`, `no-misused-promises`, `await-thenable`. Это опирается на type-aware режим (QA-001).

**[QA-004]** `@typescript-eslint/consistent-type-imports: error` требует `import type` для импорта типов — согласовано с правилом TS-стиля.

**[QA-005]** `eqeqeq: ['error', 'always']` запрещает `==`/`!=` — только строгое сравнение.

**[QA-006]** `@typescript-eslint/no-explicit-any: 'warn'` — `any` не ошибка, но подсвечивается; в бизнес-коде вместо него применяется `unknown`/типизация.

**[QA-007]** Явные типы возврата не навязываются: `explicit-function-return-type` и `explicit-module-boundary-types` — `off`; `interface-name-prefix` и `no-namespace` тоже сняты (проект активно использует `namespace` в контрактах).

**[QA-008]** `@typescript-eslint/no-unused-vars: 'warn'` с `argsIgnorePattern: '^_'` и `varsIgnorePattern: '^_'` — намеренно неиспользуемые сущности именуются с префиксом `_`.

**[QA-009]** `no-console: ['warn', { allow: ['warn', 'error'] }]` — `console.log` подсвечивается, для вывода используется логгер из `shared/logger`; `no-debugger: 'error'`.

**[QA-010]** `tsconfig.json` включает `strictNullChecks: true` (при этом `noImplicitAny: false`, `strictBindCallApply: false`) — null-безопасность обязательна, но полный `strict` не включён.

**[QA-011]** Jest сконфигурирован в `package.json`: `rootDir: 'src'`, `testRegex: '.*\\.spec\\.ts$'`, трансформация `ts-jest`, `collectCoverageFrom: ['**/*.(t|j)s']`. E2E-тесты запускаются отдельным конфигом `test/jest-e2e.json` (Supertest в зависимостях).

> **В проекте не обнаружено:** фактических файлов `*.spec.ts`/`*.e2e-spec.ts` в `src/` нет — инфраструктура тестирования настроена, но тесты ещё не написаны. Новые тесты должны следовать `testRegex` (`*.spec.ts`, рядом с тестируемым кодом) и использовать `@nestjs/testing` (`Test.createTestingModule`) для DI-моков.

---

## Команды

```bash
# Линтинг с автофиксом
npm run lint          # eslint "{src,apps,libs,test}/**/*.ts" --fix

# Тесты
npm run test          # jest (unit, *.spec.ts)
npm run test:cov      # jest --coverage
npm run test:e2e      # jest --config ./test/jest-e2e.json
```

---

## Исключения и граничные случаи

| Ситуация | Как поступить |
|----------|---------------|
| Нужен намеренно неиспользуемый параметр | Префикс `_` (`_ctx`) — правило `no-unused-vars` его игнорирует |
| Требуется `any` для стыка с нетипизированной библиотекой | Локально допустимо (уровень `warn`), но предпочтителен `unknown` + сужение |
| Диагностический вывод | `console.warn`/`console.error` разрешены; для остального — логгер `shared/logger` |
| Файл конфигурации самого ESLint | `.eslintrc.js` исключён из линтинга через `ignorePatterns` |

---

## Версионирование
| Версия | Дата | Задача | Агент | Модель | Описание изменений |
|--------|------|--------|-------|--------|--------------------|
| 1.0.0 | 2026-08-05 | TAC-11 | Claude Code | claude-opus-4-8 | Начальное создание |
