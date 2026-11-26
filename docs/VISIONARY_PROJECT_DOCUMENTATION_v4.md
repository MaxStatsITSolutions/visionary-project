# VISIONARY — AI Home Transformation
## Product Requirements Document, Creative Direction & Engineering Specification

**Версия:** 4.0 · **Дата:** 18 ноември 2026 · **Статус:** работна спецификация за одобрение от ментора  
**Проект:** стажантски екипен проект · **Работна среда:** Windows, Claude Code в Claude Desktop, GitHub  
**Основно правило:** **React + TypeScript + Vite + Material UI + Formik + Supabase. Без Next.js. Без собствен backend сървър.**

> **Кратко описание:** VISIONARY е премиум уеб приложение, в което хората избират интериорен стил, качват снимки на помещения, организират лични проекти и разглеждат визуални концепции. Дизайнът е „award-caliber“, но функцията е по-важна от ефектите. Реалното AI генериране е отделен, условен етап, зависещ от одобрен доставчик и безопасна интеграция.

> **Приоритет на изискванията:** При конфликт между стари документации/промптове и тази версия важат **имейлът на ментора** и тази **v4.0**. На срещата екипът и менторът трябва да потвърдят идеята, обхвата и външното AI API.

---

## 0. Правила, които Claude Code трябва да спазва

### 0.1. Задължителни технологии от имейла

| Категория | Решение | Статус |
|---|---|---|
| Frontend | **React** | задължително |
| Език | **TypeScript** | задължително |
| Инициализация и build | **Vite**, шаблон `react-ts` | задължително |
| UI library | **Material UI (MUI)** | задължително |
| Forms | **Formik** | задължително |
| Global state | React Context / hooks; **Redux Toolkit** само при реална необходимост | условно |
| Database | **Supabase Postgres** | задължително |
| Authentication | **Supabase Auth** | задължително |
| File storage | **Supabase Storage** | използваме в проекта |
| 3D визуализации | **Three.js + React Three Fiber** | разрешено изключение |
| Интериорна генерация | Външно AI API | разрешено изключение, след одобрение |

**MUI инсталацията включва `@emotion/react` и `@emotion/styled` като официално изисквани зависимости.** Това не е самостоятелно решение за нов UI framework.

### 0.2. Изрично забранени или неразрешени без одобрение

- **Next.js**, App Router, Pages Router, Server Actions, API Routes, SSR архитектура;
- собствен backend сървър с Express, NestJS, Fastify или други framework-и;
- React Hook Form, Tailwind CSS, Chakra UI, shadcn/ui, Firebase, Prisma;
- GSAP, Lenis, Motion, React Router, Yup или други допълнителни библиотеки **без предварително одобрение от ментора**;
- Stripe, платени AI заявки и външни инфраструктурни услуги без изрично решение на екипа.

За анимациите ползваме **CSS, Web Animations API, React и разрешените 3D библиотеки**. За Formik валидираме с вградената `validate` функция (без Yup). Многоекранната навигация първоначално е в React state; за URL routing се иска одобрение на допълнителна библиотека.

### 0.3. Какво означава „без backend“

**Няма да разработваме собствен приложен backend. Има реална база данни.** React се свързва чрез `@supabase/supabase-js` с управляваните услуги на Supabase: **PostgreSQL**, Auth и Storage. Supabase по същество предоставя backend услуги и API, но не се изисква да пишем собствен сървър.

Данните и снимките **не** се пазят само в localStorage; Supabase е източникът на истината за акаунти и потребителски проекти.

---

## 1. Бизнес идея и проблем

### 1.1. Проблем

Потребителите се затрудняват да си представят как дадена стая може да изглежда след ремонт или обзавеждане. Платформите с вдъхновения показват красиви снимки, но трудно свързват тези примери с конкретното помещение и личните предпочитания.

### 1.2. Решение

VISIONARY е дигитално интериорно студио: разглеждане на идеи, интерактивни сравнения „преди/след“, избор на стил и създаване на личен проект със снимка, предпочитания и визуални примери.

### 1.3. Целева аудитория

- хора, които обмислят ремонт или преобзавеждане;
- наематели, които търсят неинвазивни дизайнерски решения;
- малки интериорни студиа и дизайнери;
- брокери и собственици, които искат по-добро представяне на интериор.

### 1.4. Бъдещ бизнес модел (не е част от стажантския MVP)

