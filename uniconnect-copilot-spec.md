# UniConnect — Полная техническая спецификация для GitHub Copilot

> **Инструкция для Copilot:** Этот файл — полная техническая документация проекта UniConnect.
> Читай его целиком перед генерацией любого кода. Следуй архитектуре, соглашениям по именованию,
> структуре файлов и паттернам точно так, как описано ниже.

---

## 1. ОБЗОР ПРОЕКТА

**UniConnect** — внутренняя университетская платформа для КазГЮУ (KazGUU).
Объединяет функции студенческого портала (как Platonus) и социальной сети.
Доступ только для пользователей с email `@kazguu.kz`.

**Что умеет платформа:**

- Лента новостей с постами, лайками, комментариями
- Организации (студенческие клубы)
- Чаты (глобальный, по школам, по специальностям)
- Отзывы на преподавателей (только студенты)
- FAQ (аккордеон)
- Опросы (ссылки на внешние формы)
- Уведомления (лайки, комменты, сообщения)
- Профиль пользователя с редактированием

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

```
Frontend:   Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
Backend:    Next.js API Routes (встроенный)
Database:   PostgreSQL
ORM:        Prisma
Auth:       JWT + HttpOnly cookies (НЕ NextAuth, НЕ sessions)
Валидация:  Zod
Утилиты:    clsx + tailwind-merge, date-fns, lucide-react
i18n:       JSON-файлы (EN / RU / KZ), кастомный хук
```

**Версии пакетов (package.json):**

```json
{
  "dependencies": {
    "@prisma/client": "^5.10.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "next": "14.1.4",
    "react": "^18",
    "react-dom": "^18",
    "zod": "^3.22.4",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.2",
    "lucide-react": "^0.363.0",
    "date-fns": "^3.3.1",
    "cookies-next": "^4.1.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "prisma": "^5.10.2",
    "ts-node": "^10.9.2",
    "tailwindcss": "^3.3.0",
    "typescript": "^5",
    "autoprefixer": "^10.0.1",
    "postcss": "^8"
  }
}
```

---

## 3. СТРУКТУРА ФАЙЛОВ (полная)

```
uniconnect/
├── .env.example                          ← шаблон env переменных
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
│
├── prisma/
│   ├── schema.prisma                     ← полная схема БД (12 моделей)
│   └── seed.ts                           ← тестовые данные
│
└── src/
    ├── middleware.ts                     ← защита роутов (JWT из cookie)
    │
    ├── app/
    │   ├── layout.tsx                    ← root layout (шрифты, metadata)
    │   │
    │   ├── (auth)/                       ← группа роутов БЕЗ сайдбара
    │   │   ├── layout.tsx                ← центрированный card layout
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   │
    │   ├── (main)/                       ← группа роутов С сайдбаром
    │   │   ├── layout.tsx                ← server component, читает cookie, редирект
    │   │   ├── feed/page.tsx
    │   │   ├── organizations/page.tsx
    │   │   ├── chats/page.tsx
    │   │   ├── reviews/page.tsx
    │   │   ├── faq/page.tsx
    │   │   ├── surveys/page.tsx
    │   │   ├── notifications/page.tsx
    │   │   └── profile/page.tsx
    │   │
    │   └── api/
    │       ├── auth/
    │       │   ├── register/route.ts
    │       │   ├── login/route.ts
    │       │   ├── logout/route.ts
    │       │   └── me/route.ts
    │       ├── posts/
    │       │   ├── route.ts              ← GET (список) + POST (создать)
    │       │   └── [id]/like/route.ts    ← POST (toggle like)
    │       ├── comments/route.ts         ← GET ?postId + POST
    │       ├── chats/route.ts            ← GET (чаты юзера)
    │       ├── messages/route.ts         ← GET ?chatId + POST
    │       ├── organizations/route.ts    ← GET
    │       ├── reviews/route.ts          ← GET ?school + POST
    │       ├── surveys/route.ts          ← GET + POST
    │       ├── faq/route.ts              ← GET
    │       ├── notifications/route.ts    ← GET + PATCH (mark all read)
    │       ├── users/route.ts            ← GET ?role=TEACHER
    │       └── profile/route.ts          ← PATCH
    │
    ├── components/
    │   ├── auth/
    │   │   └── AuthProvider.tsx          ← React Context (user, logout, refresh)
    │   ├── layout/
    │   │   ├── Sidebar.tsx               ← sticky sidebar 256px, только lg+
    │   │   ├── MobileNav.tsx             ← fixed bottom bar, только < lg
    │   │   ├── LocaleProvider.tsx        ← Context для i18n
    │   │   └── LocaleSwitcher.tsx        ← переключатель EN/RU/KZ
    │   ├── feed/
    │   │   ├── PostCard.tsx              ← пост с лайком/комментами
    │   │   └── CreatePostForm.tsx        ← свернутый/развернутый редактор
    │   └── ui/
    │       ├── Button.tsx                ← 4 варианта, 3 размера, loading
    │       ├── Input.tsx                 ← label + error + hint
    │       ├── Avatar.tsx                ← инициалы + детерминированный цвет
    │       └── OrgCard.tsx               ← карточка организации с баннером
    │
    ├── lib/
    │   ├── auth/
    │   │   ├── jwt.ts                    ← signToken, verifyToken
    │   │   └── session.ts                ← getAuthUser, createAuthCookieOptions
    │   ├── db/
    │   │   └── prisma.ts                 ← Prisma singleton (global var паттерн)
    │   ├── i18n/
    │   │   └── index.ts                  ← getTranslations, t(), LOCALES массив
    │   ├── validators/
    │   │   └── schemas.ts                ← все Zod схемы
    │   ├── api-response.ts               ← хелперы successResponse, errorResponse
    │   └── utils.ts                      ← cn(), timeAgo(), fullName(), SCHOOL_LABELS
    │
    ├── locales/
    │   ├── en/common.json
    │   ├── ru/common.json
    │   └── kz/common.json
    │
    ├── styles/
    │   └── globals.css                   ← Tailwind + CSS переменные + утилити классы
    │
    └── types/
        └── index.ts                      ← все shared типы
```

