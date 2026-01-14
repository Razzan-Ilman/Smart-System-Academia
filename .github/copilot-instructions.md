## Quick orientation

This repo is a React + TypeScript + Vite application (Tailwind + Ant Design present). There are two copies of the project inside the workspace: the top-level folder and a nested `Smart-System-Academia/` subfolder. When editing or running scripts, prefer the copy you normally open in your editor (most source files live under `Smart-System-Academia/src/`).

## How to run (essential commands)
- Install dependencies: run your package manager in the project root with `package.json` (this workspace uses npm scripts).
- Dev server (fast reload): `npm run dev` (runs `vite`).
- Build (type-check + production build): `npm run build` — this runs `tsc -b && vite build` (TypeScript project references are used).
- Lint: `npm run lint` (runs `eslint .`).
- Preview production build: `npm run preview` (runs `vite preview`).

If you see duplicate scripts or duplicated folders, check which `package.json` your editor is using — there is a mirrored `Smart-System-Academia/` subfolder containing the same scripts and configs.

## Big-picture architecture (what to read first)
- App entry: `src/main.tsx` → mounts `src/App.tsx`.
- Pages: `src/pages/` split by area: `user/` and `admin/` (e.g. `src/pages/user/Home.tsx`, `src/pages/admin/Dashboard.tsx`).
- Components: `src/components/` split similarly into `user/` and `admin/` (examples: `src/components/user/ProductCard.tsx`, `src/components/admin/Navbar.tsx`).
- Styling: Tailwind is used. Global styles are in `src/index.css` and `src/App.css`.

Why this structure: pages implement route-level screens (user vs admin), while components are UI pieces shared across pages. Look at `ProductGrid.tsx` + `ProductCard.tsx` for a typical pattern of passing props and mapping lists.

## Project-specific conventions
- File naming: React components use PascalCase and `.tsx` extension.
- Pages are grouped by role (`user` / `admin`) — add new screens to the correct folder.
- Routing: `react-router-dom` is in dependencies but the default `App.tsx` in this template mounts `Home` directly. If you add routing, update `App.tsx` (example: add `<BrowserRouter>` and `Route` entries) rather than scattering route setup across files.
- TypeScript: tsconfig uses project references (`tsconfig.app.json`, `tsconfig.node.json`). The build runs `tsc -b` — keep `tsconfig.*` in sync when adding new path aliases.

## Integration points & dependencies
- UI: `antd` + `@ant-design/icons` are available for admin/user UI.
- Router: `react-router-dom` (v7) is present—prefer centralized route setup in `App.tsx`.
- Tailwind: styling utilities are configured (see `tailwind.config.js` and `postcss.config.js`). Add classes in component JSX and keep global utility styles in `index.css`.

## Common tasks (how an agent should modify code)
- Adding a page: create `src/pages/<area>/MyPage.tsx`, export default a component, then import it in `src/App.tsx` (or add a route). Use `ProductCard` and `ProductGrid` as examples for prop types and layout.
- Adding a shared component: place under `src/components/<area>/`, name it PascalCase, add a small TypeScript interface for props and a brief JSDoc if behavior is subtle.
- Styling: prefer Tailwind classes inline in JSX; for global changes, update `src/index.css`.

## Examples to reference in code changes
- Use `src/components/user/ProductCard.tsx` for standard prop typing and structure.
- Use `src/pages/user/Home.tsx` for a typical page layout and data composition.
- Admin layouts: `src/components/admin/Navbar.tsx` and `src/pages/admin/Dashboard.tsx`.

## Linting, type-checking, and build notes
- The `build` script runs `tsc -b` first — breaking type errors will fail the build.
- Linting: `npm run lint`. If adding ESLint rules, update `eslint.config.js` (present at project root).

## Prompts & behavior guidance for AI agents
- Be conservative when changing layouts or global configs: point changes to `src/App.tsx`, `tailwind.config.js`, or `tsconfig.*` and include tests/preview steps.
- Keep changes local to one area (user/admin) unless a cross-cutting change (theme, routing, tsconfig) is required.
- When adding commands or scripts, ensure they are added to the `package.json` used by the editor workspace (there are duplicated package.json files in the repository root and the nested folder).

## Where to look for more details
- `package.json` (root and `Smart-System-Academia/`) for scripts and deps.
- `vite.config.ts`, `tailwind.config.js`, `postcss.config.js` for build and style tooling.
- `tsconfig.app.json` and `tsconfig.node.json` for TypeScript project references.

If anything above is unclear or you'd like the file to include more examples (code snippets showing how to add a page, routing patterns, or component templates), tell me which area to expand and I'll iterate.
