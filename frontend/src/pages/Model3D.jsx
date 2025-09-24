import { useState } from 'react'
import AppLayout from '../layout/AppLayout.jsx'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import IRAM from '../assets/IRAM.png'
import CITthumbnial from '../assets/CITthumbnial.png'
import IBHEEM from '../assets/IBHEEM.png'
import ADNOC from '../assets/ADNOC.png'

const initialItems = [
  { title: 'IBHEEM', img: IBHEEM },
  { title: 'RAM', img: IRAM },
  { title: 'ADU', img: ADNOC },
  { title: 'CIT', img: CITthumbnial },
]

export default function Model3D() {
  const [items, setItems] = useState(initialItems)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  

  return (
    <AppLayout title='3D Models'>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 3 }}>
      <Typography variant='h5'>List of 3D Models</Typography>
        <Button variant='outlined' onClick={() => setOpen(true)}>Add 3D Model</Button>
      </Stack>
      <Grid container spacing={2}>
        {items.map((it) => (
          <Grid size={{xs:12, sm:6, md:3}} key={it.title}>
            <Card>
              <CardMedia component='img' image={it.img} height='140' alt={it.title} sx={{p:1}} />
              <CardContent sx={{p:1, pb:0, textAlign:'center'}}>
                <Typography variant='subtitle1' fontWeight={600}>{it.title}</Typography>
                {/* <Typography variant='body2' color='text.secondary'>Sample model description</Typography> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Add 3D Model</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
            <TextField label='Image URL' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={() => {
            if (!title || !imageUrl) return
            setItems([{ title, img: imageUrl }, ...items])
            setTitle('')
            setImageUrl('')
            setOpen(false)
          }}>Add</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  )
}


