import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@/assets/scss/style.scss';
import ErrorBoundary from './components/ErrorBoundary';
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter basename={'/'}>
    <ErrorBoundary >
      <App />
    </ErrorBoundary>
  </BrowserRouter>
  // </StrictMode>
);