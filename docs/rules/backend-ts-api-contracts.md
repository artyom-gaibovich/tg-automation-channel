# Правила API-контрактов (TypeScript / NestJS)

Нормы описания и реализации HTTP-контрактов: контроллеры NestJS, DTO с валидацией `class-validator`, группировка типов запросов/ответов через `namespace`, единый формат ошибок. Выведены из фактического кода `src/modules/*/presentation`.

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
| API-001 | HTTP-эндпоинты объявляются контроллером NestJS с базовым путём в `@Controller('<resource>')`. |
| API-002 | Контракты запросов/ответов лежат в `presentation/api-contracts/*.types.ts` рядом с контроллером. |
| API-003 | Контракты группируются иерархией `namespace`: `<Module>ApiContracts.Api.<Endpoint>.{Request,Response}`. |
| API-004 | Вход описывается DTO-классами `Request.Body` / `Query` / `Params` с декораторами `class-validator`. |
| API-005 | Ответ описывается типом `Response.Data` (`type`/`class`), а не «сырым» объектом. |
| API-006 | Валидация включается через `ValidationPipe`; для преобразования типов запроса используется опция `{ transform: true }`. |
| API-007 | Приведение и трансформация входных значений выполняются декораторами `class-transformer` (`@Type`, `@Transform`). |
| API-008 | Опциональные параметры помечаются `@IsOptional()` и получают значение по умолчанию в DTO. |
| API-009 | Замкнутые множества значений валидируются `@IsIn([...])` и типизируются union-литералом. |
| API-010 | Контроллер маппит доменную сущность в `Response.Data`, не отдавая наружу инфраструктурные типы. |
| API-011 | Ошибки возвращаются в едином формате через `HttpExceptionFilter` (`statusCode`, `timestamp`, `path`, `message`). |

---

## Принцип

Транспортный слой отделён от домена: контроллеры принимают валидируемые DTO и возвращают типизированные `Response.Data`, а бизнес-логику делегируют UseCase. Контракты каждого эндпоинта собраны в одном `namespace`, что даёт единое место истины для формы запроса и ответа. Валидация декларативна (`class-validator`), ошибки — единообразны. Правила выведены из реальных контроллеров и файлов `*.types.ts`.

| Понятие | Описание |
|---------|----------|
| `Request.Body/Query/Params` | DTO-классы входа с декораторами валидации |
| `Response.Data` | Тип тела ответа эндпоинта |
| `ValidationPipe` | Точка включения валидации и трансформации входа |
| `HttpExceptionFilter` | Единый формат тела ошибки |

---

## Подробное описание

**[API-001]** Эндпоинты объявляются контроллером с базовым путём ресурса и HTTP-декораторами методов. См. `src/modules/transcription/presentation/controllers/transcription.controller.ts`:

```ts
@Controller('transcription')
export class TranscriptionController {
  @Post() async generatePrompt(...) {}
  @Post('list') async getTranscriptions(...) {}
}
```

**[API-002]** Контракты хранятся рядом с контроллером — `presentation/api-contracts/transcription.types.ts` — и импортируются в контроллер как единый `namespace`.

**[API-003]** Контракты иерархичны: `TranscriptionApiContracts.Api.<Endpoint>.Request.*` и `.Response.Data`. Это даёт стабильные, самоописательные ссылки на типы в контроллере.

**[API-004]** Вход — DTO-классы с декораторами `class-validator`. См. `GetTranscription.Request.Body`:

```ts
export class Body {
  @IsString() @IsNotEmpty() transcriptionId: string;
  @IsIn(['ru']) language: 'ru';
  @IsArray() @ArrayMinSize(1) @IsString({ each: true }) topic_tags: string[];
  @IsIn(['beginner', 'middle']) audience_level: 'beginner' | 'middle';
  @IsNumber() @Type(() => Number) variants: number;
}
```

**[API-005]** Ответ описан типом `Response.Data` (например, `type Data = { message: string }` или `= TranscriptionEntity`), а не анонимным объектом в сигнатуре метода.

**[API-006]** Валидация подключается `@UsePipes(new ValidationPipe())`; там, где нужны числа/булевы из query, добавляется `{ transform: true }`. См. `@UsePipes(new ValidationPipe({ transform: true }))` над `@Post('list')`.

**[API-007]** Приведение и трансформация — декораторами `class-transformer`: `@Type(() => Number)` для числовых полей, `@Transform(...)` для булевых из строк query (`textOnly?: boolean`).

**[API-008]** Опциональные поля: `@IsOptional()` + значение по умолчанию в DTO (`page?: number = 0`, `size?: number = 20`, `textOnly?: boolean = false`).

**[API-009]** Ограниченные значения валидируются `@IsIn([...])` и одновременно типизируются union-литералом (`language: 'ru'`, `audience_level: 'beginner' | 'middle'`) — валидация и тип согласованы.

**[API-010]** Контроллер собирает `Response.Data` из результата UseCase, при необходимости прогоняя через форматтер (`GetTranscriptionFormatter`), и не возвращает Prisma-модели напрямую.

**[API-011]** Ошибки приводятся к единому телу глобальным фильтром. См. `src/modules/shared/error/http-exception-filter.ts`:

```ts
response.status(status).json({
  statusCode: status,
  timestamp: new Date().toISOString(),
  path: request.url,
  message: exception.message,
});
```

> **Важно:** Не описывай форму ответа инлайн в сигнатуре контроллера — заводи `Response.Data` в `*.types.ts`, иначе теряется единый источник контракта (нарушение API-003/API-005).

> **В проекте не обнаружено:** OpenAPI/Swagger (`@nestjs/swagger`) и gRPC/protobuf не используются — REST-контракты описаны только кодом контроллеров и DTO.

---

## Пример

```ts
// [API-003][API-004][API-008] — контракт в namespace с валидацией и дефолтами
export namespace CategoryApiContracts {
  export namespace Api {
    export namespace List {
      export namespace Request {
        export class Query {
          @IsOptional() @IsInt() @Min(0) @Type(() => Number) page?: number = 0; // [API-007]
        }
      }
      export namespace Response {
        export type Data = { content: CategoryEntity[]; page: number }; // [API-005]
      }
    }
  }
}

// [API-001][API-006][API-010] — контроллер
@Controller('category')
export class CategoryController {
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('list')
  async list(
    @Query() query: CategoryApiContracts.Api.List.Request.Query,
  ): Promise<CategoryApiContracts.Api.List.Response.Data> {
    return this.listCategoryUseCase.execute(query);
  }
}
```

---

## Исключения и граничные случаи

| Ситуация | Как поступить |
|----------|---------------|
| Тонкий модуль без бизнес-логики (`files`) | Контракты допускаются в `presentation/controllers/api-contracts/`; иерархия `namespace` сохраняется |
| Булев флаг приходит строкой в query | `@Transform(({ value }) => value === 'true' \|\| value === true)` + `@IsBoolean()` |
| Ответ совпадает с доменной сущностью | `Response.Data = <Entity>` допустимо; инфраструктурные (Prisma) типы всё равно не отдаются |
| Нужен нестандартный формат сортировки | Валидируется `@Matches(/regex/, { message })` с человекочитаемым сообщением |

---

## Версионирование
| Версия | Дата | Задача | Агент | Модель | Описание изменений |
|--------|------|--------|-------|--------|--------------------|
| 1.0.0 | 2026-08-05 | TAC-11 | Claude Code | claude-opus-4-8 | Начальное создание |
