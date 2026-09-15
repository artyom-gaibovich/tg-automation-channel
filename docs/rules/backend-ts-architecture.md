# Правила архитектуры (TypeScript / NestJS)

Нормы архитектуры проекта: модульная чистая архитектура на NestJS с разделением на слои `domain` / `application` / `infrastructure` / `presentation`, инверсией зависимостей через DI-токены и изоляцией ORM в инфраструктуре. Выведены из фактического кода `src/modules/`.

---

## Навигация
- [Таблица правил](#таблица-правил)
- [Принцип](#принцип)
- [Подробное описание](#подробное-описание)
- [Структура](#структура)
- [Исключения и граничные случаи](#исключения-и-граничные-случаи)
- [Версионирование](#версионирование)

---

## Таблица правил
| ID | Правило |
|----|---------|
| ARCH-001 | Код группируется по доменным модулям в `src/modules/<module>`, а не по техническим типам на верхнем уровне. |
| ARCH-002 | Внутри модуля обязательны слои `domain`, `application`, `infrastructure`, `presentation`. |
| ARCH-003 | Зависимости направлены внутрь: `presentation` → `application` → `domain`; `infrastructure` реализует контракты `application`. |
| ARCH-004 | `domain` не импортирует ни один другой слой, фреймворк или ORM. |
| ARCH-005 | Контракты (порты, репозитории) объявляются в `application` как `abstract class` и там же служат DI-токенами. |
| ARCH-006 | Реализации портов живут в `infrastructure`; только этот слой знает про Prisma/внешние API. |
| ARCH-007 | Бизнес-операция — один UseCase в `application` с методом `execute(input)`. |
| ARCH-008 | Слои связываются в `*.module.ts` через `providers` с парой `{ provide: <AbstractPort>, useClass: <Impl> }`. |
| ARCH-009 | Внешняя граница модуля — barrel-файлы `index.ts` каждого слоя; глубокие импорты внутренностей чужого модуля не допускаются. |
| ARCH-010 | Транзакции инкапсулированы в инфраструктуре через `prisma.$transaction`, домен и application про них не знают. |
| ARCH-011 | Общий код (Prisma-клиент, типы, конфиг, ошибки, логгер) вынесен в `src/modules/shared`. |

---

## Принцип

Проект следует модульной «чистой архитектуре» поверх NestJS. Каждый домен — самостоятельный модуль с четырьмя слоями; зависимости направлены к домену, а инфраструктура подключается через инверсию зависимостей DI-контейнером NestJS. Это позволяет менять ORM или транспорт, не затрагивая бизнес-логику. Стиль распознан по структуре каталогов, направлению импортов и провайдингу через `abstract class`-токены.

| Слой | Ответственность |
|------|-----------------|
| `domain` | Сущности и доменные типы; без зависимостей от фреймворка и ORM |
| `application` | UseCase-оркестраторы и порты (контракты репозиториев/сервисов) |
| `infrastructure` | Реализация портов: Prisma-репозитории, внешние API, транзакции |
| `presentation` | Контроллеры, DTO/контракты, форматтеры |

---

## Подробное описание

**[ARCH-001]** Верхний уровень кода — доменные модули: `src/modules/transcription`, `.../scenario`, `.../category`, `.../auth`, `.../message`, `.../files`, `.../shared`. Технической группировки (общие `controllers/`, `services/` на корне) нет.

**[ARCH-002]** Полнофункциональный модуль содержит все четыре слоя. Пример — `transcription`:

```text
modules/transcription/
├── domain/           # entities
├── application/      # use-cases, ports, repositories (контракты)
├── infrastructure/   # prisma, whisper (реализации)
└── presentation/     # controllers, api-contracts, formatter
```

**[ARCH-003]** Импорты идут внутрь. Контроллер (`presentation`) зависит от UseCase (`application`); UseCase зависит от сущностей и портов; инфраструктура зависит от контрактов `application`. Обратных импортов (`domain` → `application` и т.п.) нет.

**[ARCH-004]** `domain` изолирован: `transcription.entity.ts` импортирует только внутридоменные типы и общий тип `JsonValue` из `shared/types`, но не NestJS и не Prisma.

**[ARCH-005]** Контракт репозитория объявлен в `application` как `abstract class` — он одновременно тип и DI-токен. См. `src/modules/transcription/application/repositories/transcription.repository.ts`:

```ts
export abstract class TranscriptionRepository {
  abstract findById(id: string): Promise<TranscriptionEntity>;
  abstract findPage(params: TranscriptionPageParams): Promise<{ items: TranscriptionListItem[]; total: number }>;
  abstract delete(id: string): Promise<void>;
}
```

**[ARCH-006]** Реализация находится в `infrastructure` и единственная знает про Prisma. См. `TranscriptionPrismaRepository extends TranscriptionRepository`, инъектирующий `PrismaService` из `shared/persistence`.

**[ARCH-007]** Каждая операция — отдельный UseCase (`get-transcription.use-case.ts`, `list-transcription.use-case.ts`, `delete-transcription.use-case.ts`, ...) с единственным `execute`, оркестрирующим порты.

**[ARCH-008]** Связывание слоёв — в `*.module.ts` через провайдер-мэппинг. См. `src/modules/transcription/transcription.module.ts`:

```ts
const infrastructure: Provider[] = [
  { provide: TranscriptionRepository, useClass: TranscriptionPrismaRepository },
  { provide: GetTranscriptionFormatter, useClass: JsonGetTranscriptionFormatter },
];
@Module({ providers: [...infrastructure, ...application], controllers: [TranscriptionController] })
export class TranscriptionModule {}
```

**[ARCH-009]** Каждый слой экспортирует публичное API через `index.ts` (barrel). Импорты идут к barrel слоя (`from '../../application'`, `from '../../domain'`), а не к конкретным внутренним путям чужого модуля.

**[ARCH-010]** Транзакции живут в инфраструктуре. См. `TranscriptionPrismaRepository.findPage`, использующий `this.prisma.$transaction([...])`; ни `application`, ни `domain` не оперируют транзакциями.

**[ARCH-011]** Кросс-модульные вещи вынесены в `shared`: `shared/persistence/prisma` (PrismaService), `shared/types` (`JsonValue`), `shared/config`, `shared/error` (`HttpExceptionFilter`), `shared/logger`.

> **Важно:** Prisma-типы и `PrismaService` не должны просачиваться в `application`/`domain`. Инфраструктура принимает и возвращает доменные сущности/контрактные типы — граница ORM проходит по границе слоя `infrastructure`.

---

## Структура

```text
src/
├── modules/
│   ├── transcription/
│   │   ├── domain/
│   │   │   ├── entities/            # *.entity.ts (readonly, фабрики)
│   │   │   └── index.ts
│   │   ├── application/
│   │   │   ├── use-cases/           # *.use-case.ts (execute)
│   │   │   ├── ports/               # UseCasePort namespace (Input/Output)
│   │   │   ├── repositories/        # abstract class-контракты + DI-токены
│   │   │   └── index.ts
│   │   ├── infrastructure/
│   │   │   ├── prisma/repositories/ # *.prisma-repository.ts (реализация)
│   │   │   └── index.ts
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   ├── api-contracts/       # *.types.ts (DTO + валидация)
│   │   │   ├── formatter/
│   │   │   └── index.ts
│   │   └── transcription.module.ts  # связывание слоёв через DI
│   └── shared/                      # prisma, types, config, error, logger
└── main.ts
```

---

## Исключения и граничные случаи

| Ситуация | Как поступить |
|----------|---------------|
| Модуль тонкий, без бизнес-логики (`files`) | Допустимо сократить слои до `infrastructure` + `presentation`; `domain`/`application` не создаются «пустыми» |
| Нужна реализация форматтера/сервиса презентации | Абстракция объявляется в `presentation`, реализация провайдится через `useClass` в модуле (как `GetTranscriptionFormatter`) |
| Сущность требует общий тип данных | Берётся из `shared/types` (`JsonValue`), а не дублируется в домене |
| Обработка ошибок для транспорта | Через `HttpExceptionFilter` из `shared/error`, а не в UseCase |

---

## Версионирование
| Версия | Дата | Задача | Агент | Модель | Описание изменений |
|--------|------|--------|-------|--------|--------------------|
| 1.0.0 | 2026-08-05 | TAC-11 | Claude Code | claude-opus-4-8 | Начальное создание |