Freemium дизайн проекти, платени AI визуализации или B2B абонаменти за студиа. **Без реализирано плащане в MVP.** Бизнес моделът е хипотеза за валидиране, не доказан финансов резултат.

---

## 2. Цели и критерии за успех

**Продуктови цели:**
1. Потребител може да разгледа интериорни примери без акаунт.
2. Потребител може да се регистрира/влезе със Supabase Auth.
3. Влязъл потребител може да създаде проект чрез Formik.
4. Потребител може да качи снимка, да види проекта и да го изтрие.
5. Данните и снимките на един потребител са недостъпни за друг чрез RLS.
6. UI остава функционален на мобилни устройства и без 3D/WebGL.

**Измерими технически цели:**
- критичните потребителски потоци завършват без необработени грешки;
- преглед на 360/375/768/1024/1440px без хоризонтален overflow;
- клавиатурна навигация, видим focus и `prefers-reduced-motion`;
- ориентир за реални Core Web Vitals: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms;
- RLS проверен с **два отделни тестови акаунта**;
- визуално качество, обсъдено и одобрено от екипа, а не просто набор от ефекти.

---

## 3. Обхват на версиите

| Функция | Етап 1 — UI prototype | Етап 2 — Реален MVP | Етап 3 — условен |
|---|---|---|---|
| Landing, gallery, creative direction | да | доработка | — |
| Before/after slider | с примерни изображения | да | — |
| Formik wizard | локален преглед | Supabase save | — |
| Auth | placeholder | Supabase Auth | — |
| Лични проекти | mock | Supabase CRUD | — |
| Upload | локален preview | private Supabase Storage | — |
| 3D сцена | progressive enhancement | polish | по-сложен конфигуратор |
| AI image generation | обозначено demo | обозначено demo | API + безопасна интеграция |
| Плащания и админ панел | не | не | извън обхвата |

**Важно:** В MVP демо изображенията НЕ трябва да се представят като реално AI-генерирани от качената снимка. Ако менторът одобри сигурна външна AI интеграция, ще се актуализира scope и документацията.

---

## 4. Екрани, без Next.js и без допълнителен router

Първоначално приложението е **React Single Page Application (SPA)**. Разделите се управляват чрез локален/контекстен UI state. Не се добавя `react-router-dom`, освен ако менторът го одобри.

| Екран | Компонент | Достъп | Основна функция |
|---|---|---|---|
| Home | `HomeScreen` | публичен | история, hero, призив към действие |
| Explore | `ExploreScreen` | публичен | галерия + филтри |
| How it works | `HowItWorksScreen` | публичен | обяснение на процеса |
| Studio | `StudioScreen` | влязъл потребител за save | Formik wizard |
| My Projects | `ProjectsScreen` | влязъл | списък/CRUD |
| Project Details | `ProjectDetailsScreen` | собственик | детайли и снимка |
| Sign In | `AuthScreen` | публичен | Supabase Auth |
| Profile | `ProfileScreen` | влязъл | email, изход |
| Privacy | `PrivacyScreen` | публичен | политика за данни |

**Ограничение:** Без routing library няма автоматично отделни URL адреси за всеки екран и поведение на браузърните Back/Forward бутони. Ако deep links са задължителни, добавяне на React Router се предлага като **отделно решение за одобрение**.

---

## 5. Подробни потребителски потоци

### 5.1. Нов посетител

`Home → Explore → Before/After → Create Project CTA → Sign In → Studio`

- Премиум hero с авторски art direction, без generic dashboard appearance;
- ясни CTA бутони с логични hover/focus състояния;
- бързи анимации на текста и изображенията, работещи и без WebGL;
- semantic HTML за основната навигация, секции и бутони.

### 5.2. Регистрация / вход

`AuthScreen → Supabase magic link/OTP → auth state updated → ProjectsScreen`

- Formik управлява email полето и състоянията на формата;
- проверяваме формат и наличност на email на клиентско ниво;
- Supabase Auth обработва идентичността и сесията;
- потребителят вижда полезни успех/грешка съобщения;
- logout чрез `supabase.auth.signOut()`.

### 5.3. Нов интериорен проект

`Studio → Project details → Style → Photo → Review → Save → My Projects`

