import AppLayout from '../layout/AppLayout.jsx'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import HistoryIcon from '@mui/icons-material/History'
import Box from '@mui/material/Box'

const versions = [
  { version: '1.0', date: '2024-01-15', notes: 'Initial release' },
  { version: '1.1', date: '2024-03-10', notes: 'Minor improvements' },
  { version: '1.2', date: '2024-06-05', notes: 'Bug fixes and UI tweaks' },
]

export default function VersionControl() {
  return (
    <AppLayout title='Version Control'>
      <Box sx={{ mb: 2 }}>
        <Typography variant='h5'>Version Releases</Typography>
      </Box>
      <Grid container spacing={2}>
        {versions.map(v => (
          <Grid size={{xs:12, sm:6, md:4}} key={v.version}>
            <Card variant='outlined' sx={{ height: 140 }}>
              <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant='subtitle2' color='text.secondary'>Version</Typography>
                  <Typography variant='h4' fontWeight={700}>{v.version}</Typography>
                  <Typography variant='caption' color='text.secondary'>Released {v.date}</Typography>
                  <Typography variant='body2'>{v.notes}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                  <HistoryIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  )
}


