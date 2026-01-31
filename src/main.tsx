import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { NotFoundPage } from '@pages/NotFoundPage/NotFoundPage'
import { FestivalProvider } from '@contexts/FestivalContext'
import { ErrorBoundary } from '@components/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <FestivalProvider>
          <App />
        </FestivalProvider>
      </ErrorBoundary>
    ),
    errorElement: (
      <ErrorBoundary>
        <FestivalProvider>
          <NotFoundPage />
        </FestivalProvider>
      </ErrorBoundary>
    ),
    children: [
      { path: "/", element: null },
      { path: "/:district", element: null },
      { path: "/:district/:festivalTitle", element: null },
    ],
  },
  {
    path: "*",
    element: (
      <ErrorBoundary>
        <FestivalProvider>
          <NotFoundPage />
        </FestivalProvider>
      </ErrorBoundary>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