Полетата в Formik: `title`, `roomType`, `interiorStyle`, `budgetRange`, `notes`. Файлът се валидира отделно като клиентски `File` обект. Снимката се качва **само след изрично потвърждение**.

### 5.4. Проекти и изображения

`My Projects → Project Details → Edit/Remove`

- Supabase query извлича само проектите, достъпни на потребителя;
- проектът има собствен `id` и `user_id`;
- снимките са в private bucket; показват се през разрешен signed URL;
- при delete приложението изтрива storage обекта и реда, обработвайки частични грешки.

### 5.5. AI визуализация

За първата версия: **curated demo transformations** и обяснение, че е демонстрация. Реалната генерация е условна, както е описано в секция 13.

---

## 6. Creative direction и дизайн система

**Дизайнерска посока:** *Architectural calm meets computational imagination.* Неонова fintech визия не е желана; предпочитаме висококачествена архитектурна редакционна стилистика.

### 6.1. Цветове

| Token | HEX | Приложение |
|---|---|---|
| `ink` | `#191B1A` | основен текст |
| `canvas` | `#F4F1EA` | основен фон |
| `limestone` | `#D9D4C8` | вторични повърхности |
| `sage` | `#8A9A85` | акценти |
| `copper` | `#B87957` | CTA и маркировки |
| `white` | `#FFFFFF` | контрастни карти |

### 6.2. Material UI theme

- Един централен `createTheme()` във `src/theme/theme.ts`;
- MUI компоненти за forms, dialogs, cards, menus, buttons, loading и feedback;
- персонализирани MUI `sx`, `styled()` и CSS за визуална идентичност;
- desktop grid 12 колони, tablet 8, mobile 4 като дизайнерска цел;
- ясни типографски нива (editorial headings + sans body);
- hover и focus affordances, contrast checks и минимум 44px tap target за важни действия.

**Не инсталираме Tailwind, друга UI библиотека или готов AI template.**

### 6.3. Медийни материали

- реални интериорни снимки с доказуем лиценз или авторски визуализации;
- коректно означаване на демо изображения;
- before/after кадри от една и съща гледна точка;
- optimized WebP/AVIF и responsive image loading;
- избягване на подвеждащи claims за реални ремонти/генерации.

---

## 7. Анимации, 3D и performance

| Ефект | Технология | Условие |
|---|---|---|
| Hero image reveals | CSS transitions / keyframes | без промяна на layout |
| Scroll-driven transitions | IntersectionObserver + Web Animations API | semantic fallback |
| Hover/micro-interactions | MUI `sx` + CSS | работят с клавиатура |
| Before/after | React pointer и keyboard events | aria и focus |
| 3D room / hero object | Three.js + React Three Fiber | одобрено изключение |
| 3D scene helpers | Drei (само ако менторът одобри тази конкретна 3D зависимост) | опционално |

**Без GSAP, Motion и Lenis в базовия stack.** Ако по-късно менторът одобри GSAP, това ще бъде нова технологична промяна.

Правила: lazy-load на 3D сцени; ограничен device pixel ratio; компресирани текстури; прекратяване на render loop при невидим компонент; fallback image; reduced motion; без scroll hijacking. Не допускаме тежка 3D сцена да блокира критичните потоци.

---

## 8. Технологична архитектура — ОКОНЧАТЕЛНА

> **Този раздел изцяло заменя секция 8 от v1/v2/v3. Никакъв Next.js.**

### 8.1. Frontend

- **React + TypeScript**: компоненти, hooks и статично проверявани типове.
- **Vite**: dev server, local development и production `dist/` build.
- **Material UI**: основна UI система и тема.
- **Formik**: форми и state на wizard-а; custom `validate` (без допълнителна библиотека).
- **React Context / local hooks**: auth context, viewport/UI state.
- **Redux Toolkit**: използва се **само след доказана нужда** от сложен shared state.
- **Three.js / React Three Fiber**: само в изрично разрешената 3D част.
- **Supabase JS SDK**: `Auth`, таблици и `Storage` през директни API заявки от React.

### 8.2. Data flow

```text
Browser (React + TS + Vite)
          |
          +-- Material UI + Formik -> UI state / validation
          |
          +-- Supabase JS Client -------------------+
          |                                         |
          |                                Supabase managed services
          |                                ├── Auth (users + sessions)
          |                                ├── PostgreSQL (projects)
          |                                └── Storage (private photos)
          |
          +-- Three.js / React Three Fiber -> 3D visuals
          |
          +-- External AI provider (future / conditional)
                     [must not expose secret API key]
```

