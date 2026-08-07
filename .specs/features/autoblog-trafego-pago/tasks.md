# Autoblog de Tráfego Pago — Tasks

## Execution Protocol

Implementar estas tarefas com `tlc-spec-driven`: ciclo por tarefa (implementar → gate → revisão de adequação → commit), sem publicar conteúdo ou segredos. Cada tarefa deve ser commitada separadamente.

**Design**: `.specs/features/autoblog-trafego-pago/design.md`
**Status**: Done

## Test Coverage Matrix

> Proveniência: `AGENTS.md` exige verificação; o repositório não possui testes existentes, config de cobertura ou CI de testes. Foi aplicado o default forte da skill para domínio e rotas. O gate existente é `npm run build` + `npm run lint`; será acrescentado `npm run test:autoblog`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| --- | --- | --- | --- | --- |
| Domain/calendar/parser | unit (`node:test`) | Todos os branches relevantes e 1:1 com AC-01/02/05/06/07 | `tests/*.test.ts` | `npm run test:autoblog` |
| Route/auth/persistence adapters | unit + handler contract | Happy path, auth/config/error/idempotency para cada rota | `tests/*.test.ts` | `npm run test:autoblog` |
| Supabase schema/config | none | Build/lint e inspeção SQL | `supabase/migrations/*.sql` | Build gate |
| React visual identity | manual/Playwright | `/blog` e artigo desktop/mobile | `src/components/BlogPage.tsx` | `npm run build` + visual-check |

## Gate Check Commands

| Gate Level | When to Use | Command |
| --- | --- | --- |
| Quick | Tarefa com domínio/testes | `npm run test:autoblog` |
| Full | Tarefa com endpoint/integração | `npm run test:autoblog && npm run build` |
| Build | Fim de fase/feature | `npm run test:autoblog && npm run build && npm run lint` |

## Execution Plan

### Phase 1: Contract and editorial data

`T1 → T2`

### Phase 2: Persistence and daily pipeline

`T3 → T4 → T5`

### Phase 3: Public integration and visual identity

`T6 → T7`

### Phase 4: Production configuration and validation

`T8`

## Task Breakdown

### T1: Freeze TLC feature contract

**What**: Criar especificação, contexto, design e estado do projeto.
**Where**: `.specs/STATE.md`, `.specs/features/autoblog-trafego-pago/{spec,context,design}.md`
**Depends on**: None
**Requirement**: BLOG-01, CAL-01, AUTO-01, DATA-01
**Tests**: none
**Gate**: build
**Status**: done

### T2: Add editorial calendar and keyword roadmap

**What**: Criar tipos e gerador determinístico dos 90 slots de setembro, com seeds de pauta e distinção explícita entre seed editorial e sinal diário.
**Where**: `src/lib/editorial-calendar.ts`, `tests/editorial-calendar.test.ts`, `docs/EDITORIAL-CALENDAR-2026-09.md`
**Depends on**: T1
**Requirement**: CAL-01, CAL-02
**Tests**: unit
**Gate**: quick
**Status**: done

### T3: Add Supabase schema and server contracts

**What**: Criar schema SQL com RLS, índices e contratos server-side sem instalar SDK.
**Where**: `supabase/migrations/001_autoblog.sql`, `api/_lib/autoblog.ts`, `tests/autoblog-domain.test.ts`
**Depends on**: T2
**Requirement**: DATA-01, DATA-02
**Tests**: unit
**Gate**: full
**Status**: done

### T4: Implement protected daily research cron

**What**: Implementar parser de feed, coleta de sinais oficiais, lock/idempotência e criação de draft de update.
**Where**: `api/cron/autoblog.ts`, `tests/autoblog-cron.test.ts`
**Depends on**: T3
**Requirement**: AUTO-01, AUTO-02, AUTO-03, AUTO-04
**Tests**: unit + handler contract
**Gate**: full
**Status**: done

### T5: Implement protected draft approval

**What**: Implementar endpoint administrativo que valida e publica apenas drafts autorizados.
**Where**: `api/admin/autoblog/approve.ts`, `tests/autoblog-approval.test.ts`
**Depends on**: T3
**Requirement**: AUTO-05
**Tests**: unit + handler contract
**Gate**: full
**Status**: done

### T6: Expose published content with fallback

**What**: Criar endpoint público e hidratar o catálogo React sem quebrar o fallback estático nem duplicar slugs.
**Where**: `api/blog.ts`, `src/components/BlogPage.tsx`, `tests/blog-public.test.ts`
**Depends on**: T4, T5
**Requirement**: DATA-02, AC-10
**Tests**: unit + handler contract
**Gate**: full
**Status**: done

### T7: Refine standard blog visual identity and SEO

**What**: Ajustar hierarquia editorial, contadores/destaques/CTA e metadata para o blog de tráfego pago; manter acessibilidade e identidade W3.
**Where**: `src/components/BlogPage.tsx`, `src/lib/seo.ts`, `public/sitemap.xml`, `tests/blog-seo.test.ts`
**Depends on**: T6
**Requirement**: BLOG-01, SEO-01
**Tests**: none (manual/visual)
**Gate**: build
**Status**: done

### T8: Wire production configuration and complete gates

**What**: Configurar cron diário, exemplo de variáveis, documentação operacional e executar validação visual/funcional final.
**Where**: `vercel.json`, `.env.example`, `docs/AUTOBLOG.md`, `README.md`, `.specs/features/autoblog-trafego-pago/tasks.md`
**Depends on**: T7
**Requirement**: AUTO-01, DATA-02, SEO-01
**Tests**: none
**Gate**: build
**Status**: done

## Cross-checks

### Dependency diagram cross-check

| Task | Declared dependencies | Diagram relation | Result |
| --- | --- | --- | --- |
| T1 | none | phase root | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | T2 | T2 → T3 | ✅ |
| T4 | T3 | T3 → T4 | ✅ |
| T5 | T3 | T3 → T5 | ✅ |
| T6 | T4, T5 | T4/T5 → T6 | ✅ |
| T7 | T6 | T6 → T7 | ✅ |
| T8 | T7 | T7 → T8 | ✅ |

### Test co-location validation

| Task | Tests field | Matrix layer | Result |
| --- | --- | --- | --- |
| T2 | unit | Domain/calendar | ✅ |
| T3 | unit | Domain/schema contract | ✅ |
| T4 | unit + handler | Route/cron | ✅ |
| T5 | unit + handler | Route/admin | ✅ |
| T6 | unit + handler | Route/public | ✅ |
| T7 | none/manual | React visual | ✅ |
| T8 | none/build | Config/docs | ✅ |

## Commit sequence

1. `docs(autoblog): define editorial automation contract`
2. `feat(editorial): add september content roadmap`
3. `feat(autoblog): add supabase schema and domain contracts`
4. `feat(autoblog): add protected daily research cron`
5. `feat(autoblog): add protected draft approval`
6. `feat(blog): hydrate published posts with static fallback`
7. `style(blog): refine editorial identity and metadata`
8. `chore(autoblog): configure cron and operations docs`
