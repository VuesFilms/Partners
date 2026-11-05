import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

// VITE_ROUTER=hash  → static hosts without rewrites (GitHub Pages)
// VITE_ROUTER=memory → hosts that don't support URL paths at all (embedded previews)
const mode = import.meta.env.VITE_ROUTER;
const Router = mode === 'memory' ? MemoryRouter : mode === 'hash' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </StrictMode>,
);
