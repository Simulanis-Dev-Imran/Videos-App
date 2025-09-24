import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Dashboard'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import HistoryIcon from '@mui/icons-material/History'
import { NavLink, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'

const drawerWidth = 240

export default function AppLayout({ title, actions, children, hideSidebar }) {
  const location = useLocation()
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: <HomeIcon /> },
    { label: 'Videos', to: '/videos', icon: <VideoLibraryIcon /> },
    { label: '3D Model', to: '/model3d', icon: <ViewInArIcon /> },
    { label: 'PDF', to: '/pdf', icon: <PictureAsPdfIcon /> },
    { label: 'Version Control', to: '/versions', icon: <HistoryIcon /> },
  ]

  const content = (
    <>
      <AppBar position='fixed' color='primary' enableColorOnDark sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>{title}</Typography>
          {actions}
          <Button color='inherit' onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }}>Logout</Button>
        </Toolbar>
      </AppBar>
      {!hideSidebar && (
        <Drawer
          variant='permanent'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {navItems.map((item) => (
                <ListItemButton key={item.to} component={NavLink} to={item.to} selected={location.pathname === item.to}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
      <Box component='main' sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', pl: 0 }}>
        <Toolbar />
        <Container maxWidth='md' disableGutters sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {content}
    </Box>
  )
}
