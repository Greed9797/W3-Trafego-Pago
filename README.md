# W3 Tráfego Pago

Site institucional e blog editorial da W3, construído com React, TypeScript, Vite e Tailwind CSS v4.

## Desenvolvimento

```bash
npm install
npm run dev
npm run test:autoblog
npm run build
npm run lint
```

O blog está em `/blog`. O catálogo estático é o fallback; posts publicados pelo autoblog entram via `GET /api/blog`.

## Autoblog

O roteiro, migration, cron, aprovação e variáveis de ambiente estão em [docs/AUTOBLOG.md](docs/AUTOBLOG.md). O calendário de setembro fica em [docs/EDITORIAL-CALENDAR-2026-09.md](docs/EDITORIAL-CALENDAR-2026-09.md).

O sistema foi desenhado para pesquisa diária com fonte verificável e aprovação humana para updates de Google Ads/Meta Ads. Sem Supabase e tokens configurados, nenhum conteúdo é publicado automaticamente.
