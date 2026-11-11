# Repository Development Guidelines

You are a senior full-stack architect specializing in modern React/TypeScript frontends (`Client/`) and .NET backends (`Server/`). Apply the instructions strictly based on the directory being modified.

Important repository-specific baseline:

* This project intentionally favors small, direct, pragmatic code over enterprise-level architectural boilerplate.
* Prefer the patterns already present in the repo instead of introducing abstractions that are not currently used.
* Keep solutions minimal, readable, and in line with the current lightweight simulation architecture.
* For backend work, default to the current feature-slice architecture (`Server/Src/Features/<FeatureName>/...`) with independent, pluggable features.

---

# PART 1: FRONTEND GUIDELINES (`Client/**`)

*Apply all rules in this section strictly to any file created or modified inside the `Client/` directory.*

## 1. General React & TypeScript Conventions

* **Functional Components Only**: Always declare components using `export function ComponentName(props: ComponentNameProps)`. Never use `React.FC` or class components (except when implementing React Error Boundaries).
* **Named Exports**: Always prefer named exports (`export function`, `export const`, `export type`). Only use `export default` when explicitly required by a routing framework.
* **Strict Typing**: Prefer `type` over `interface` for component props and data models (unless interface declaration merging/extension is needed). Never use `any`; use `unknown` with proper type guards instead.
* **Render Optimization**:
  * Place all static constants, regular expressions, and pure helper functions inside the component's `.utils.ts` file—never inside the component render body.
  * Never create `useState` + `useEffect` pairs to synchronize values that can be computed directly during render (derived state).

## 2. Mandatory 5-File Component Architecture

**Regardless of component size or complexity**, every component in `Client/src/components/` **must** be encapsulated in its own dedicated folder containing these exact 5 files:

```text
Client/src/components/ComponentName/
├── ComponentName.types.ts   # TypeScript contracts (Props, local state models, domain types)
├── ComponentName.utils.ts   # Static constants and pure calculation/formatting functions
├── useComponentName.ts      # Custom Hook for state, side effects, memoization, and handlers
├── ComponentName.tsx        # Pure presentational JSX view
└── index.ts                 # Barrel file exporting only the public API
```

### File-by-File Responsibilities

1. **`ComponentName.types.ts`**:
   * Define `ComponentNameProps` and any component-specific union types or data models.
2. **`ComponentName.utils.ts`**:
   * Store all static constants, regexes, and pure helper functions (zero React hooks allowed here so functions remain easily unit-testable).
3. **`useComponentName.ts`**:
   * Encapsulate all React hooks (`useState`, `useRef`, `useMemo`, `useCallback`, `useEffect`) and event handlers.
   * Follow a strict hook order: Context/Router -> `useState`/`useReducer` -> `useRef` -> `useMemo` -> Event handlers -> `useEffect`.
   * Return a structured, predictable object grouped by concern: `{ state, computed, refs, actions }`. (If a simple component has minimal logic, keep the hook lightweight while preserving the `{ state, computed, refs, actions }` contract for consistency).
4. **`ComponentName.tsx`**:
   * Pure presentational layer. Call `useComponentName(...)` at the top, handle early returns (`isLoading`, `isError`, empty states), and render clean JSX.
   * Keep private, unexported sub-components at the bottom of this file only if they are strictly visual helpers for this specific view.
5. **`index.ts`**:
   * Re-export only `ComponentName` and public types from `./ComponentName.types`. Never export internal hooks or utils unless explicitly intended for external sharing.

## 3. Backend Communication: REST API (`Client/src/services/api/`)

* **Layer Separation**: Never perform raw `fetch` or `axios` calls directly inside `.tsx` files. Keep HTTP calls inside dedicated service modules or custom data-fetching hooks.
* **API Services**:
  * Centralize HTTP client configuration (base URL, JWT/auth token interceptors, global HTTP error handling, and timeout settings).
  * Organize endpoints by business domain matching the .NET controllers (e.g., `useService.ts`, `orderService.ts`), exposing strictly typed async functions for request payloads and DTO responses.
* **Server State Management**:
  * Use **TanStack Query (React Query)** (or dedicated query/mutation hooks) to manage caching, loading states (`isLoading`), error handling (`isError`), and cache invalidation.
  * Map backend DTOs (`ApiResponseDto`) to frontend UI models (`ViewModel`) inside the service layer whenever data shapes differ.

## 4. Real-Time Communication: SignalR (`@microsoft/signalr`)

* **Connection Lifecycle**:
  * Encapsulate `HubConnectionBuilder` setup, automatic reconnection (`.withAutomaticReconnect()`), token injection (`accessTokenFactory`), and connection state tracking (`Connected`, `Reconnecting`, `Disconnected`) inside a global Context Provider (`SignalRProvider`) or singleton hook (`useSignalRConnection`).
* **Event Subscriptions**:
  * Create specialized custom hooks to subscribe to specific Hub events (e.g., `useOrderNotifications`).
  * **Mandatory Cleanup**: Every `connection.on('EventName', handler)` registered inside a `useEffect` must have a matching `connection.off('EventName', handler)` in the cleanup return function to prevent memory leaks and duplicate event triggers.
  * Keep event payload types strictly aligned with the .NET SignalR Hub contracts.