**Реалният security boundary е Supabase Row Level Security, не React route guard-ът.**

### 8.3. Защо няма собствен backend

CRUD заявки и Auth се изпълняват от браузъра към Supabase, но със **сървърно приложени RLS политики**. Не разработваме Express или Next API endpoints. Наличието на база данни **не** означава, че трябва да се пише отделен сървър.

### 8.4. Нужда от безопасна AI интеграция

Ако AI доставчикът изисква **таен API ключ**, браузърът не може да го пази. Един допустим технически вариант е Supabase Edge Function, но това представлява **server-side код** и трябва да получи **изрично одобрение от ментора** като изключение. Без такова одобрение оставаме с демонстрационен UI, а не публикуваме таен ключ.

---

## 9. Структура на проекта

```text
visionary/
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── VISIONARY_PROJECT_DOCUMENTATION_v4.md
│   ├── TEAM_WORKFLOW.md
│   ├── DESIGN_SYSTEM.md
│   └── SUPABASE_SETUP.md
├── public/
│   └── media/                      # лицензирани demo assets
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── gallery/
│   │   └── three/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ExploreScreen.tsx
│   │   ├── StudioScreen.tsx
│   │   ├── ProjectsScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── NavigationContext.tsx
│   ├── features/
│   │   ├── auth/
│   │   └── projects/
│   ├── lib/
│   │   └── supabase.ts
│   ├── theme/
│   │   └── theme.ts
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── migrations/                # SQL migrations, no server app
├── .env.example
├── .gitignore
├── CLAUDE.md
├── CONTRIBUTING.md
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Създаваме само необходимите файлове при съответния milestone. Не генерираме празни директории като самоцел.

---

## 10. Създаване на проекта — Windows PowerShell

### 10.1. Изисквания

- Node.js, съвместим с текущата Vite версия (проверете `vite.dev/guide/`);
- Git for Windows;
- Claude Desktop с локален Claude Code проект;
- GitHub repository и Supabase project.

### 10.2. Инициализация на НОВО празно repo

```powershell
npm create vite@latest visionary -- --template react-ts
cd visionary
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install formik @supabase/supabase-js
npm install three @react-three/fiber
npm install -D @types/three
npm run dev
```

Ако работите с **вече създаден GitHub repo**, клонирайте него и добавете Vite проекта **в същата директория** след съгласуване на съществуващите файлове. Не изпълнявайте scaffold команда, която би презаписала код на съотборник.

Опционално след одобрение за Redux Toolkit:

```powershell
npm install @reduxjs/toolkit react-redux
```

Няма команда `create-next-app`, `next dev` или инсталация на Next.js.

### 10.3. Environment configuration

`.env.example` (може да се commit-не):

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Всеки разработчик копира локално `.env.example` → `.env.local` и попълва стойностите. Vite чете `VITE_*` във frontend bundle, затова **ВСЯКА такава стойност е публична**. Не записвайте там `service_role`, `secret`, database password, SMTP ключове или AI secrets.

### 10.4. Supabase client

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(url, publishableKey);
```

### 10.5. Material UI setup

```tsx
// src/main.tsx (примерен фрагмент)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { theme } from './theme/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## 11. Supabase database schema и RLS

**Supabase PostgreSQL е действителната база данни**, не mock или localStorage.

### 11.1. Основна таблица: `public.projects`

| Поле | Тип | Предназначение |
|---|---|---|
| `id` | `uuid` | идентификатор на проект |
| `user_id` | `uuid` | собственик; препратка към `auth.users` |
| `title` | `text` | име на проект |
| `room_type` | `text` | тип помещение |
| `interior_style` | `text` | предпочитан стил |
| `budget_range` | `text` nullable | ориентировъчен диапазон |
| `notes` | `text` nullable | допълнителни бележки |
| `photo_path` | `text` nullable | private Storage object key |
| `created_at` | `timestamptz` | дата на създаване |
| `updated_at` | `timestamptz` | дата на редакция (обновява се при UPDATE) |

### 11.2. Примерна SQL миграция

> Изпълнете след review в **Supabase SQL Editor** на отделен development проект. Това е начална миграция, а не скрипт за многократно стартиране върху съществуващи таблици.

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  room_type text not null,
  interior_style text not null,
  budget_range text,
  notes text,
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_created_idx
  on public.projects (user_id, created_at desc);

alter table public.projects enable row level security;

create policy "projects_select_own" on public.projects
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "projects_insert_own" on public.projects
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "projects_update_own" on public.projects
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "projects_delete_own" on public.projects
  for delete to authenticated
  using (user_id = (select auth.uid()));
```

