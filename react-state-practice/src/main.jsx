import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FixStuckFormInput from './FixStuckFormInput.jsx'
import FixCrash from './FixCrash.jsx'
import UnnecessaryState from './UnnecessaryState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UnnecessaryState />
  </StrictMode>,
)
