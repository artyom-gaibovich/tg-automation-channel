# Отчёт: ESLint + TypeScript — что нужно исправить

Дата: 2026-03-30
Команды: `npm run lint`, `npx tsc --noEmit`

---

## Часть 1 — ESLint (3 ошибки, 14 предупреждений)

### ОШИБКИ (errors) — обязательно исправить

---

#### 1. `@ts-ignore` вместо `@ts-expect-error`
**Файл:** `src/modules/transcription/presentation/formatter/json-get-transcription.formatter.ts:8`
**Правило:** `@typescript-eslint/ban-ts-comment`

```ts
// @ts-ignore   ← строка 8, это ERROR
console.log(props.transcription.transcription);
```

**Как исправить:** заменить `// @ts-ignore` на `// @ts-expect-error` (или, лучше, правильно типизировать `props.transcription`).

> Замечание: на строке 12 также есть `// @ts-expect-error` вместе с `// @ts-ignore` — там оба комментария рядом. Нужно оставить только `// @ts-expect-error`.

---

#### 2. Async-коллбэк в `diskStorage.destination` (×2)
**Файл:** `src/modules/youtube/presentation/controllers/youtube.controller.ts`
**Строки:** 49, 90
**Правило:** `@typescript-eslint/no-misused-promises`

```ts
// строка 49 — в FileInterceptor
destination: async (req, file, callback) => {
  // ...
  await rm(uploadDir, { recursive: true, force: true });
  await mkdir(uploadDir, { recursive: true });
  callback(null, uploadDir);
},

// строка 90 — в FilesInterceptor
destination: async (req, file, callback) => {
  await mkdir(PATHS.UPLOAD_DIR, { recursive: true });
  callback(null, PATHS.UPLOAD_DIR);
},
```

Multer ожидает коллбэк с `void`-возвратом, а не `Promise`. Линтер запрещает передавать async-функцию туда, где ожидается void.

**Как исправить:** убрать `async`, использовать `.then().catch()` или сделать синхронную `mkdirSync`/`existsSync`:

```ts
// Вариант 1: синхронный
destination: (req, file, callback) => {
  mkdirSync(uploadDir, { recursive: true });
  callback(null, uploadDir);
},

// Вариант 2: без async, через .then
destination: (req, file, callback) => {
  mkdir(uploadDir, { recursive: true })
    .then(() => callback(null, uploadDir))
    .catch((err) => callback(err, uploadDir));
},
```

---

### ПРЕДУПРЕЖДЕНИЯ (warnings)

#### 3. `no-console` (3 места)

| Файл | Строка | Контекст |
|------|--------|----------|
| `src/modules/shared/logger/emojii.logger.ts` | 22 | `console.log(message)` внутри `writeToFile` |
| `src/modules/transcription/presentation/formatter/json-get-transcription.formatter.ts` | 9 | `console.log(props.transcription.transcription)` |
| `src/modules/youtube/infrastructure/youtube.service.ts` | 206 | `console.log('Processing file at:', absPath)` |

**Как исправить:**
- `emojii.logger.ts` — это кастомный логгер, но `console.log` в нём запрещён правилом. Нужно либо добавить ESLint-исключение `// eslint-disable-next-line no-console`, либо использовать `process.stdout.write`.
- В `formatter` строка 9 — это отладочный `console.log`, его нужно просто удалить.
- В `youtube.service.ts` строка 206 — заменить на `this.logger.log(...)` (инжектировать `Logger` из `@nestjs/common`).

---

#### 4. `no-explicit-any` (10 мест)