`updated_at` се задава от клиента при edit за MVP; при по-строги изисквания може да се добави SQL trigger след review. **Не** се дава широк публичен достъп до `projects`.

### 11.3. Проверки

1. User A създава проект и вижда само него.
2. User B вижда само собствените си проекти.
3. User B не може да отвори/промени/изтрие проект на A дори при ръчно подаден `id`.
4. Неавтентикиран потребител не може да чете/пише `projects`.
5. Изключването на UI бутон не се счита за защита; RLS трябва да отхвърля неразрешени заявки.

---

## 12. Supabase Auth, Storage и CRUD

### 12.1. Auth

- Email magic link / OTP през Supabase Auth;
- auth state се чете със `getSession()` и `onAuthStateChange()`;
- потребителските акаунти се управляват от Supabase Auth, не от нова `users` таблица с пароли;
- конфигурирайте development и production redirect URL в Supabase Dashboard;
- auth context се грижи за loading state, session, logout и protected screens.

### 12.2. Formik пример без Yup

```tsx
import { Formik, Form } from 'formik';
import { Button, TextField } from '@mui/material';

type ProjectFormValues = { title: string; roomType: string };

export function ProjectBasicsForm({ onSave }: {
  onSave: (values: ProjectFormValues) => Promise<void>;
}) {
  return (
    <Formik<ProjectFormValues>
      initialValues={{ title: '', roomType: '' }}
      validate={(values) => {
        const errors: Partial<Record<keyof ProjectFormValues, string>> = {};
        if (!values.title.trim()) errors.title = 'Въведи име';
        if (!values.roomType.trim()) errors.roomType = 'Избери помещение';
        return errors;
      }}
      onSubmit={async (values, helpers) => {
        try { await onSave(values); }
        finally { helpers.setSubmitting(false); }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <TextField name="title" label="Име" fullWidth
            value={values.title} onChange={handleChange} onBlur={handleBlur}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title} />
          <TextField name="roomType" label="Помещение" fullWidth
            value={values.roomType} onChange={handleChange} onBlur={handleBlur}
            error={Boolean(touched.roomType && errors.roomType)}
            helperText={touched.roomType && errors.roomType} />
          <Button type="submit" disabled={isSubmitting}>Запази</Button>
        </Form>
      )}
    </Formik>
  );
}
```

### 12.3. CRUD service examples

```ts
import { supabase } from '../../lib/supabase';

export async function listMyProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id,title,room_type,interior_style,photo_path,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createProject(input: {
  title: string; roomType: string; interiorStyle: string; userId: string;
}) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: input.userId,
      title: input.title,
      room_type: input.roomType,
      interior_style: input.interiorStyle,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}
```

RLS, а не `userId` от клиента, гарантира правата. Включете реална обработка на грешки, empty state и retries там, където са оправдани.

### 12.4. Private Storage

- Bucket: `room-uploads`, **private**;
- валидиране на MIME типове JPEG/PNG/WebP и максимален размер (например 10 MB);
- object key: `<auth.uid()>/<project_uuid>/<random_filename>`;
- пазим **само object key** в `projects.photo_path`;
- изображенията се показват със short-lived `createSignedUrl()`, не с public bucket;
- при изтриване проверяваме и изчистваме Storage обекта, след това реда, като отчитаме частичен неуспех.

### 12.5. Примерни Storage RLS политики

> Bucket `room-uploads` трябва да е създаден като private. Проверете семантиката на всяко правило в Supabase Dashboard преди production и тествайте с два потребителя.

```sql
create policy "users_upload_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'room-uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_read_own_folder" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'room-uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users_remove_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'room-uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
```

За upload overwrite/update ще трябва отделна `UPDATE` policy, ако решите да го поддържате. MVP **не** използва `upsert` за снимки.

---

## 13. Външно AI API — одобрено като концепция, но не като сигурна интеграция

**Разрешено изключение от списъка:** външно API за интериорни трансформации.