---

## 4. СХЕМА БАЗЫ ДАННЫХ (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  STUDENT
  TEACHER
}

enum School {
  VSP    // ВШП
  VGSh   // ВГШ
  MShE   // МШЭ
  MShZh  // МШЖ
}

enum ChatType {
  GLOBAL
  SCHOOL
  SPECIALTY
  TEACHER
}

enum NotificationType {
  NEW_MESSAGE
  NEW_COMMENT
  NEW_LIKE
  NEW_REVIEW
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  role          Role     @default(STUDENT)
  name          String
  surname       String
  course        Int?
  school        School
  specialty     String
  isVerified    Boolean  @default(false)
  agreedToTerms Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  posts           Post[]
  comments        Comment[]
  likes           Like[]
  sentMessages    Message[]
  reviews         Review[]       @relation("ReviewAuthor")
  receivedReviews Review[]       @relation("ReviewTeacher")
  surveys         Survey[]
  notifications   Notification[]
  files           File[]
  chatMembers     ChatMember[]

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments Comment[]
  likes    Like[]

  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@map("comments")
}

model Like {
  id     String @id @default(cuid())
  userId String
  postId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@map("likes")
}

model Organization {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  avatarUrl   String?
  createdAt   DateTime @default(now())

  @@map("organizations")
}

model Chat {
  id        String   @id @default(cuid())
  name      String
  type      ChatType
  school    School?
  specialty String?
  createdAt DateTime @default(now())

  messages Message[]
  members  ChatMember[]

  @@map("chats")
}

model ChatMember {
  id       String   @id @default(cuid())
  chatId   String
  userId   String
  joinedAt DateTime @default(now())

  chat Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([chatId, userId])
  @@map("chat_members")
}

model Message {
  id        String   @id @default(cuid())
  chatId    String
  userId    String
  text      String   @db.Text
  createdAt DateTime @default(now())

  chat Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("messages")
}

model Review {
  id        String   @id @default(cuid())
  teacherId String
  userId    String
  rating    Int
  comment   String   @db.Text
  createdAt DateTime @default(now())

  teacher User @relation("ReviewTeacher", fields: [teacherId], references: [id], onDelete: Cascade)
  author  User @relation("ReviewAuthor",  fields: [userId],    references: [id], onDelete: Cascade)

  @@unique([teacherId, userId])
  @@map("reviews")
}

model Survey {
  id        String   @id @default(cuid())
  title     String
  link      String
  authorId  String
  createdAt DateTime @default(now())

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("surveys")
}

model Faq {
  id        String   @id @default(cuid())
  question  String
  answer    String   @db.Text
  order     Int      @default(0)
  createdAt DateTime @default(now())

  @@map("faqs")
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  content   String
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}

