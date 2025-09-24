import AppLayout from '../layout/AppLayout.jsx'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import DownloadIcon from '@mui/icons-material/Download'

const UNITS = ['IBHEEM', 'RAM', 'CIT', 'ADU']

export default function Pdf() {
  return (
    <>
    <AppLayout title='PDFs'>
      {UNITS.map(unit => (
        <Paper key={unit} elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant='h6' sx={{ mb: 1 }}>{unit}</Typography>
          <List sx={{ bgcolor: 'background.paper' }}>
            {[1].map((i) => (
              <div key={`${unit}-pdf-${i}`}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ my: 1 }}>
                  <ListItem component='a' onClick={(e) => e.preventDefault()} sx={{ px: 0 }}>
                    <ListItemIcon><PictureAsPdfIcon color='error' /></ListItemIcon>
                    <ListItemText primary={`${unit.toLowerCase()}_doc-${i}.pdf`} />
                  </ListItem>
                  <IconButton size='small' component='a' href={'#'} onClick={(e) => e.preventDefault()} download>
                    <DownloadIcon fontSize='inherit' />
                  </IconButton>
                </Stack>
                {i < 3 && <Divider component='li' />}
              </div>
            ))}
          </List>
        </Paper>
      ))}
    </AppLayout>
    </>
  )
}