### 13.1. MVP режим

- избор на стил и визуални примери;
- ясно означение „Demo preview“;
- без AI заявки, докато не са определени API доставчик, цена и безопасен метод за достъп.

### 13.2. След одобрение

1. Менторът избира/одобрява AI доставчика и конкретния use case.
2. Определят се условията за поверителност, ретенция на снимки и разходи.
3. Ако ключът е secret, **не** се добавя като `VITE_*` променлива.
4. Трябва защитен посредник (например Supabase Edge Function) или доставчик, предлагащ безопасен ограничен client-side token flow.
5. Ако server-side функция е извън ограниченията на стажа, истинска генерация **не се включва**.
6. UI показва реален статус на операцията, timeout/error/retry и никога фалшив success.

Външното AI API е **единственото планирано изключение, при което може да се наложи сървърна логика**, ако менторът го одобри. Това не отменя правилото „без собствен приложен backend“ за останалия продукт.

---

## 14. State management и компоненти

**Първи избор:** локален `useState` / `useReducer` и Context за login session, тема и текущ екран. Дръжте Supabase fetch logic в отделни service функции.

**Redux Toolkit се добавя само когато:** state се споделя между много несвързани компоненти, debugging е труден или сложни потребителски потоци го изискват. Не се инсталира само защото е споменат в имейла.

**Компонентна организация:**
- atoms/controls: MUI Button, TextField, Select и тяхната брандова настройка;
- shared: AppHeader, AppFooter, LoadingState, ErrorState, EmptyState;
- features: BeforeAfterSlider, StyleSelector, ProjectCard, UploadDropzone (без нова dropzone библиотека);
- screens: Home, Explore, Studio, Projects, Auth;
- 3D: изолирани lazy-loaded компоненти.

---

## 15. Достъпност, производителност и SEO

- semantic HTML, клавиатура, labels, meaningful alt text, skip-to-content;
- `aria` стойности и keyboard arrows за before/after slider;
- `prefers-reduced-motion`, без анимации, блокиращи действията;
- оптимизация на изображения и placeholder до зареждане;
- Vite code splitting и lazy imports за тежките 3D елементи;
- analytics само с надлежна информация за потребителите и законово основание;
- основни SEO метаданни в `index.html`.

**Ограничение на React SPA:** Без SSR/SSG не обещавайте SEO поведение, идентично с Next.js. Публичните маркетингови страници могат да се индексират, но съдържанието, рендерирано само в браузъра, има по-непредвидимо SEO. Ако органичното търсене е решаващо, разгледайте това с ментора, без автоматично да сменяте технологичния stack.

---

## 16. GitHub организация и екипна работа

### 16.1. Git model

- `main` — стабилен интеграционен branch;
- `feature/landing`, `feature/studio-form`, `feature/supabase-auth`, `feature/projects`, `feature/3d-hero`;
- `fix/...`, `docs/...`, `chore/...` за поддръжка;
- всяка задача → Issue → branch → PR → review → merge.

### 16.2. Примерно разпределение за трима

| Роля | Отговорности |
|---|---|
| Creative/frontend developer | Home, MUI theme, visuals, animation, 3D hero |
| Product/UI developer | Explore, Studio, Formik, before/after |
| Data integration developer | Supabase Auth, Postgres CRUD, private Storage, RLS tests |

Всички преглеждат код и участват в QA; role ≠ постоянен silo.

### 16.3. Pull request checklist

- [ ] Свързан GitHub Issue и кратко описание.
- [ ] Не са добавени неразрешени библиотеки.
- [ ] Няма Next.js, React Hook Form, Tailwind или собствен backend.
- [ ] TypeScript/build проверки минават.
- [ ] UI е прегледан на mobile и desktop.
- [ ] При промяна на данни — RLS и ownership са проверени.
- [ ] Новите environment variables са описани в `.env.example`.
- [ ] Няма secrets, лични снимки или пароли в repo.
- [ ] Документацията е актуализирана.

### 16.4. GitHub Actions CI (минимален)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm run lint --if-present
      - run: npx tsc --noEmit -p tsconfig.app.json
      - run: npm run build
        env:
          VITE_SUPABASE_URL: https://example.supabase.co
          VITE_SUPABASE_PUBLISHABLE_KEY: sb_publishable_CI_placeholder