model File {
  id          String   @id @default(cuid())
  userId      String
  fileUrl     String
  fileName    String
  fileSize    Int?
  description String?
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("files")
}
```

---

## 5. ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (.env.local)

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/uniconnect_db?schema=public"
JWT_SECRET="минимум-32-символа-случайная-строка"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN="kazguu.kz"
```

---

## 6. АУТЕНТИФИКАЦИЯ — ПОЛНАЯ ЛОГИКА

### Принцип

- JWT токен хранится в **HttpOnly cookie** с именем `auth_token`
- НЕ используется localStorage, НЕ используется NextAuth
- Cookie: `httpOnly: true`, `secure: true` (только prod), `sameSite: 'lax'`, `maxAge: 604800` (7 дней)

### JWT payload

```typescript
interface JwtPayload {
  userId: string
  email: string
  role: Role // 'STUDENT' | 'TEACHER'
  name: string
  surname: string
}
```

### Поток регистрации

1. Валидация Zod (проверка домена `@kazguu.kz`)
2. Проверка уникальности email в БД
3. `bcrypt.hash(password, 12)`
4. `prisma.user.create(...)`
5. `jwt.sign(payload, JWT_SECRET)`
6. `response.cookies.set({ name: 'auth_token', value: token, httpOnly: true, ... })`
7. Возврат safe user (без поля `password`)

### Поток логина

1. `prisma.user.findUnique({ where: { email } })`
2. Если не найден → `401` с сообщением "Invalid email or password" (одно сообщение для обоих случаев — защита от enumeration)
3. `bcrypt.compare(password, user.password)`
4. Если не совпало → `401`
5. Подписать JWT → set cookie → вернуть safe user

### Получение юзера в API роутах

```typescript
// src/lib/auth/session.ts
export function getAuthUser(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get('auth_token')?.value
  if (token) return verifyToken(token)
  // fallback: Authorization: Bearer <token>
  const header = req.headers.get('authorization')
  if (header?.startsWith('Bearer ')) return verifyToken(header.slice(7))
  return null
}
```

### Middleware (src/middleware.ts)

```typescript
// Защищает все роуты /(main)/*
// Если нет валидного токена → redirect('/login')
// Если на /login или /register и токен есть → redirect('/feed')
// Инжектирует x-user-id и x-user-role в заголовки запроса
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 7. ПАТТЕРНЫ API РОУТОВ

### Стандартный ответ

```typescript
// Всегда используй эти хелперы из src/lib/api-response.ts
successResponse(data, 200) // { success: true, data }
errorResponse('message', 400) // { success: false, error }
unauthorizedResponse() // 401
forbiddenResponse() // 403
notFoundResponse('Post') // 404: "Post not found"
validationErrorResponse(zodError) // 422: { details: string[] }
```

### Шаблон каждого API роута

```typescript
export async function GET(req: NextRequest) {
  // 1. Проверить аутентификацию
  const authUser = getAuthUser(req)
  if (!authUser) return unauthorizedResponse()

  // 2. Получить данные из БД
  const data = await prisma.something.findMany(...)

  // 3. Вернуть результат
  return successResponse({ data })
}

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req)
  if (!authUser) return unauthorizedResponse()

  try {
    const body = await req.json()
    const validated = schema.parse(body)   // Zod валидация
    // ... логика
    return successResponse({ item }, 201)
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error)
    return errorResponse('Failed', 500)
  }
}
```

### Все API роуты и их логика

| Роут                   | Метод | Кто может    | Особенности                                                         |
| ---------------------- | ----- | ------------ | ------------------------------------------------------------------- |
| `/api/auth/register`   | POST  | Все          | bcrypt(12), уникальность email, set cookie                          |
| `/api/auth/login`      | POST  | Все          | compare(), одна ошибка для обоих случаев                            |
| `/api/auth/logout`     | POST  | Все          | maxAge: 0 на cookie                                                 |
| `/api/auth/me`         | GET   | Auth         | Возврат safe user                                                   |
| `/api/posts`           | GET   | Auth         | Пагинация (page/limit), isLiked флаг для текущего юзера             |
| `/api/posts`           | POST  | Auth         | title + content через Zod                                           |
| `/api/posts/[id]/like` | POST  | Auth         | Toggle: если есть лайк — удалить, иначе создать. Уведомление автору |
| `/api/comments`        | GET   | Auth         | `?postId=xxx` обязателен                                            |
| `/api/comments`        | POST  | Auth         | Уведомление автору поста                                            |
| `/api/chats`           | GET   | Auth         | Только чаты где user является членом (ChatMember)                   |
| `/api/messages`        | GET   | Auth         | `?chatId=xxx`, проверка членства, возврат в хронологическом порядке |
| `/api/messages`        | POST  | Auth         | Проверка членства перед созданием                                   |
| `/api/organizations`   | GET   | Auth         | Просто список, orderBy name                                         |
| `/api/reviews`         | GET   | Auth         | `?school=VSP` опциональный фильтр                                   |
| `/api/reviews`         | POST  | STUDENT only | Проверка role === TEACHER у цели, уникальность, уведомление         |
| `/api/surveys`         | GET   | Auth         | Список                                                              |
| `/api/surveys`         | POST  | Auth         | title + url (Zod валидирует url)                                    |
| `/api/faq`             | GET   | Auth         | orderBy order asc                                                   |
| `/api/notifications`   | GET   | Auth         | only текущего юзера, take: 50                                       |
| `/api/notifications`   | PATCH | Auth         | updateMany isRead: false → true                                     |
| `/api/users`           | GET   | Auth         | `?role=TEACHER` фильтр                                              |
| `/api/profile`         | PATCH | Auth         | Только name, surname, specialty                                     |

---

## 8. ZOD СХЕМЫ ВАЛИДАЦИИ

```typescript
// src/lib/validators/schemas.ts

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  email: z.string().email().endsWith('@kazguu.kz', 'Only @kazguu.kz emails'),
  password: z.string().min(8).max(100),
  role: z.enum(['STUDENT', 'TEACHER']),
  course: z.number().int().min(1).max(6).optional().nullable(),
  school: z.enum(['VSP', 'VGSh', 'MShE', 'MShZh']),
  specialty: z.string().min(2).max(100),
  agreedToTerms: z.literal(true),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(5000),
})

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string().cuid(),
})