| Файл | Строка | Код |
|------|--------|-----|
| `src/modules/auth/auth.controller.ts` | 34 | `{ user: any }` |
| `src/modules/message/infrastructure/decorators/logger.ts` | 3 | `{ [key: string]: any }` |
| `src/modules/message/infrastructure/decorators/logger.ts` | 5 | `constructor(...args: any[])` |
| `src/modules/transcription/presentation/formatter/json-get-transcription.formatter.ts` | 13 | `(item: any) => item.text` |
| `src/modules/youtube/infrastructure/youtube.api.ts` | 6 | `items: any` в `YoutubeVideoListResponse` |
| `src/modules/youtube/infrastructure/youtube.service.ts` | 29 | `const params: any = { ... }` |
| `src/modules/youtube/infrastructure/youtube.service.ts` | 41 | `axios.get<any>(url, ...)` |
| `src/modules/youtube/infrastructure/youtube.service.ts` | 43 | `.map((item: any) => ...)` |
| `src/modules/youtube/infrastructure/youtube.service.ts` | 61 | `axios.get<any>(url, ...)` |
| `src/modules/youtube/infrastructure/youtube.service.ts` | 89 | `catch (error: any)` |
| `src/modules/youtube/presentation/controllers/youtube.controller.ts` | 107 | `@Body() body: any` |

**Как исправить по каждому:**

**`auth.controller.ts:34`**
```ts
// было
@Request() req: Express.Request & { user: any }

// надо — создать интерфейс или использовать тип из auth.service
@Request() req: Express.Request & { user: { id: string; email: string } }
```

**`logger.ts:3,5`** — декоратор `withLogging` использует `any` для generics:
```ts
// было
ClassConstructor<{ [key: string]: any }>
constructor(...args: any[])

// надо
ClassConstructor<{ [key: string]: unknown }>
constructor(...args: unknown[])
```

**`json-get-transcription.formatter.ts:13`** — нужно типизировать элемент массива транскрипции.

**`youtube.api.ts:6`** — `YoutubeVideoListResponse.items: any` нужно заменить на реальный тип (хотя бы `unknown[]` или создать интерфейс `YoutubeVideoItem`).

**`youtube.service.ts:29`** — `params: any` можно заменить на:
```ts
const params: Record<string, string | number | undefined> = { ... }
```

**`youtube.service.ts:41,61`** — `axios.get<any>` заменить на `axios.get<YoutubeSubscriptionsResponse>` и `axios.get<YoutubeChannelsResponse>` (создать интерфейсы).

**`youtube.service.ts:43`** — `.map((item: any) => ...)` — типизировать `item` через интерфейс.

**`youtube.service.ts:89`** — `catch (error: any)` → `catch (error: unknown)`:
```ts
catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`Ошибка поиска канала: ${message}`);
}
```

**`youtube.controller.ts:107`** — `body: any` → создать DTO или интерфейс:
```ts
interface UploadMultipleBody {
  code: string;
  seo_tags: string[];
}
@Body() body: UploadMultipleBody
```

---

## Часть 2 — TypeScript (TS errors)

### Критические ошибки компилятора

---

#### 5. Отсутствуют пакеты в `node_modules`

Следующие модули импортируются, но **не установлены**:

| Пакет | Где используется |
|-------|-----------------|
| `@nestjs/config` | `auth.service.ts`, `telegram-client.init.config.ts`, `telegram-client.module.ts` |
| `@nestjs/mapped-types` | `update-auth.dto.ts`, `update-category.dto.ts`, `update-message.dto.ts`, `update-user-channel.dto.ts` |
| `prisma/config` | `prisma.config.ts` |

**Как исправить:**
```bash
npm install @nestjs/config @nestjs/mapped-types
```

Пакет `prisma/config` — возможно, нужен `prisma` в devDependencies (уже есть `@prisma/client`, но `prisma` CLI может отсутствовать):
```bash
npm install -D prisma
```

---

#### 6. Локальный модуль `../../../../data` не найден
**Файл:** `src/modules/youtube/infrastructure/youtube.service.ts:7`

```ts
import { extractVideo } from '../../../../data';  // TS2307
```

Путь ведёт за пределы `src/`. Модуль `data/` отсутствует в репозитории.

**Как исправить:** найти и добавить модуль `data/` (или восстановить из источника), либо переместить функцию `extractVideo` в структуру проекта.

---