```

CI build uses placeholder env values only, **без real database operations**. Ако проектът няма `tsconfig.app.json` или има специфичен build setup, командите се коригират след реална проверка.

---

## 17. Сигурност и поверителност

1. **Винаги включено RLS** за таблици с лични данни и Storage.
2. Browser bundle съдържа единствено Supabase publishable key; RLS е истинският защитен слой.
3. `service_role`, secret API keys и private tokens никога не се commit-ват или поставят в `VITE_*`.
4. Частните снимки се пазят в private bucket с ограничени политики.
5. Качванията се валидират по тип/размер; клиентската проверка е UX мярка, а не пълна защита.
6. GDPR: purpose, retention/deletion policy, data export/delete requests и privacy notice трябва да бъдат уточнени, преди да се обработват лични снимки в публична среда.
7. Не допускайте реални снимки на потребители да се изпращат към AI доставчик без ясно уведомление и подходящо основание.
8. Използвайте отделни development и production проекти/настройки при реален launch.

---

## 18. Milestones и ред на работа

| Етап | Deliverable | Definition of Done |
|---|---|---|
| M0 | Одобрение на идеята и tech constraints | менторът приема scope |
| M1 | React/Vite/MUI scaffold + GitHub CI | app се стартира, build минава |
| M2 | Design system + responsive layout | theme, spacing, typography проверени |
| M3 | Homepage + Before/After | polished, accessible, mobile |
| M4 | Explore gallery | filters, states, media licenses |
| M5 | Formik Studio wizard | validate, review, local draft |
| M6 | Supabase Auth + RLS schema | два тестови акаунта, security tests |
| M7 | Projects CRUD + private Storage | create/read/update/delete/upload |
| M8 | 3D feature polish | fallback, reduced motion, performance |
| M9 | Full QA + documentation + demo | PR reviews, live deployment |
| M10 (optional) | AI provider integration | одобрена сигурност и разходи |

**Първо доказваме добър продукт, след това добавяме ефекти.** Няма паралелно изграждане на всички модули без предварително съгласувани интерфейси.

---

## 19. QA и acceptance tests

### 19.1. Функционални

- [ ] Публичната home/explore част работи без login.
- [ ] Регистрацията и входът използват реален Supabase Auth.
- [ ] Formik показва errors и блокира невалидно записване.
- [ ] Create Project записва ред в Supabase Postgres.
- [ ] Списъкът показва реални данни от Supabase.
- [ ] Upload съхранява изображение в private bucket.
- [ ] Изтриването премахва достъпния проект и обработва storage cleanup.
- [ ] User B не може да чете User A data/files, независимо от UI.
- [ ] Loading / success / empty / error states са видими и достъпни.

### 19.2. UX/визуални

- [ ] Мобилно, таблет и десктоп оформление.
- [ ] Няма хоризонтален scroll и счупени компоненти.
- [ ] Сайтът е използваем без WebGL.
- [ ] Before/after работи с keyboard и touch.
- [ ] Reduced motion е уважен.
- [ ] MUI theme е последователен на всички екрани.

### 19.3. Технически

- [ ] `npm run build` работи локално и в CI.
- [ ] TypeScript, ESLint и console са чисти от блокиращи проблеми.
- [ ] Няма забранени библиотеки.
- [ ] `.env.local` е изключен от Git.
- [ ] Не са включени платени API заявки без одобрение.

---

## 20. Как Claude Code да работи по този проект

Създайте `CLAUDE.md` в корена и използвайте следните правила:

```markdown
# VISIONARY — Claude Code Rules

Read docs/VISIONARY_PROJECT_DOCUMENTATION_v4.md first.

Strict stack:
- React, TypeScript, Vite
- Material UI
- Formik (use built-in validate; no React Hook Form)
- Supabase Postgres, Auth and private Storage
- Context/hooks; Redux Toolkit only if justified

Explicit allowed exceptions:
- Three.js / React Three Fiber for 3D
- External AI generation API, only after approval and safe integration

Do NOT introduce:
- Next.js, App Router, Pages Router, API Routes, SSR
- Tailwind, GSAP, Motion, Lenis, React Router, Yup
- Express/Nest backend, Firebase, Stripe
- Any additional runtime dependency without mentor approval

