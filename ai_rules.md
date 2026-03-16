# AI Development Rules — React / Next.js / Supabase

## 1. Architecture Rules

1. Always follow **feature-based architecture**.
2. Every business domain must exist inside `/features`.
3. Features must be **fully isolated** from each other.
4. Cross-feature imports are **not allowed**.
5. Shared logic must be placed only in `/shared`.
6. Pages must only **compose features**, never implement business logic.
7. Layouts must contain only layout structure and UI composition.
8. Business logic must never exist inside pages or layouts.

---

## 2. Folder Responsibilities

### `/app`

Global application configuration.

* `router` → Application routing
* `providers` → React providers (Theme, QueryClient, Auth, etc.)
* `store` → Global state if required

Rules:

* No UI components
* No feature logic
* Only application-level setup

---

### `/features/<feature-name>`

Every feature must follow this structure.

```
feature/
 ├── components/
 ├── hooks/
 ├── services/
 ├── types/
 └── index.ts
```

#### `components/`

* UI components related only to this feature
* Must not contain API logic
* Must remain reusable within the feature

#### `hooks/`

* Feature state management
* Data fetching hooks
* Business logic hooks

Example:

```
useTodos.ts
useCreateTodo.ts
useDeleteTodo.ts
```

#### `services/`

* API calls
* Supabase queries
* External integrations

Services must be **pure functions**.

#### `types/`

* TypeScript types
* Interfaces
* DTO definitions

#### `index.ts`

Public API of the feature.

Only export:

```
components
hooks
types
```

Services must **not be exported outside the feature**.

---

## 3. Shared Layer Rules

### `/shared/components`

Reusable UI components.

Examples:

```
Button
Modal
Input
Loader
Card
```

Rules:

* No business logic
* No feature dependency
* Fully reusable

---

### `/shared/hooks`

Generic reusable hooks.

Examples:

```
useDebounce
useLocalStorage
useClickOutside
```

Rules:

* Must not depend on any feature
* Must remain framework-safe

---

### `/shared/utils`

Pure helper functions.

Examples:

```
formatDate.ts
generateId.ts
debounce.ts
```

Rules:

* Pure functions only
* No side effects

---

### `/shared/constants`

Global constants.

Examples:

```
routes.ts
queryKeys.ts
env.ts
```

---

## 4. Component Rules

1. Components must be **small and single responsibility**.
2. Maximum **200 lines per component**.
3. Extract logic into hooks if component grows.
4. No API calls inside components.
5. No business logic inside components.
6. Components should only manage UI.

Example separation:

```
component → UI
hook → state + logic
service → API
```

---

## 5. Hook Rules

Hooks must contain:

* State
* Business logic
* Data fetching
* Mutation logic

Hooks must not contain:

* UI
* JSX

Example naming:

```
useAuth
useTodos
useCreateTodo
useUpdateTodo
```

---

## 6. Supabase Rules

All Supabase logic must live in:

```
features/<feature>/services/
```

Example:

```
features/todo/services/todo.service.ts
```

Rules:

1. Never call Supabase directly in components.
2. Never call Supabase inside pages.
3. Only services interact with Supabase.

Example pattern:

```
component
   ↓
hook
   ↓
service
   ↓
supabase
```

---

## 7. Import Rules

Correct import order:

```
1. React
2. External libraries
3. App layer
4. Feature layer
5. Shared layer
6. Relative imports
```

Example:

```
import React from "react"
import { useQuery } from "@tanstack/react-query"

import { useTodos } from "@/features/todo"
import { Button } from "@/shared/components"
```

---

## 8. State Management Rules

Preferred priority:

```
1. Server State → React Query
2. Feature State → Custom Hooks
3. Global State → Zustand / Context
```

Rules:

* Avoid unnecessary global state
* Keep state as close as possible to feature

---

## 9. Next.js Rules

### Server Components (default)

Use for:

* Data fetching
* Static content
* SEO pages

### Client Components

Use only when required:

```
"use client"
```

Allowed for:

* Interactive UI
* Event handlers
* Local state

---

## 10. Naming Conventions

### Components

```
TodoCard.tsx
AuthForm.tsx
UserAvatar.tsx
```

### Hooks

```
useTodos.ts
useAuth.ts
useDebounce.ts
```

### Services

```
todo.service.ts
auth.service.ts
user.service.ts
```

### Types

```
todo.types.ts
auth.types.ts
user.types.ts
```

---

## 11. Code Quality Rules

1. Always use **TypeScript strict mode**.
2. Avoid `any`.
3. Use **ESLint + Prettier**.
4. Use **absolute imports**.
5. Write **pure functions** whenever possible.

---

## 12. Performance Rules

1. Use `React.memo` for expensive components.
2. Use `useCallback` for stable handlers.
3. Use `useMemo` for derived values.
4. Avoid unnecessary re-renders.
5. Lazy load large components.

Example:

```
const HeavyComponent = React.lazy(() => import("./HeavyComponent"))
```

---

## 13. API Layer Pattern

Standard flow:

```
Component
   ↓
Hook
   ↓
Service
   ↓
Supabase
```

Example:

```
TodoPage
  ↓
useTodos
  ↓
todo.service.ts
  ↓
supabase.from("todos")
```

---

## 14. Forbidden Patterns

Never do the following:

❌ API calls in components
❌ Business logic in pages
❌ Feature importing another feature
❌ Supabase calls outside services
❌ Global state for feature-only logic
❌ Large components (>200 lines)

---

## 15. Testing Rules

Test levels:

```
1. Services
2. Hooks
3. Components
```

Recommended tools:

```
Vitest
Testing Library
MSW
```

---

## 16. File Size Rules

```
Component → max 200 lines
Hook → max 150 lines
Service → max 100 lines
```

If exceeded → split into smaller modules.

---

## 17. Export Rules

Feature exports must happen only through:

```
features/<feature>/index.ts
```

Example:

```
export * from "./components"
export * from "./hooks"
export * from "./types"
```

Never export services outside the feature.

---

## 18. Development Principles

Always follow:

```
Modularity
Isolation
Reusability
Scalability
Testability
```

Architecture goal:

```
Features are independent modules.
Shared layer is reusable infrastructure.
App layer wires everything together.
```