#### 7. Импорты с `.ts` расширением
**Правило:** `TS5097` — `allowImportingTsExtensions` не включён в tsconfig.

| Файл | Строка | Импорт |
|------|--------|--------|
| `src/modules/scenario/application/index.ts` | 3 | `'./use-cases/get-scenario.use-case.ts'` |
| `src/modules/scenario/infrastructure/prisma/repositories/index.ts` | 1 | `'./scenario.prisma-repository.ts'` |
| `src/modules/transcription/application/use-cases/index.ts` | 2 | `'./generate-prompt.use-case.ts'` |
| `src/modules/transcription/application/use-cases/index.ts` | 4 | `'./update-transcription.use-case.ts'` |

**Как исправить:** убрать расширение `.ts` из этих путей:

```ts
// было
export { GetScenarioUseCase } from './use-cases/get-scenario.use-case.ts';

// надо
export { GetScenarioUseCase } from './use-cases/get-scenario.use-case';
```

---

#### 8. `posts` и `results` неявно типизированы как `never[]`
**Файл:** `src/modules/telegram-client/telegram-client.service.ts:11` и `youtube.controller.ts:109`

```ts
// telegram-client.service.ts
const posts = [];  // инферится как never[]
posts.push(...parsed);  // TS2345: Argument of type '...' is not assignable to 'never'

// youtube.controller.ts
const results = [];  // инферится как never[]
results.push({ file: ..., result: ... });  // TS2345
```

**Как исправить:** явно указать тип массива:

```ts
// telegram-client.service.ts
interface TelegramPost {
  channel: string;
  messageId: number;
  text: string;
  date: number;
}
const posts: TelegramPost[] = [];

// youtube.controller.ts
interface UploadResult {
  file: string;
  result: { filename: string; result: string };
}
const results: UploadResult[] = [];
```

---

#### 9. `searchRes.data` имеет тип `unknown`
**Файл:** `src/modules/youtube/infrastructure/youtube.service.ts:74,84,85`

```ts
// строка 74 — axios.get вызван без дженерика
const searchRes = await axios.get(searchUrl, { params: { ... } });

// строки 84–85 — ошибка: searchRes.data имеет тип unknown
if (searchRes.data.items.length > 0) {          // TS18046
  return searchRes.data.items[0].snippet.channelId;  // TS18046
}
```

**Как исправить:** добавить тип к `axios.get`:

```ts
interface YoutubeSearchResponse {
  items: Array<{
    snippet: { channelId: string };
  }>;
}

const searchRes = await axios.get<YoutubeSearchResponse>(searchUrl, { params: { ... } });
```

---

#### 10. `UpdateUserChannelDto.channelsToRewrite` не найден
**Файл:** `src/modules/user-channel/user-channel.service.ts:49`

```ts
channelsToRewrite: updateUserChannelDto.channelsToRewrite,  // TS2339
```

`UpdateUserChannelDto` расширяет `PartialType(CreateUserChannelDto)`, а `PartialType` приходит из `@nestjs/mapped-types`, который **не установлен** (см. пункт 5). После установки пакета ошибка уйдёт автоматически — поле `channelsToRewrite` станет `string[] | undefined`.

---

## Итого — сводка по приоритетам

| Приоритет | Проблема | Количество |
|-----------|----------|-----------|
| Критично | Не установлены пакеты (`@nestjs/config`, `@nestjs/mapped-types`, `prisma`) | 3 пакета |
| Критично | Отсутствует локальный модуль `../../../../data` | 1 |
| Ошибка линтера | `@ts-ignore` → `@ts-expect-error` | 1 |
| Ошибка линтера | `no-misused-promises` в multer коллбэках | 2 |
| TS-ошибка | Импорты с `.ts` расширением | 4 |
| TS-ошибка | Неявный `never[]` в массивах | 2 |
| TS-ошибка | `axios.get` без дженерика → `unknown` | 1 |
| Предупреждение | `no-explicit-any` | 10 |
| Предупреждение | `no-console` | 3 |
