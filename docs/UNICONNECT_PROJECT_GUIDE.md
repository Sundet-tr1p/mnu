# UniConnect (MNU) — полное руководство по проекту

Этот документ описывает **как устроен проект**, **какие технологии используются**, **где реализована каждая функция** и **как это менять и запускать**. Предназначен для разработчиков и администраторов, которые сопровождают код.

---

## Содержание

1. [Кратко о продукте](#1-кратко-о-продукте)
2. [Технологический стек](#2-технологический-стек)
3. [Структура папок](#3-структура-папок)
4. [Архитектура Next.js App Router](#4-архитектура-nextjs-app-router)
5. [Переменные окружения (.env)](#5-переменные-окружения-env)
6. [База данных и Prisma](#6-база-данных-и-prisma)
7. [Аутентификация и безопасность](#7-аутентификация-и-безопасность)
8. [Многоязычность (KZ / RU / EN)](#8-многоязычность-kz--ru--en)
9. [API: полный перечень маршрутов](#9-api-полный-перечень-маршрутов)
10. [Функции по разделам UI](#10-функции-по-разделам-ui)
11. [Реалтайм (SSE)](#11-реалтайм-sse)
12. [Стили, логотип, брендинг MNU](#12-стили-логотип-брендинг-mnu)
13. [Адаптация под мобильные](#13-адаптация-под-мобильные)
14. [Скрипты npm и качество кода](#14-скрипты-npm-и-качество-кода)
15. [Типичные проблемы и решения](#15-типичные-проблемы-и-решения)
16. [Карта «где что искать»](#16-карта-где-что-искать)
17. [Важные уведомления](#17-важные-уведомления-не-про-каждый-лайкчат)
18. [Как добавить новый факультет](#18-как-добавить-новый-факультет-school)

---

## 1. Кратко о продукте

**UniConnect** — внутренняя платформа университета **MNU** (Maqsut Narikbayev University): лента, чаты по факультетам, организации (сообщества), отзывы, FAQ, опросы, уведомления, профиль.

- Доступ по корпоративной почте: домены задаются в `.env` (например `kazguu.kz` и `mnu.kz`).
- Роли пользователей в БД: **STUDENT**, **TEACHER** (enum `Role` в Prisma).
- Факультеты в данных: **VSP**, **MShZh** (enum `School`).

---

## 2. Технологический стек

| Категория | Технология | Где проявляется |
|-----------|------------|-----------------|
| Фреймворк | **Next.js 14** (App Router) | `src/app/` |
| UI | **React 18** + **TypeScript** | `*.tsx`, `tsconfig.json` |
| Стили | **Tailwind CSS** | `tailwind.config.js`, классы `className` |
| ORM | **Prisma** + **MySQL** | `prisma/schema.prisma`, `src/lib/db.ts` |
| Валидация входных данных | **Zod** | `src/lib/validators.ts` |
| JWT (совместимость с Edge) | **jose** | `src/lib/jwt.ts` |
| Хэш паролей | **bcryptjs** | `src/app/api/auth/login`, `register` |
| Линт | **ESLint** + `eslint-config-next` | `.eslintrc.json`, `npm run lint` |
| Форматирование | **Prettier** + Tailwind plugin | `.prettierrc.json`, `npm run format` |

**Языки в коде:** в основном **TypeScript** (`.ts`, `.tsx`), конфиги — **JavaScript** (например `next.config.js`, `tailwind.config.js`), стили — **CSS** (`globals.css`) + утилиты Tailwind.

**Языки интерфейса для пользователя:** **казахский (KZ)**, **русский (RU)**, **английский (EN)** — строки вынесены в `src/lib/i18n.ts`, переключение через `LocaleProvider` и `LocaleSwitcher`.

---

## 3. Структура папок

```
uni/
├── prisma/
│   ├── schema.prisma      # Модели БД
│   └── seed.ts            # Тестовые данные (пользователи, чаты, пост и т.д.)
├── public/
│   └── mnu-logo.jpeg      # Логотип MNU (статика по URL /mnu-logo.jpeg)
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Корневой layout: CSS, LocaleProvider, metadata
│   │   ├── globals.css    # Глобальные стили + утилиты (.app-background, .glass-panel)
│   │   ├── page.tsx       # Редирект: не залогинен → /login, иначе → /feed
│   │   ├── icon.jpeg      # Иконка вкладки браузера (App Router convention)
│   │   ├── (auth)/        # Группа маршрутов: login, register (без основного layout с сайдбаром)
│   │   ├── (main)/        # Основное приложение: feed, chats, profile… + layout с Sidebar
│   │   └── api/           # Route Handlers — REST API
│   ├── components/        # React-компоненты (UI, чаты, лента, сайдбар…)
│   ├── lib/               # Утилиты: db, jwt, validators, i18n, api-response
│   └── middleware.ts      # Защита страниц, редиректы по cookie JWT
├── docs/
│   └── UNICONNECT_PROJECT_GUIDE.md  # Этот файл
├── .env / .env.local      # Секреты и настройки (не коммитить секреты)
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 4. Архитектура Next.js App Router

### Страницы (`page.tsx`)

Каждый маршрут — папка с `page.tsx`. Серверные компоненты по умолчанию могут вызывать `getCurrentUser()`, Prisma и т.д.

### Layout (`layout.tsx`)

- **`src/app/layout.tsx`** — оборачивает всё приложение: подключает `globals.css`, `LocaleProvider`, задаёт `metadata` (title/description для вкладки).
- **`src/app/(main)/layout.tsx`** — для авторизованной зоны: на десктопе **Sidebar**, на мобиле **шапка + MobileNav + отступ снизу**.
- **`src/app/(auth)/layout.tsx`** — фон для страниц входа/регистрации, логотип, переключатель языка.

### API Routes (`route.ts`)

Файл `src/app/api/.../route.ts` экспортирует функции `GET`, `POST`, и т.д. — это серверные обработчики без отдельного Express.

### Группы маршрутов `(auth)` и `(main)`

Скобки в имени папки **не попадают в URL**. Это способ разделить разные layout’ы и организовать код.

---

## 5. Переменные окружения (.env)

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | Строка подключения MySQL для Prisma |
| `JWT_SECRET` | Секрет подписи JWT (в production обязателен, длинный случайный) |
| `JWT_EXPIRES_IN` | Срок жизни токена (например `7d`) |
| `NEXT_PUBLIC_APP_URL` | Публичный URL приложения (для ссылок, если понадобится) |
| `ALLOWED_EMAIL_DOMAINS` | Список доменов почты через запятую, например `kazguu.kz,mnu.kz` |
| `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS` | То же для клиента (если нужно показать подсказку на фронте) |

**Где читается:** валидация регистрации — `src/lib/validators.ts` (разбор списка доменов).

**Важно:** не коммить реальные пароли БД и секреты в git. Использовать `.env.local` локально и `.env.example` как шаблон.

---

## 6. База данных и Prisma

- **Схема:** `prisma/schema.prisma`  
  Модели: `User`, `Post`, `Comment`, `Like`, `Organization`, `Chat`, `ChatMember`, `Message`, `Review`, `Survey`, `Faq`, `Notification`, `File`.

- **Клиент:** `src/lib/db.ts` — один экземпляр `PrismaClient` с кэшем в dev (глобальный), чтобы не плодить соединения.

- **Миграции / синхронизация:**  
  В разработке часто используют `npx prisma db push` (синхронизация схемы с БД). Для продакшена предпочтительны миграции `prisma migrate`.

- **Сиды:** `npm run db:seed` → `prisma/seed.ts`  
  Создаёт тестовых студента/преподавателя, общий чат, факультетные чаты, пост, организацию, FAQ, опрос и т.д.

### Связь с бизнес-логикой

- **Реалтайм чатов** не хранит отдельную таблицу «подписок» — доступ к чату через `ChatMember`.
- **Факультетные чаты** — отдельные записи `Chat` с фиксированными id вида `school-chat-VSP`, `school-chat-MShZh`; пользователь добавляется при регистрации и при `GET /api/chats`.

---

## 7. Аутентификация и безопасность

### Поток

1. **Регистрация** `POST /api/auth/register` — проверка Zod, хэш пароля, создание пользователя, добавление в чаты, `createToken` (jose), установка **HttpOnly cookie** `token`.
2. **Вход** `POST /api/auth/login` — проверка пароля, та же cookie.
3. **Выход** `POST /api/auth/logout` — очистка cookie (с корректными опциями).
4. **Текущий пользователь** `GET /api/auth/me` — читает cookie, проверяет JWT, отдаёт профиль из БД.

### Файлы

- `src/lib/jwt.ts` — `createToken`, `verifyToken`, `getAuthCookieOptions`, `getCurrentUser` (для Server Components).
- `src/lib/auth-api.ts` — `getAuthUser()` для Route Handlers (через `cookies()`).
- `src/middleware.ts` — для защищённых путей проверяет JWT; если нет токена — редирект на `/login`.

### Почему jose

`middleware` в Next.js работает в **Edge Runtime**. Классическая библиотека `jsonwebtoken` там не подходит; **jose** используется для подписи и проверки JWT в совместимом режиме.

---

## 8. Многоязычность (KZ / RU / EN)

### Как сделано

Это **не** i18next и не файлы `.json` по локалям — используется **словарь в одном файле** TypeScript:

- **`src/lib/i18n.ts`** — объект `translations`: у каждого ключа три строки `kz`, `ru`, `en`.
- **`src/components/layout/LocaleProvider.tsx`** — React Context: текущая локаль, `localStorage` ключ `uniconnect-locale`, функция `t('ключ')`.
- **`src/components/layout/LocaleSwitcher.tsx`** — кнопки KZ / RU / EN.

### Как добавить новую фразу

1. Добавить ключ в `translations` в `src/lib/i18n.ts` с тремя языками.
2. В компоненте: `const { t } = useLocale();` и `t('yourKey')` (только в клиентских компонентах с `'use client'`).

### Где уже переведено

В первую очередь: сайдбар, мобильная навигация, страницы входа/регистрации (часть заголовков и полей). Остальные страницы (лента, FAQ и т.д.) могут содержать русский текст прямо в JSX — при необходимости переносите строки в `i18n.ts` по тому же шаблону.

---

## 9. API: полный перечень маршрутов

| Метод | Путь | Назначение |
|-------|------|------------|
| POST | `/api/auth/register` | Регистрация (email, пароль, имя, фамилия, роль, факультет) |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/posts` | Список постов |
| POST | `/api/posts` | Создать пост (нужен JWT) |
| POST | `/api/posts/[id]/like` | Лайк поста |
| POST | `/api/comments` | Комментарий к посту |
| GET | `/api/chats` | Список чатов пользователя + автодобавление в общий/факультетский чат |
| GET/POST | `/api/messages` | Сообщения чата (GET с `?chatId=`) / отправка |
| GET | `/api/messages/stream` | SSE: новые сообщения в чате (`?chatId=`) |
| GET | `/api/organizations` | Список организаций |
| POST | `/api/organizations` | Создать организацию |
| GET | `/api/organizations/stream` | SSE: новые организации |
| GET | `/api/faq` | FAQ |
| GET | `/api/surveys` | Опросы |
| GET | `/api/notifications` | Уведомления |
| GET/PUT/PATCH* | `/api/profile` | Профиль (смотреть в файле) |
| GET | `/api/reviews` | Отзывы |
| GET | `/api/users` | Пользователи (например, фильтр по роли) |

`*` точные методы — в соответствующем `route.ts`.

---

## 10. Функции по разделам UI

| URL | Файл страницы | Клиент / сервер | Суть |
|-----|---------------|-----------------|------|
| `/` | `src/app/page.tsx` | Server | Редирект на `/login` или `/feed` |
| `/login` | `(auth)/login/page.tsx` | Client | Форма входа, fetch к `/api/auth/login` |
| `/register` | `(auth)/register/page.tsx` | Client | Форма: роль, факультет, домены из validators |
| `/feed` | `(main)/feed/page.tsx` + `FeedClient` | Смешанно | Лента постов, фильтр по факультету автора, создание поста |
| `/chats` | `(main)/chats/page.tsx` + `ChatsClient` | Client | Список чатов, сообщения, SSE, отправка |
| `/organizations` | `(main)/organizations/page.tsx` + `OrganizationsClient` | Смешанно | Список сообществ, форма создания, SSE |
| `/profile` | `(main)/profile/page.tsx` | Server | Профиль |
| `/reviews`, `/faq`, `/surveys`, `/notifications` | соответствующие `page.tsx` | — | См. API выше |

### Регистрация: роль и факультет

- Поля в форме: `src/app/(auth)/register/page.tsx`.
- Схема Zod: `src/lib/validators.ts` — `registerSchema` включает `role`, `school`.
- Сохранение и чаты: `src/app/api/auth/register/route.ts` — после создания пользователя добавление в `seed-chat-global` и `school-chat-{VSP|MShZh}`.

---

## 11. Реалтайм (SSE)

Идея: **Server-Sent Events** — браузер открывает долгий GET к `/api/.../stream`, сервер периодически опрашивает БД и шлёт события `messages` / `organizations`.

| Файл | Роль |
|------|------|
| `src/app/api/messages/stream/route.ts` | Стрим новых сообщений по `chatId` |
| `src/app/api/organizations/stream/route.ts` | Стрим новых записей `Organization` |
| `src/components/chats/ChatsClient.tsx` | `EventSource` на messages stream |
| `src/components/organizations/OrganizationsClient.tsx` | `EventSource` на organizations stream |

**Ограничение:** это не WebSocket; для очень высокой нагрузки обычно переходят на Redis Pub/Sub или отдельный WS-сервер.

---

## 12. Стили, логотип, брендинг MNU

- **Глобальные стили:** `src/app/globals.css` — классы `.app-background`, `.glass-panel`, анимации.
- **Tailwind:** утилиты в JSX; конфиг `tailwind.config.js` (цвет `primary` и т.д.).
- **Логотип:** файл `public/mnu-logo.jpeg` → в коде `src="/mnu-logo.jpeg"`.  
  Иконка вкладки: `src/app/icon.jpeg` (скопированный логотип; Next подхватывает автоматически).
- **Компоненты UI:** `src/components/ui/` — Button, Card, Input.

---

## 13. Адаптация под мобильные

- **`src/app/(main)/layout.tsx`:**  
  - `md:` — сайдбар только на средних и больших экранах.  
  - На мобиле: верхняя панель с логотипом и `LocaleSwitcher`, контент с `pb-20` для нижней навигации.  
  - `MobileNav` — фиксированная нижняя панель (`md:hidden`).
- **`src/components/chats/ChatsClient.tsx`:** на узком экране список чатов — горизонтальный скролл; высота области чата под учётом шапки и нижнего меню.

---

## 14. Скрипты npm и качество кода

| Команда | Действие |
|---------|----------|
| `npm run dev` | Разработка, http://localhost:3000 |
| `npm run build` | Production-сборка |
| `npm start` | Запуск после `build` |
| `npm run lint` | ESLint (Next) |
| `npm run format` | Prettier по проекту |
| `npm run db:seed` | Заполнение БД тестовыми данными |

---

## 15. Типичные проблемы и решения

| Симптом | Что сделать |
|---------|-------------|
| `Cannot find module './xx.js'` в dev | Удалить папку `.next`, перезапустить `npm run dev` |
| Ошибка Prisma `EPERM` при generate | Закрыть все процессы `node`, повторить `npx prisma generate` |
| Стили/картинка 404 | Проверить наличие файла в `public/` и путь `/имя-файла` |
| Порт 3000 занят | Другой процесс или второй `next dev`; освободить порт или использовать `next dev -p 3001` |
| Логотип не виден | Убедиться что `public/mnu-logo.jpeg` существует, жёсткое обновление Ctrl+F5 |

---

## 16. Карта «где что искать»

| Задача | Файл |
|--------|------|
| Поменять тексты KZ/RU/EN | `src/lib/i18n.ts` |
| Поменять домены почты | `.env` → `ALLOWED_EMAIL_DOMAINS`, логика в `src/lib/validators.ts` |
| Поменять меню | `src/components/Sidebar.tsx`, `src/components/layout/MobileNav.tsx` |
| Поменять правила JWT/cookie | `src/lib/jwt.ts` |
| Защита маршрутов | `src/middleware.ts` |
| Новая модель БД | `prisma/schema.prisma` → затем `prisma generate` / миграции |
| Тестовые пользователи и данные | `prisma/seed.ts` |
| Новый API endpoint | `src/app/api/<имя>/route.ts` |
| Реалтайм для новой сущности | По образцу `messages/stream` или `organizations/stream` |

---

## 17. Важные уведомления (не про каждый лайк/чат)

**Идея:** в разделе «Уведомления» показываются только **события портала**, а не личные триггеры (лайки, комментарии, сообщения в чате, отзывы преподавателю).

### Типы в Prisma (`NotificationType`)

- `NEW_ORGANIZATION` — создано новое сообщество (организация).
- `FAQ_UPDATED` — добавлен или изменён пункт FAQ (делает **преподаватель** через API).
- `SURVEY_UPDATED` — добавлен или изменён опрос (делает **преподаватель** через API).

Старые значения `NEW_MESSAGE`, `NEW_LIKE`, `NEW_COMMENT`, `NEW_REVIEW` в enum остаются для совместимости со старыми строками в БД, но **новые такие уведомления больше не создаются**.

### Где создаётся рассылка

- `src/lib/notify-important.ts` — функция `notifyAllUsersImportant`: создаёт по одной записи `Notification` **каждому пользователю**.
- `POST /api/organizations` — после создания сообщества вызывается рассылка.
- `POST` и `PATCH /api/faq` — только `role === TEACHER`, после успеха — рассылка `FAQ_UPDATED`.
- `POST` и `PATCH /api/surveys` — только преподаватель, после успеха — рассылка `SURVEY_UPDATED`.

### Фильтр в API и на странице

- `GET /api/notifications` и страница `src/app/(main)/notifications/page.tsx` выбирают только типы из `IMPORTANT_NOTIFICATION_TYPES` в `src/lib/notify-important.ts`.

### Как добавить FAQ/опрос программно (преподаватель)

Примеры тел запросов (нужна cookie сессии преподавателя):

```http
POST /api/faq
Content-Type: application/json

{"question":"Как получить справку?","answer":"Обратитесь в деканат.","order":10}
```

```http
PATCH /api/faq
Content-Type: application/json

{"id":"<id из БД>","question":"Новый текст вопроса"}
```

```http
POST /api/surveys
Content-Type: application/json

{"title":"Опрос о столовой","link":"https://forms.example/..."}
```

```http
PATCH /api/surveys
Content-Type: application/json

{"id":"<id>","title":"Обновлённое название"}
```

*(В интерфейсе пока может не быть форм — вызовы идут через Postman/Thunder Client или позже можно добавить админ-страницы.)*

---

## 18. Как добавить новый факультет (School)

Факультет в коде — это enum **`School`** в `prisma/schema.prisma` (сейчас `VSP`, `MShZh`). Чтобы добавить, например, `LAW`:

1. **Prisma** — в `enum School { ... }` добавить значение `LAW` (латиница, без пробелов, как принято в enum).
2. **Синхронизация БД:** `npx prisma db push` или миграция `prisma migrate dev`.
3. **Клиент:** `npx prisma generate`.
4. **Валидация регистрации и профиля** — в `src/lib/validators.ts` в `registerSchema` и `profileUpdateSchema` расширить `z.enum([...])` новым значением.
5. **Чат факультета** — в `src/app/api/auth/register/route.ts` и `src/app/api/chats/route.ts` уже используется id `school-chat-${school}`; для нового факультета чат создастся автоматически при первом заходе/регистрации.
6. **Сид (опционально)** — в `prisma/seed.ts` добавить `upsert` чата `school-chat-LAW` и участников при необходимости.
7. **Лента** — в `src/components/feed/FeedClient.tsx` массив фильтров `schools` дополнить новым кодом, если нужен фильтр по факультету в UI.

После изменений перезапустить `npm run dev` и при необходимости снова выполнить `npm run db:seed`.

---

## Заключение

Проект построен как **монолит Next.js**: UI и API в одном репозитории, данные в **MySQL** через **Prisma**, доступ по **JWT в cookie**, мультиязычность через **собственный словарь i18n**, обновления чатов и сообществ в **реальном времени** через **SSE**.

Если нужно расширить документ (например, схемы последовательности для регистрации или диаграмма БД), скажи — можно добавить отдельный раздел или Mermaid-диаграммы в этот же файл.
