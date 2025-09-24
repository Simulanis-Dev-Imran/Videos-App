import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import Login from './pages/Login.jsx'
import Videos from './pages/Videos.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Model3D from './pages/Model3D.jsx'
import Pdf from './pages/Pdf.jsx'
import VersionControl from './pages/VersionControl.jsx'

const isAuthed = () => !!localStorage.getItem('token')

const router = createBrowserRouter([
  { path: '/', element: isAuthed() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/videos', element: <Videos /> },
  { path: '/model3d', element: <Model3D /> },
  { path: '/pdf', element: <Pdf /> },
  { path: '/versions', element: <VersionControl /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
