import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Preload da imagem LCP (dashboard) com o nome hasheado. Sem isso o browser só
// descobre a URL depois do bundle JS renderizar (resource-load-delay ~2.4s).
function preloadHeroImage(): Plugin {
  return {
    name: 'preload-hero-image',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const asset = Object.values(ctx.bundle).find(
          (f) => f.type === 'asset' && /dashboard-w3.*\.webp$/.test(f.fileName)
        )
        if (!asset) return html
        const tag = `<link rel="preload" as="image" fetchpriority="high" href="/${asset.fileName}">`
        return html.replace('</head>', `    ${tag}\n  </head>`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadHeroImage()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
            return 'react'
          }
          if (id.includes('gsap') || id.includes('lenis') || id.includes('split-type')) {
            return 'gsap'
          }
          return undefined
        },
      },
    },
  },
})