Workflow:
1. Read documentation and inspect actual repository.
2. Propose small, reviewable milestones and changes.
3. Work only on an approved feature branch/worktree.
4. Maintain strict TypeScript and MUI theme consistency.
5. Use Formik for forms, Supabase for persistent user data.
6. Verify RLS with two test users.
7. Run checks and report test results honestly.
8. Never commit secrets or destructive DB changes.
9. Never push or merge without explicit approval.
```

### Стартов prompt за Claude Desktop → Code

```text
Read docs/VISIONARY_PROJECT_DOCUMENTATION_v4.md and CLAUDE.md fully.

The internship mentor requires a strict technology list:
React + TypeScript + Vite + Material UI + Formik + Supabase
(Postgres database, Auth, Storage).
Redux Toolkit is optional if global state justifies it.
Three.js / React Three Fiber and an external interior AI API are
explicit allowed exceptions, but AI integration must be secure.

Never use Next.js, App Router, Pages Router, React Hook Form,
Tailwind, GSAP, Express or other unapproved dependencies.

We DO have a database (Supabase). We DO NOT write our own
application backend server.

Analyze the repository; identify all conflicts with v4.0;
create a concrete migration and milestone plan.
DO NOT edit or install anything before review.
```

---

## 21. Рискове, въпроси към ментора и решения

| Риск/въпрос | Действие |
|---|---|
| VISIONARY не е потвърден като идея | одобрение в началото на стажа |
| Frontend routing не е в списъка | използваме local view state; искаме одобрение при необходимост |
| Искаме по-сложни анимации като GSAP | не добавяме преди разрешение |
| AI key не може да е публичен | Edge Function само след изрично одобрение или demo |
| Частни снимки могат да изтекат | private bucket + SQL RLS + тест с 2 users |
| MUI изглежда „стандартно“ | custom theme, art direction, редакционен layout |
| Тежка 3D сцена на мобилно | lazy-load, fallback image и оптимизация |
| Различни branches имат конфликти | малки PRs, ясно разпределени модули |
| Неясни разходи за AI API | лимити, бюджет и approval преди изпълнение |

### Въпроси за следващата среща

1. Одобрявате ли VISIONARY като проект и кой е задължителният MVP?
2. Разрешавате ли React Router, ако имаме нужда от отделни URLs?
3. Разрешавате ли CSS/WAAPI за анимации и Three.js/R3F за 3D (вече споменати като изключение)?
4. За AI API може ли да използваме Supabase Edge Function, ако ключът е таен?
5. Кой създава Supabase проекта и кой има права за SQL/RLS промени?
6. Къде ще се хоства frontend и кой управлява production env variables?
7. Искате ли Redux Toolkit, или Context е достатъчен за MVP?

---

## 22. Официални учебни материали от имейла

**Основни ресурси от ментора — запазени в оригиналния им вид:**

1. Vite (React project scaffolding): https://vite.dev/guide/#scaffolding-your-first-vite-project
2. Material UI: https://mui.com/material-ui/getting-started/
3. Redux Toolkit: https://redux-toolkit.js.org/introduction/getting-started
4. Formik: https://formik.org/docs/overview
5. Supabase документация: https://supabase.com/docs
6. Supabase tutorial (YouTube): https://www.youtube.com/watch?v=_sSTzz13tVY
7. Supabase + React quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

Допълнителни официални справки:
- MUI dependencies: https://mui.com/material-ui/getting-started/installation/
- Supabase Auth + React: https://supabase.com/docs/guides/auth/quickstarts/react
- Storage RLS: https://supabase.com/docs/guides/storage/security/access-control
- Supabase publishable keys: https://supabase.com/docs/guides/getting-started/api-keys
- Formik validate API: https://formik.org/docs/guides/validation

---

## 23. История на промените

| Версия | Промяна |
|---|---|
| v1.x | Първоначална идея, включваща Next.js и пълен backend stack |
| v2.0 | Frontend-only концепция с Next.js Pages Router и Formik |
| v3.0 | React/Vite + Supabase, но с допълнителни неутвърдени UI библиотеки |
| **v4.0** | **Стриктно по имейла:** React/TS/Vite/MUI/Formik/Supabase; Redux Toolkit по необходимост; 3D и AI изключения; без Next.js и собствен backend; SQL/RLS/Storage/CI/Claude инструкции |

**Документът е готов за обсъждане и поетапна реализация; остава одобрението на ментора за конкретната идея и условните интеграции.**