export const createMessageSchema = z.object({
  text: z.string().min(1).max(2000),
  chatId: z.string().cuid(),
})

export const createReviewSchema = z.object({
  teacherId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
})

export const createSurveySchema = z.object({
  title: z.string().min(3).max(200),
  link: z.string().url(),
})
```

---

## 9. КОМПОНЕНТЫ — ДЕТАЛИ РЕАЛИЗАЦИИ

### AuthProvider (client component)

```typescript
// Содержит: user, loading, logout(), refresh()
// Инициализируется с initialUser от server component (нет loading flash)
// logout() → POST /api/auth/logout → setUser(null) → router.push('/login')
// refresh() → GET /api/auth/me → setUser(data.user)
```

### LocaleProvider (client component)

```typescript
// locale: 'en' | 'ru' | 'kz', по умолчанию 'ru'
// t(key) — dot-notation: t('nav.feed') → 'Лента'
// Загружает JSON из src/locales/{locale}/common.json
```

### Sidebar

- Ширина: `w-64` (256px), только `lg+` (`hidden lg:flex`)
- Верх: логотип (иконка + "UniConnect" + "KazGUU")
- Профиль: карточка с аватаром-инициалами, именем, ролью/курсом/школой
- Навигация: 8 пунктов, активный state через `usePathname()`
- Низ: LocaleSwitcher + кнопка logout
- Активный пункт: `bg-primary-50 text-primary-700`

### MobileNav

- `fixed bottom-0`, только `< lg`
- 5 иконок: Feed, Organizations, Chats, Reviews, Notifications
- Активный state через `usePathname()`

### Button

```typescript
variant: 'primary' | 'secondary' | 'ghost' | 'danger'
size: 'sm' | 'md' | 'lg'
loading: boolean // показывает спиннер, disabled автоматически
```

### PostCard

- Оптимистичные лайки (мгновенный UI update, откат при ошибке)
- Комментарии: ленивая загрузка при первом открытии
- Роль автора: Teacher → фиолетовый badge, Student → синий + школа

### (main)/layout.tsx — ВАЖНО

Это **server component**:

```typescript
// Читает cookie через next/headers
// Делает prisma запрос для получения юзера
// Если нет юзера → redirect('/login')
// Передаёт initialUser в AuthProvider (нет клиентского loading state)
```

---

## 10. TAILWIND КОНФИГУРАЦИЯ

### Кастомные цвета (primary palette)

```javascript
colors: {
  primary: {
    50:  '#f0f4fe',
    100: '#dde6fd',
    200: '#c2d3fc',
    300: '#98b6f9',
    400: '#678ef4',
    500: '#4268ef',
    600: '#2b4ae3',   ← основной бренд-цвет
    700: '#2338d0',
    800: '#2330a9',
    900: '#222e85',
    950: '#181f52',
  }
}
```

### Кастомные утилиты в globals.css

```css
.card        { bg-white rounded-xl border border-slate-200 shadow-card }
.input-base  { w-full rounded-lg border ... focus:ring-2 focus:ring-primary-500 }
.btn-primary { bg-primary-600 text-white hover:bg-primary-700 ... }
.nav-item    { flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ... }
.badge       { inline-flex items-center px-2 py-0.5 rounded-full text-xs }
.animate-in  { animation: animateIn 0.2s ease-out forwards }
```

---

## 11. i18n СТРУКТУРА

### Ключи переводов (обязательные)

```json
{
  "nav": { "feed", "organizations", "chats", "reviews", "faq", "surveys", "notifications", "profile", "logout" },
  "auth": { "login", "register", "email", "password", "name", "surname", "role", "course", "school", "specialty", "student", "teacher", "agreeToTerms", "loginTitle", "loginSubtitle", "registerTitle", "registerSubtitle", "noAccount", "hasAccount", "emailPlaceholder", "passwordPlaceholder" },
  "feed": { "title", "newPost", "postTitle", "postContent", "publish", "like", "comment", "noPostsYet", "writeComment" },
  "organizations": { "title", "subtitle" },
  "chats": { "title", "global", "school", "specialty", "typeMessage", "send" },
  "reviews": { "title", "writeReview", "rating", "comment", "submit", "filterBySchool", "allSchools" },
  "faq": { "title", "subtitle" },
  "surveys": { "title", "addSurvey", "open", "surveyTitle", "surveyLink" },
  "notifications": { "title", "markAllRead", "noNotifications", "newMessage", "newComment", "newLike", "newReview" },
  "common": { "loading", "error", "save", "cancel", "delete", "edit", "back", "viewAll" }
}
```

---

## 12. СТРАНИЦЫ — ДЕТАЛИ

### /feed (лента)

- Пагинация: `page` + `limit=10`, кнопка "Load more"
- `handleNewPost`: prepend нового поста в массив
- `handleLike`: оптимистичный update через `setPosts(prev => prev.map(...))`
- PostCard: expandable комментарии (lazy load при первом открытии)
- CreatePostForm: collapsed → expanded по клику, кнопка отмены

### /organizations

- Поиск по name + description через filter на клиенте
- OrgCard: цветной баннер (`h-16`) + иконка (`-mt-7` overlap), описание в 3 строки (`line-clamp-3`)
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### /chats

- Разделённый layout: список чатов (160px) + панель сообщений
- Высота: `h-screen max-h-screen overflow-hidden` на контейнере
- Отправка: `onKeyDown Enter` + кнопка
- Оптимистичные сообщения: сразу добавить в UI с temp id, потом заменить реальным
- Scroll to bottom после каждого нового сообщения через `ref.current.scrollIntoView`

### /reviews

- Фильтр по школам: pill-кнопки, перезапрашивают API `?school=VSP`
- Форма отзыва: только для STUDENT, интерактивный StarRating с hover
- Список учителей загружается через `GET /api/users?role=TEACHER`

### /faq

- Accordion: один открытый элемент за раз
- Состояние: `useState<string | null>(null)` — id открытого вопроса
- Анимация chevron: `rotate-180` через transition

### /notifications

- Кнопка "Mark all read": `PATCH /api/notifications`, обновляет local state
- Иконка по типу: `NEW_LIKE → Heart`, `NEW_COMMENT → MessageCircle`, `NEW_MESSAGE → Mail`, `NEW_REVIEW → Star`
- Непрочитанные: синяя точка + фон `bg-blue-50/50`

### /profile

- Баннер: `h-28` градиент
- Аватар: `-mt-10` overlap поверх баннера
- Edit mode: inline форма (только name, surname, specialty)
- После сохранения: вызов `refresh()` из AuthContext для обновления данных

---

## 13. PRISMA SINGLETON (обязательный паттерн)

```typescript
// src/lib/db/prisma.ts
// ОБЯЗАТЕЛЬНО использовать этот паттерн в Next.js
// Иначе в dev режиме будет "too many connections"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
```

---

## 14. БЕЗОПАСНОСТЬ — ЧЕКЛИСТ

- [ ] Пароли: `bcrypt.hash(password, 12)` — cost factor именно 12
- [ ] JWT: `verifyToken` возвращает `null` при ошибке (не бросает исключение)
- [ ] Email: проверка `.endsWith('@kazguu.kz')` в Zod схеме
- [ ] Enumeration: одно сообщение "Invalid email or password" для login ошибок
- [ ] Отзывы: двойная проверка — `role === 'STUDENT'` у автора И `role === 'TEACHER'` у цели
- [ ] Сообщения: проверка `ChatMember` перед чтением и отправкой
- [ ] Секреты: только через `process.env`, никаких хардкодов
- [ ] Пароль никогда не возвращается в API ответах (используй Prisma `select`)

---

## 15. СКРИПТЫ

```bash
npm run dev          # запуск dev сервера
npm run build        # production сборка
npx prisma migrate dev --name init    # создание таблиц
npm run db:seed      # заполнение тестовыми данными
npx prisma studio    # GUI для БД
```

### Тестовые аккаунты (после seed)

| Роль    | Email                   | Пароль      |
| ------- | ----------------------- | ----------- |
| Student | aibek.student@kazguu.kz | password123 |
| Student | dana.student@kazguu.kz  | password123 |
| Teacher | prof.asanov@kazguu.kz   | password123 |
| Teacher | prof.bekova@kazguu.kz   | password123 |

---

## 16. СОГЛАШЕНИЯ ПО КОДУ

### Именование

- Компоненты: `PascalCase` (PostCard, CreatePostForm)
- Хуки: `useSomething`
- API хелперы: `camelCase`
- Константы: `UPPER_CASE` (SCHOOL_LABELS, LOCALES)
- Типы/интерфейсы: `PascalCase` (SafeUser, PostWithMeta)

### Правила

- Все файлы в TypeScript (`.ts` / `.tsx`), никакого JavaScript
- `'use client'` только там где нужны hooks или browser API
- Server components по умолчанию (особенно layouts)
- Комментарии на английском языке в коде
- Не усложнять: если можно без доп. библиотеки — без неё

### Импорты

```typescript
// Алиас @ = src/
import { prisma } from '@/lib/db/prisma'
import { getAuthUser } from '@/lib/auth/session'
import Button from '@/components/ui/Button'
```

### Структура API роута

```
1. getAuthUser() → если нет → unauthorizedResponse()
2. Парсинг searchParams / body
3. Zod валидация (try/catch)
4. Prisma запрос
5. successResponse(data)
```

---

## 17. ЧАСТЫЕ ОШИБКИ — ИЗБЕГАТЬ

| Ошибка                           | Правильно                                           |
| -------------------------------- | --------------------------------------------------- |
| `localStorage` для токена        | HttpOnly cookie через `response.cookies.set()`      |
| `useEffect` для auth в layout    | Server component читает cookie через `next/headers` |
| Несколько инстансов Prisma       | Singleton через `global.prisma`                     |
| `redirect()` в client component  | `router.push()` из `useRouter`                      |
| Возвращать поле `password`       | Всегда `select: { password: false }` или исключать  |
| `throw error` в verifyToken      | `return null` при невалидном токене                 |
| Хардкод текста                   | Всегда через `t('key')` из LocaleProvider           |
| Градиент через Tailwind `from-*` | Использовать, но проверять dark mode                |

---

## 18. РАСШИРЕНИЕ ПРОЕКТА (следующие шаги)

Когда базовый MVP работает, добавить в таком порядке:

1. **Real-time чат** → Pusher или native WebSocket через Next.js
2. **Загрузка файлов** → Uploadthing (проще всего с Next.js) → сохранять в `File` модель
3. **Верификация email** → Resend API → письмо для подтверждения аккаунта учителя
4. **Push-уведомления** → Web Push API → service worker
5. **Поиск** → PostgreSQL full-text search через Prisma `$queryRaw`
6. **Роль ADMIN** → добавить в enum Role, создать `/admin/*` роуты

---

_Этот файл — единственный источник истины для проекта UniConnect.
При любых вопросах по архитектуре — ответ здесь._
