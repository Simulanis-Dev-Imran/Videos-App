import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import Login from './pages/Login.jsx'
import Videos from './pages/Videos.jsx'

const isAuthed = () => !!localStorage.getItem('token')

const router = createBrowserRouter([
  { path: '/', element: isAuthed() ? <Navigate to="/videos" replace /> : <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/videos', element: <Videos /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
