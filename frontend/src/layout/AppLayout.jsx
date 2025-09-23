import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

export default function AppLayout({ title, actions, children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position='sticky' color='primary' enableColorOnDark>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>{title}</Typography>
          {actions}
        </Toolbar>
      </AppBar>
      <Container maxWidth='md' sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}
