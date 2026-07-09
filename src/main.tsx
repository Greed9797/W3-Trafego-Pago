import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './lib/gsap' // único driver do Lenis (gsap.ticker) + registra ScrollTrigger no boot

// StrictMode removido: o double-invoke de efeitos em dev quebra os reveals do GSAP
// (gsap.from sem revert captura o estado já zerado e anima 0→0). Prod nunca faz double-mount.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
