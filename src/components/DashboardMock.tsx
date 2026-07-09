import {
  Home,
  ChartNoAxesColumn,
  FileText,
  MousePointerClick,
  BarChart3,
  Settings,
} from 'lucide-react'

const ORANGE = 'hsl(25 95% 53%)'

const KPIS = [
  { label: 'ROAS', value: '7,8', suffix: '' },
  { label: 'Faturamento', value: 'R$ 124,5', suffix: 'mil' },
  { label: 'CPA', value: 'R$ 24,18', suffix: '' },
  { label: 'Investimento', value: 'R$ 16,0', suffix: 'mil' },
]

const CHANNELS = [
  { name: 'Meta', h: 58 },
  { name: 'Google', h: 70 },
  { name: 'TikTok', h: 100 },
]

const ROWS = [
  { name: 'Campanha 1', ok: true, ctr: '2,5%', cpc: 'R$ 0,50', cpa: 'R$ 0,50' },
  { name: 'Campanha 2', ok: false, ctr: '3,1%', cpc: 'R$ 0,85', cpa: 'R$ 0,65' },
  { name: 'Campanha 3', ok: true, ctr: '1,8%', cpc: 'R$ 0,80', cpa: 'R$ 0,80' },
  { name: 'Campanha 4', ok: false, ctr: '2,2%', cpc: 'R$ 0,60', cpa: 'R$ 0,60' },
]

const SIDEBAR = [Home, ChartNoAxesColumn, FileText, MousePointerClick, BarChart3]

const LINE =
  'M0,118 L48,110 L92,98 L130,104 L172,86 L214,80 L258,66 L300,72 L344,50 L388,40 L432,48 L478,26 L520,18 L560,10'

function Sparkline() {
  return (
    <svg viewBox="0 0 44 18" className="h-3.5 w-10 shrink-0" fill="none" aria-hidden>
      <path
        d="M0,13 L8,9 L15,11 L22,5 L30,8 L37,3 L44,6"
        stroke={ORANGE}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DashboardMock() {
  return (
    <div className="font-poppins flex w-full overflow-hidden rounded-lg bg-[#0b0b0d] md:rounded-xl">
      {/* Sidebar */}
      <aside className="hidden w-14 shrink-0 flex-col items-center gap-6 border-r border-white/[0.06] py-5 sm:flex">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-poppins text-sm font-bold text-primary-foreground">
          W3
        </div>
        <nav className="flex flex-col items-center gap-5 pt-2">
          {SIDEBAR.map((Icon, i) => (
            <Icon key={i} className={`size-[18px] ${i === 0 ? 'text-foreground/70' : 'text-foreground/30'}`} />
          ))}
        </nav>
        <Settings className="mt-auto size-[18px] text-foreground/30" />
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <div className="font-poppins text-lg font-bold tracking-tight text-foreground md:text-2xl">
            W3 Relatórios
          </div>
          <BarChart3 className="size-5 text-foreground/30" />
        </div>

        {/* KPIs */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 md:mb-5 md:grid-cols-4 md:gap-3">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 md:p-3.5">
              <div className="mb-1.5 font-poppins text-[10px] text-foreground/55 md:text-xs">{k.label}</div>
              <div className="flex items-center justify-between gap-1">
                <span className="font-poppins text-base font-bold leading-none text-foreground md:text-xl">
                  {k.value}
                  {k.suffix && <span className="ml-0.5 text-[10px] font-medium text-foreground/45">{k.suffix}</span>}
                </span>
                <Sparkline />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:mb-5 md:grid-cols-[1.7fr_1fr]">
          {/* Faturamento area */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 md:p-4">
            <div className="mb-2 font-poppins text-sm font-semibold text-foreground md:text-base">Faturamento</div>
            <svg viewBox="0 0 560 130" className="h-24 w-full md:h-32" fill="none" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="fatFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[34, 67, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              <path d={`${LINE} L560,130 L0,130 Z`} fill="url(#fatFill)" />
              <path d={LINE} stroke={ORANGE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Vendas por canal */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 md:p-4">
            <div className="mb-3 font-poppins text-sm font-semibold text-foreground md:text-base">Vendas por canal</div>
            <div className="flex h-24 items-end justify-around gap-3 md:h-28">
              {CHANNELS.map((c) => (
                <div key={c.name} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className="w-full max-w-[34px] rounded-md"
                    style={{
                      height: `${c.h}%`,
                      background: `linear-gradient(to top, ${ORANGE}, hsl(25 95% 63%))`,
                    }}
                  />
                  <span className="font-poppins text-[10px] text-foreground/55 md:text-xs">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-1 md:px-4">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="font-poppins text-[10px] uppercase tracking-wide text-foreground/40 md:text-xs">
                <th className="py-2.5 font-medium">Campanha</th>
                <th className="py-2.5 font-medium">Status</th>
                <th className="py-2.5 font-medium">CTR</th>
                <th className="hidden py-2.5 font-medium sm:table-cell">CPC</th>
                <th className="hidden py-2.5 font-medium md:table-cell">CPA</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name} className="border-t border-white/[0.05] font-poppins text-[11px] md:text-sm">
                  <td className="py-2.5 text-foreground/85">{r.name}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-foreground/70">
                      <span className={`size-2 rounded-full ${r.ok ? 'bg-emerald-500' : 'bg-primary'}`} />
                      {r.ok ? 'Ativa' : 'Otimizando'}
                    </span>
                  </td>
                  <td className="py-2.5 text-foreground/70">{r.ctr}</td>
                  <td className="hidden py-2.5 text-foreground/70 sm:table-cell">{r.cpc}</td>
                  <td className="hidden py-2.5 text-foreground/45 md:table-cell">{r.cpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