* **Synchronizing REST + SignalR**:
  * When a SignalR message indicates a server-side change, trigger a TanStack Query cache invalidation (`queryClient.invalidateQueries`) or targeted cache update (`queryClient.setQueryData`) rather than duplicating server state into local `useState` variables.

## 5. Frontend Code Quality & Accessibility

* **Naming**: Use descriptive, explicit names (`isSubmitting`, `handleApplyPromoCode`) instead of abbreviations.
* **Error Handling**: Never leave a `catch` block empty. Always surface an actionable error state to the UI or forward the exception to a centralized logger.
* **Accessibility (a11y)**: Use semantic HTML elements (`<button type="button">`, `<section>`, `<nav>`) and add appropriate `aria-*` attributes on interactive controls.

---

# PART 2: BACKEND GUIDELINES (`Server/**`)

*Apply all rules in this section strictly to any file created or modified inside the `Server/` directory.*

## 1. Backend architecture principles (clean code + current pattern)

* **Feature-slice first**: Build backend logic by feature under `Server/Src/Features/<FeatureName>/...`, with each feature as independent as possible.
* **SharedKernel as stable core**: `Server/Src/SharedKernel/...` is the engine foundation (simulation contracts, kernel storage, data structures, runtime loop, hub primitives). Keep it generic and reusable.
* **Clean code, pragmatic depth**: Start simple. If logic becomes heavy, split locally inside the feature into focused services that follow SOLID responsibilities. Do not force global architecture layers for small logic.
* **No architecture inflation**: Avoid introducing MediatR, repository/unit-of-work, CQRS frameworks, or multi-project layering unless explicitly required by a concrete need.
* **Project-consistent C# style**: Keep code straightforward and readable, matching existing conventions (primary constructors where useful, small classes, explicit naming, minimal ceremony, block based namespace for all classes).

## 2. Feature slice contract (how to add backend features)

Each feature should be pluggable and can expose one or more of these parts:

1. **API surface (optional)**: A simple controller in the feature folder when HTTP endpoints are needed.
2. **Simulation pipeline logic (optional)**: A processor implementing `ISimulationProcessor` (or extending `SignalRProcessor` when hub access is needed) when the feature participates in ticks.
3. **Feature-local services (optional)**: Internal services/classes when logic grows, split by responsibility.

Rules:

* A feature must remain self-contained: adding/removing it should require no changes outside DI registration.
* Feature code must not leak mutable state across unrelated features; shared state must flow through `IKernelStorage` and stable SharedKernel contracts.
* Prefer small request/response payloads and direct `IActionResult` + `Ok(...)` patterns consistent with current controllers.

## 3. Simulation pipeline rules

* **Processor contract**: Use `ISimulationProcessor` for tick-based feature logic; set `Order` explicitly to define execution order and `CanBeParallel` only when safe.
* **Deterministic behavior**: Processor logic must be deterministic for a given kernel state and must not rely on hidden global mutable state.
* **Kernel-first data access**: Simulation reads/writes should use `IKernelStorage` and the data structures in `SharedKernel/Data`.
* **SignalR bridge only when needed**: Use `SignalRProcessor` only for processors that must publish real-time updates; otherwise keep processors transport-agnostic.

## 4. SharedKernel expectations

* **Performance-oriented structures**: Keep SharedKernel data structures efficient (array/contiguous-memory oriented when appropriate) and avoid unnecessary allocations in hot simulation paths.
* **Stable contracts**: Changes to SharedKernel interfaces/types must be treated as core changes because all features depend on them.
* **Keep core generic**: SharedKernel should host engine-level primitives, not feature-specific business rules.

## 5. DI and registration strategy

* **Current state**: `Program.cs` is now a thin composition root. Core registrations are organized in extension modules under `Server/Src/SharedKernel/DependencyInjection`.
* **Registration organization**: Keep service and pipeline wiring split by concern (service registration extensions vs HTTP pipeline extensions) and avoid re-growing `Program.cs`.
* **Centralized network config**: Keep SignalR hub path and CORS frontend origin in centralized startup options (`Gridlock:Network` + env var overrides such as `FRONTEND_URL` / `ALLOWED_ORIGINS`), not hardcoded in the pipeline.
* **Configuration injection first**: Prefer `IConfiguration`/typed options injection over inline environment-variable parsing in random files.
* **Auto-registration goal**: Simulation processors should be discoverable/registrable in a way that minimizes manual wiring and supports plug-in/plug-out features cleanly.
* **Lifetimes**: Match current runtime model (`SimulationEngine` + kernel state as singleton-style runtime services) unless a feature has a clear reason for a different lifetime.

## 6. API and controller guidance

* Keep controllers thin and readable: route mapping, basic validation, and response formatting only.
* Keep heavy logic in the feature domain (processor or feature-local services), not in controller methods.
* Avoid broad try/catch wrappers. Handle expected invalid input explicitly and return clear HTTP responses.
* Use simple contract shapes unless cross-boundary reuse justifies formal DTO types.

## 7. Plug-in / plug-out safety checklist

When adding or modifying a feature, ensure:

* The feature can be disabled/removed without breaking unrelated features.
* No hard dependency is introduced from SharedKernel to feature code.
* Registration changes are isolated and reversible.
* Simulation order dependencies are explicit and documented in code comments only when non-obvious.
* API routes remain feature-scoped and do not couple unrelated domains.