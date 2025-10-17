import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import ComingSoonPage from './pages/ComingSoonPage.tsx'
import './index.css'
import './styles/coming-soon.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ComingSoonPage />
    <Analytics />
  </React.StrictMode>,
)









