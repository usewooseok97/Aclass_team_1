import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage'
import { FestivalProvider } from '@/contexts/FestivalContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <AuthProvider>
          <FestivalProvider>
            <App />
          </FestivalProvider>
        </AuthProvider>
      </ErrorBoundary>
    ),
    errorElement: (
      <ErrorBoundary>
        <AuthProvider>
          <FestivalProvider>
            <NotFoundPage />
          </FestivalProvider>
        </AuthProvider>
      </ErrorBoundary>
    ),
    children: [
      { path: "/", element: null },
      { path: "/:district", element: null },
      { path: "/:district/:festivalTitle", element: null },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
