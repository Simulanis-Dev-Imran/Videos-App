import { useState } from 'react'
import Typography from '@mui/material/Typography'
import AppLayout from '../layout/AppLayout.jsx'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import AssessmentIcon from '@mui/icons-material/Assessment'
import GroupsIcon from '@mui/icons-material/Groups'

export default function Dashboard() {
  const [videosCount, setVideosCount] = useState(15)
  // Static data for now per requirement
  const units = ['IBHEEM', 'RAM', 'CIT', 'ADU']
  const pdfs = ['IBHEEM', 'RAM', 'CIT', 'ADU']
  const performTests = ['Test 1', 'Test 2', 'Test 3', 'Test 4']
  const token = localStorage.getItem('token') || ''

  // Removed dynamic fetch to keep counts fixed as requested

  return (
    <AppLayout title='Dashboard'>
      <Box sx={{ mb: 2 }}>
        <Typography variant='h5'>Overview</Typography>
        <Typography variant='body2' color='text.secondary'>Project content summary</Typography>
      </Box>
      <Grid container spacing={2} alignItems='stretch'>
        {[
          { title: 'Total Units', value: units.length, Icon: GroupsIcon, color: 'warning.main' },
          { title: 'Total Videos', value: videosCount, Icon: VideoLibraryIcon, color: 'primary.main' },
          { title: 'Total PDF', value: pdfs.length, Icon: PictureAsPdfIcon, color: 'secondary.main' },
          { title: 'Total Perform Test', value: performTests.length, Icon: AssessmentIcon, color: 'success.main' },
        ].map((c) => (
          <Grid size={{xs:12, sm:6, md:3}} key={c.title}>
            <Card variant='outlined' sx={{ flex: 1, minHeight: 140, display: 'flex' }}>
              <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant='subtitle2' color='text.secondary'>{c.title}</Typography>
                  <Typography variant='h4' fontWeight={700}>{c.value}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: c.color, width: 48, height: 48 }}>
                  <c.Icon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant='h6' sx={{ mb: 1 }}>Units</Typography>
        <TableContainer component={Paper} variant='outlined'>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell variant='head' sx={{ fontWeight: 700 }}>Unit Name</TableCell>
                <TableCell  variant='head' align='center' sx={{ fontWeight: 700 }}>Assembly</TableCell>
                <TableCell  variant='head' align='center' sx={{ fontWeight: 700 }}>Disassembly</TableCell>
                <TableCell  variant='head' align='center' sx={{ fontWeight: 700 }}>Perform Test</TableCell>
                {/* <TableCell align='center'>ADD</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((u) => (
                <TableRow key={u} hover>
                  <TableCell>{u}</TableCell>
                  <TableCell align='center'><CheckIcon fontSize='small' /></TableCell>
                  <TableCell align='center'><CheckIcon fontSize='small' /></TableCell>
                  <TableCell align='center'><CheckIcon fontSize='small' /></TableCell>
                  {/* <TableCell align='center'>
                    <IconButton color='success' size='small' aria-label='add'>
                      <CheckIcon fontSize='small' />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AppLayout>
  )
}


