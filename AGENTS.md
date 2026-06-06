# Agent workflow (FlumeTV-UI)

How Cursor and other agents should work in this repository. **Sibling API:** [FlumeTV-API/docs/backend-reference.md](../FlumeTV-API/docs/backend-reference.md) (when present locally).

---

## Decision order

1. **`design-principles.mdc`** (always on) — **YAGNI → DRY → SOLID** before adding files, abstractions, or docs.
2. **`module-folder-boundaries.mdc`** (always on) — one kind of code per folder; no type-in-utils smuggling.
3. **`frontend-reference-maintenance.mdc`** (always on) — update **`docs/frontend-reference.md`** only when shipped behavior changes.
4. **File-scoped rules** (when editing matching paths) — see table below.

When principles conflict with convenience: **YAGNI over DRY over premature SOLID**. When principles conflict with folder boundaries: **boundaries win** (they enforce DRY at the repo level).

---

## Cursor rules

| Rule                                                                                   | `alwaysApply` | Globs                | Role                                   |
| -------------------------------------------------------------------------------------- | :-----------: | -------------------- | -------------------------------------- |
| [design-principles.mdc](.cursor/rules/design-principles.mdc)                           |      yes      | —                    | Scope, extraction, layering            |
| [module-folder-boundaries.mdc](.cursor/rules/module-folder-boundaries.mdc)             |      yes      | —                    | `types/`, `utils/`, `constants/`, etc. |
| [frontend-reference-maintenance.mdc](.cursor/rules/frontend-reference-maintenance.mdc) |      yes      | —                    | Living product doc                     |
| [code-style.mdc](.cursor/rules/code-style.mdc)                                         |      no       | `**/*.{ts,tsx}`      | Imports, helpers, conditionals         |
| [naming-conventions.mdc](.cursor/rules/naming-conventions.mdc)                         |      no       | `**/*.{ts,tsx}`      | Files, keys, props                     |
| [react-next-patterns.mdc](.cursor/rules/react-next-patterns.mdc)                       |      no       | `**/*.{ts,tsx}`      | App Router, MUI, Redux, i18n           |
| [greenfield-design.mdc](.cursor/rules/greenfield-design.mdc)                           |      no       | `**/*.{ts,tsx,css}`  | Match shipped UI only                  |
| [design-system-boundary.mdc](.cursor/rules/design-system-boundary.mdc)                 |      no       | design-system, theme | Domain-neutral DS                      |
| [responsive-design.mdc](.cursor/rules/responsive-design.mdc)                           |      no       | (see rule)           | Mobile vs desktop                      |
| [date-fns-usage.mdc](.cursor/rules/date-fns-usage.mdc)                                 |      no       | (see rule)           | Dates/times                            |
| [lodash-usage.mdc](.cursor/rules/lodash-usage.mdc)                                     |      no       | (see rule)           | Lodash imports                         |

---

## Before implementing

1. Read **`docs/frontend-reference.md`** for routes, Redux/API/SSE, and deferred work — do not reintroduce removed or “not wired” behavior without intent.
2. Match existing patterns in the target layer (`containers/`, `components/design-system/`, `store/`, etc.).
3. Apply **YAGNI**: smallest change that satisfies the request; no extra env vars, providers, or types without a use today.
4. **Do not** use `temp/` or legacy trees as design reference (**`greenfield-design.mdc`**).

---

## Where code goes (summary)

Full table: **`module-folder-boundaries.mdc`** and **`docs/frontend-reference.md`** (Architecture).

| Need                           | Folder                       |
| ------------------------------ | ---------------------------- |
| Shared `type` / `interface`    | `types/*.types.ts`           |
| Runtime const / enum-as-const  | `constants/*.constants.ts`   |
| Pure function, mapper, guard   | `utils/*.utils.ts`           |
| Zod + form infer               | `validation/*.validation.ts` |
| Redux slice/thunk/selector     | `store/`                     |
| React hook                     | `hooks/use*.ts`              |
| API client, env, i18n instance | `infra/`                     |
| Screen wiring, `t()`, dispatch | `containers/`                |
| Domain-neutral UI primitive    | `components/design-system/`  |
| Product widget                 | `components/core/`           |
| User-facing copy               | `translations/`              |

Extract to `utils/` / `types/` only when **DRY** applies (second real use or same PR needs it twice) — not for one-liners (**`code-style.mdc`**).

---

## Before finishing a task

| Step                             | Command / action                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| Principles pass                  | YAGNI / DRY / SOLID quick checks in **`design-principles.mdc`**                           |
| Format + lint + types            | `npm run format:check && npm run lint && npm run typecheck`                               |
| Build (when touching app wiring) | `npm run build`                                                                           |
| Unused exports (optional)        | `npm run knip`                                                                            |
| Product doc                      | If shipped behavior changed → **`docs/frontend-reference.md`** + **`Last updated:`** date |
| Commits / PR                     | Only when the user asks                                                                   |

---

## Documentation map

| Doc                                                                               | Use                                                |
| --------------------------------------------------------------------------------- | -------------------------------------------------- |
| [docs/frontend-reference.md](docs/frontend-reference.md)                          | What the app **does** — routes, API, SSE, features |
| [README.md](README.md)                                                            | Quick start, scripts, env                          |
| [FlumeTV-API/docs/backend-reference.md](../FlumeTV-API/docs/backend-reference.md) | Server behavior, SSE payloads                      |

---

## Adding or changing rules

Use the project’s Cursor rule conventions (`.mdc` in `.cursor/rules/`, frontmatter `description` + `alwaysApply` or `globs`). Cross-link **`design-principles.mdc`** and **`AGENTS.md`** from new rules when they affect scope, layering, or finish checklist.
