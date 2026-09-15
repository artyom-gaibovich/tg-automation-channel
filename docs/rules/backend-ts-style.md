# Правила TypeScript-стиля и написания кода

Нормы оформления TypeScript-кода проекта: иммутабельность сущностей, строгость типизации, именование, асинхронность и внедрение зависимостей. Выведены из фактического кода `src/`.

---

## Навигация
- [Таблица правил](#таблица-правил)
- [Принцип](#принцип)
- [Подробное описание](#подробное-описание)
- [Пример](#пример)
- [Исключения и граничные случаи](#исключения-и-граничные-случаи)
- [Версионирование](#версионирование)

---

## Таблица правил
| ID | Правило |
|----|---------|
| TS-001 | Доменные сущности иммутабельны: все поля объявляются как `public readonly` и заполняются только в конструкторе. |
| TS-002 | Объект сущности создаётся через конструктор или статическую фабрику `static create(params)`, а не мутацией после создания. |
| TS-003 | Явно моделируй отсутствие значения через `T \| null`; полагайся на `strictNullChecks`. |
| TS-004 | Ограниченные наборы значений выражай union-литералами (`'ru' \| 'en'`) или `as const`-массивами, а не «магическими» строками. |
| TS-005 | Импортируй типы через `import type { ... }` (правило `consistent-type-imports`). |
| TS-006 | Все асинхронные операции пиши через `async/await`; не оставляй «плавающих» промисов. |
| TS-007 | Избегай `any`; при необходимости неизвестного типа используй `unknown` с последующим сужением. |
| TS-008 | Зависимости внедряй только через конструктор с `private readonly`. |
| TS-009 | Порт/контракт слоя объявляй как `abstract class` (DI-токен) или `interface`, реализацию — отдельным классом. |
| TS-010 | Именуй файлы в kebab-case с семантическим суффиксом роли (`*.entity.ts`, `*.use-case.ts`, `*.repository.ts`, `*.controller.ts`, `*.module.ts`). |
| TS-011 | Классы, интерфейсы и типы — в PascalCase; переменные, поля и методы — в camelCase; `as const`-константы — в SCREAMING_SNAKE_CASE. |
| TS-012 | UseCase — класс с единственным публичным методом `execute(input)`, возвращающим `Promise<Output>`. |

---

## Принцип

Код написан в стиле, тяготеющем к «чистой архитектуре»: домен изолирован и иммутабелен, типы строгие, побочные эффекты асинхронны и явны. Компилятор настроен на `strictNullChecks` (`tsconfig.json`), а линтер — на защиту от типичных ошибок промисов и сравнения. Правила фиксируют то, как код **уже написан**, чтобы новые модули были однородны с существующими.

| Понятие | Описание |
|---------|----------|
| Иммутабельная сущность | Класс с `readonly`-полями и фабрикой `create`, без сеттеров |
| Порт | `abstract class`, играющий роль DI-токена и контракта для инфраструктуры |
| UseCase | Класс-оркестратор одной бизнес-операции с методом `execute` |

---

## Подробное описание

**[TS-001]** Доменная сущность заполняется целиком при конструировании и далее не меняется. Все поля — `public readonly`, объявлены прямо в сигнатуре конструктора (parameter properties). См. `src/modules/transcription/domain/entities/transcription.entity.ts`:

```ts
export class TranscriptionEntity {
  constructor(
    public readonly id: string,
    public readonly fileName: string | null,
    public readonly content: JsonValue,
    public readonly code: string | null,
    public readonly section: string | null,
  ) {}
}
```

**[TS-002]** Для создания из «сырого» набора данных предусмотрена статическая фабрика `create`, инкапсулирующая порядок аргументов конструктора. Прямая мутация полей после создания не применяется — обновление возвращает новый объект (спред). См. фабрику `TranscriptionEntity.create(...)` и `GetTranscriptionUseCase.toPlainText`, где новое состояние собирается через `{ ...data, ... }`.

**[TS-003]** Отсутствие значения выражается явным `| null` в типе поля (`fileName: string | null`), а не `undefined` или необъявленной опциональностью. Это опирается на `strictNullChecks: true` в `tsconfig.json`.

**[TS-004]** Замкнутые множества значений типизируются union-литералами (`language: 'ru'`, `audience_level: 'beginner' | 'middle'`) или массивами `as const` с выводом типа из них. См. `src/modules/transcription/application/repositories/transcription.repository.ts`:

```ts
export const TRANSCRIPTION_SORTABLE_FIELDS = ['fileName', 'code', 'section', 'order', 'createdAt'] as const;
export type TranscriptionSortField = (typeof TRANSCRIPTION_SORTABLE_FIELDS)[number];
```

**[TS-005]** Типы импортируются отдельно от значений через `import type`, что закреплено правилом ESLint `@typescript-eslint/consistent-type-imports: error`. Пример: `import type { JsonValue } from '../../../shared/types';`.

**[TS-006]** Все обращения к БД, файловой системе и внешним API выполняются через `async/await`. «Плавающие» и неправильно используемые промисы запрещены линтером (`no-floating-promises`, `no-misused-promises`, `await-thenable` — все `error`).

**[TS-007]** `any` не приветствуется (`@typescript-eslint/no-explicit-any: warn`). Для данных неизвестной структуры используется `unknown`/типизированное приведение с проверкой формы. См. сужение `content` в `GetTranscriptionUseCase.toPlainText`, где значение приводится к описанному локальному типу и проверяется `Array.isArray`.

**[TS-008]** Зависимости внедряются через конструктор с модификатором `private readonly`; ручное создание сервисов не применяется. См. `GetTranscriptionUseCase`:

```ts
constructor(private readonly transcriptionRepository: TranscriptionRepository) {}
```

**[TS-009]** Контракт слоя объявляется как `abstract class` и используется одновременно как DI-токен и как тип. Реализация наследует его. См. `TranscriptionRepository` (abstract) и `TranscriptionPrismaRepository extends TranscriptionRepository`.

**[TS-010]** Имена файлов — kebab-case с суффиксом роли: `transcription.entity.ts`, `get-transcription.use-case.ts`, `transcription.prisma-repository.ts`, `transcription.controller.ts`, `transcription.module.ts`.

**[TS-011]** Классы/интерфейсы/типы — PascalCase (`TranscriptionEntity`, `TranscriptionSortField`); поля и методы — camelCase (`fileName`, `execute`); неизменяемые константы уровня модуля — SCREAMING_SNAKE_CASE (`TRANSCRIPTION_SORTABLE_FIELDS`).

**[TS-012]** UseCase — класс с единственным публичным методом `execute(input): Promise<Output>`; типы `Input`/`Output` берутся из порта пространства имён `UseCasePort`. Вспомогательная логика выносится в `private`-методы.

> **Важно:** Не добавляй в сущности сеттеры и не мутируй `readonly`-поля через приведение типов — это нарушает TS-001/TS-002 и модель иммутабельности домена.

---

## Пример

```ts
// [TS-001][TS-002] — иммутабельная сущность с фабрикой
export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly title: string | null, // [TS-003] явный null
  ) {}

  static create(params: { id: string; title: string }): CategoryEntity {
    return new CategoryEntity(params.id, params.title);
  }
}

// [TS-008][TS-012] — UseCase с конструкторной инъекцией и единственным execute
@Injectable()
export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {} // [TS-009]

  async execute(input: UseCasePort.GetCategory.Input): Promise<UseCasePort.GetCategory.Output> {
    return this.categoryRepository.findById(input.id); // [TS-006] await
  }
}
```

```ts
// ❌ Нарушение TS-001/TS-002 — мутируемое поле и сеттер
export class BadEntity {
  public title: string;
  setTitle(v: string) { this.title = v; }
}

// ✅ Правильно — readonly + новый объект через фабрику/спред
export class GoodEntity {
  constructor(public readonly title: string) {}
  withTitle(title: string) { return new GoodEntity(title); }
}
```

---

## Исключения и граничные случаи

| Ситуация | Как поступить |
|----------|---------------|
| Данные из внешнего JSON неизвестной структуры (`content`) | Тип `JsonValue`/`unknown` с проверкой формы (`Array.isArray`) перед доступом, без `any` |
| Значение по умолчанию для опционального входа DTO | Задаётся в контракте презентации, а не в сущности (`page?: number = 0`) |
| Неиспользуемый параметр/переменная | Префикс `_` — разрешён `no-unused-vars` (`argsIgnorePattern: '^_'`) |
| Инфраструктурный класс реализует порт | Наследует `abstract class`-порт и вызывает `super()` в конструкторе |

---

## Версионирование
| Версия | Дата | Задача | Агент | Модель | Описание изменений |
|--------|------|--------|-------|--------|--------------------|
| 1.0.0 | 2026-08-05 | TAC-11 | Claude Code | claude-opus-4-8 | Начальное создание |
