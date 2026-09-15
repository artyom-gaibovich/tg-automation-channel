# Команды извлечения правил

Набор процедурных команд, которые изучают исходный код проекта и формируют нормативные документы правил в `docs/rules/`. Каждая команда покрывает одну область и пишет один файл правил.

---

## Навигация

- [Принципы](#принципы)
- [Каталог команд](#каталог-команд)
- [Общий выходной формат](#общий-выходной-формат)
- [Как запускать](#как-запускать)
- [Версионирование](#версионирование)

---

## Принципы

- **Независимость от агента.** Команды — это процедурные инструкции, а не привязанные к конкретному инструменту скрипты. Их может выполнить любой LLM-агент (Claude Code, Cursor, Codex и др.) или разработчик вручную.
- **Источник — только код проекта.** Правила реверсятся из фактического кода и конфигурации, а не из внешних эталонов или из ожиданий.
- **Одна команда — одна область — один файл.** Области не смешиваются; новый раздел знаний — новая команда.
- **Документируется фактическое, а не желаемое.** Непоследовательные практики отмечаются явно; отсутствующие области помечаются как «в проекте не обнаружено».

---

## Каталог команд

| Команда | Область | Выходной файл |
|---------|---------|---------------|
| [extract-architecture-rules.md](./extract-architecture-rules.md) | Архитектура: стиль, слои, зависимости, транзакции, межмодульное взаимодействие | `docs/rules/architecture.md` |
| [extract-go-style-rules.md](./extract-go-style-rules.md) | Go-стиль и написание кода: иммутабельность, именование, ошибки, константы, конфиг | `docs/rules/go-style.md` |
| [extract-lint-test-rules.md](./extract-lint-test-rules.md) | Линтинг и тесты: конфиг линтеров, отключённые правила, стиль тестов, моки, e2e | `docs/rules/linting-tests.md` |
| [extract-docker-infra-rules.md](./extract-docker-infra-rules.md) | Локальная инфраструктура: Dockerfile, docker-compose, Makefile, логирование | `docs/rules/docker-infra.md` |
| [extract-cicd-rules.md](./extract-cicd-rules.md) | CI/CD и оркестрация: GitLab/GitHub CI, Helm, Kubernetes, деплой | `docs/rules/cicd.md` |
| [extract-api-contract-rules.md](./extract-api-contract-rules.md) | API-контракты: OpenAPI/Swagger, protobuf/gRPC, HTTP-конвенции | `docs/rules/api-contracts.md` |
| [extract-config-rules.md](./extract-config-rules.md) | Конфигурация: библиотека, приоритет источников, параметры, переменные окружения | `docs/rules/config.md` |
| [extract-logging-rules.md](./extract-logging-rules.md) | Логирование: библиотека, уровни, формат, контекст, middleware-декоратор | `docs/rules/logging.md` |
| [extract-migration-rules.md](./extract-migration-rules.md) | Миграции БД: инструмент, формат и именование файлов, команды создания и применения | `docs/rules/migrations.md` |
| [extract-ts-style-rules.md](./extract-ts-style-rules.md) | TypeScript-стиль и написание кода: иммутабельность, типизация, именование, асинхронность, DI | `docs/rules/ts-style.md` |
| [extract-ts-architecture-rules.md](./extract-ts-architecture-rules.md) | Архитектура TypeScript-проекта: слои, зависимости, DI-модули, транзакции, межмодульное взаимодействие | `docs/rules/ts-architecture.md` |
| [extract-ts-api-contract-rules.md](./extract-ts-api-contract-rules.md) | API-контракты TypeScript: контроллеры, DTO и валидация, форматы запросов/ответов и ошибок | `docs/rules/ts-api-contracts.md` |
| [extract-ts-lint-test-rules.md](./extract-ts-lint-test-rules.md) | Линтинг и тесты TypeScript: ESLint, строгость `tsconfig`, Jest, моки, e2e | `docs/rules/ts-linting-tests.md` |
| [extract-prettier-rules.md](./extract-prettier-rules.md) | Форматирование: опции Prettier, область применения, интеграция с ESLint и редактором | `docs/rules/prettier.md` |

Общее описание формата выходного документа — [template-rules.md](./template-rules.md).

> **Стек.** Команды `extract-go-*` рассчитаны на Go-проекты; команды `extract-ts-*` и `extract-prettier` — на TypeScript/Node.js-проекты (в т.ч. NestJS). Остальные команды (архитектура, API, инфраструктура, CI/CD, конфиг, логирование, миграции) — общего назначения.

---

## Общий выходной формат

Каждая команда пишет результат по единому формату: заголовок, назначение, навигация, таблица правил с ID-префиксом (`ARCH-NNN`, `GO-NNN`, `TS-NNN`, `QA-NNN`, `FMT-NNN`, `INFRA-NNN`, `CICD-NNN`, `API-NNN`, `CFG-NNN`, `LOG-NNN`, `MIGR-NNN`), тематические разделы с подтверждающими фрагментами кода, пример и таблица версионирования. Подробности — в [template-rules.md](./template-rules.md).

---

## Как запускать

Команда — это инструкция: исполнитель открывает нужный файл команды, выполняет описанный алгоритм по коду проекта и сохраняет результат в указанный выходной файл.

- Без аргументов — анализируется весь репозиторий.
- Необязательный аргумент `scope` — путь к подкаталогу (микросервис или модуль) для ограничения анализа.

Команды независимы и запускаются в любом порядке. Рекомендуемая последовательность для полного описания проекта:

```text
1. extract-architecture-rules    → docs/rules/architecture.md
2. extract-go-style-rules        → docs/rules/go-style.md
3. extract-lint-test-rules       → docs/rules/linting-tests.md
4. extract-docker-infra-rules    → docs/rules/docker-infra.md
5. extract-cicd-rules            → docs/rules/cicd.md
6. extract-api-contract-rules    → docs/rules/api-contracts.md
7. extract-config-rules          → docs/rules/config.md
8. extract-logging-rules         → docs/rules/logging.md
9. extract-migration-rules       → docs/rules/migrations.md
```

---

## Версионирование

| Версия | Дата | Задача | Описание изменений |
|--------|------|--------|--------------------|
| 1.0.0 | 2026-06-12 | — | Начальное создание: 6 команд извлечения правил и общий формат вывода |
| 1.1.0 | 2026-06-22 | — | Добавлены команды: конфигурация (`config`), логирование (`logging`), миграции БД (`migrations`) |
| 1.2.0 | 2026-08-05 | TAC-11 | Добавлены команды для TypeScript/NestJS: `ts-style`, `ts-architecture`, `ts-api-contract`, `ts-lint-test`, `prettier` |