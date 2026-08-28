import { useEffect, useState } from 'react'
import { BlogPage } from '@/components/BlogPage'
import { AdminAutoblogPage } from '@/components/AdminAutoblogPage'
import { AdminPage } from '@/components/AdminPage'
import { LegacyLanding } from '@/components/LegacyLanding'
import { updateDocumentMetadata } from '@/lib/seo'

function isBlogPath(pathname: string) {
  return pathname === '/blog' || pathname.startsWith('/blog/')
}

function isAdminPath(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export default function App() {
  const [pathname] = useState(() => window.location.pathname)

  useEffect(() => {
    if (isAdminPath(pathname)) return
    updateDocumentMetadata(pathname)
  }, [pathname])

  if (isBlogPath(pathname)) {
    return <BlogPage pathname={pathname} />
  }

  if (isAdminPath(pathname)) {
    if (pathname === '/admin' || pathname === '/admin/') return <AdminPage />
    if (pathname === '/admin/content' || pathname.startsWith('/admin/content/')) return <AdminAutoblogPage section="content" />
    return <AdminAutoblogPage section="autoblog" />
  }

  // A landing entra como HTML validado fora do repo; os componentes antigos
  // (Hero, Methodology, Stats, …) continuam versionados para consulta, mas não
  // são mais renderizados.
  return <LegacyLanding />
}
