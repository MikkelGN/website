import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/baloo-2/500.css'
import '@fontsource/baloo-2/700.css'
import App from './App'
import './i18n'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
