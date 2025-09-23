import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../layout/AppLayout.jsx'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  const token = localStorage.getItem('token') || ''

  const actions = useMemo(() => (
    <Stack direction='row' spacing={1}>
      <Button color='inherit' onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }}>Logout</Button>
      {/* <Button variant='contained' onClick={load}>Refresh</Button> */}
    </Stack>
  ), [])

  async function load() {
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setVideos(data)
    } catch (e) {
      setError(e.message || 'Failed to load')
    }
  }

  useEffect(() => { load() }, [])

  async function upload(e) {
    e.preventDefault()
    if (!file) return setError('Choose a file')
    if (!filename) return setError('Enter a filename')
    setError('')
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('filename', filename)
    try {
      const res = await fetch('http://localhost:4000/api/videos/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      setFile(null)
      setFilename('')
      await load()
    } catch (e) {
      setError(e.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  async function replaceFileFor(name, fileObj) {
    if (!fileObj) return
    setError('')
    setLoading(true)
    const form = new FormData()
    form.append('file', fileObj)
    form.append('filename', name)
    try {
      const res = await fetch('http://localhost:4000/api/videos/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      setSnack('Replaced successfully')
      await load()
    } catch (e) {
      setError(e.message || 'Replace failed')
    } finally {
      setLoading(false)
    }
  }

  function copyUrl(urlPath) {
    const full = `http://localhost:4000${urlPath}`
    navigator.clipboard.writeText(full).then(() => setSnack('URL copied'))
  }

  return (
    <AppLayout title='Videos' actions={actions}>
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }} component='form' onSubmit={upload}>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}>
          <Button variant='outlined' startIcon={<CloudUploadIcon />} component='label'>
            Choose video
            <input type='file' accept='video/*' hidden onChange={e => setFile(e.target.files?.[0] || null)} />
          </Button>
          <TextField label='Desired filename (e.g. myvideo.mp4)' value={filename} onChange={e => setFilename(e.target.value)} fullWidth />
          <Button type='submit' variant='contained' disabled={loading}>Add new</Button>
        </Stack>
        {error && <Typography color='error' sx={{ mt: 1 }}>{error}</Typography>}
        <Typography variant='caption' sx={{ display: 'block', mt: 1 }}>File will be saved exactly as your entered filename (sanitized).</Typography>
      </Paper>

      <TableContainer component={Paper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Size (MB)</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map(v => (
              <TableRow key={v.name} hover>
                <TableCell>
                  <video src={`http://localhost:4000${v.url}`} controls style={{ width: 140, aspectRatio: '16/9', borderRadius: 6 }} />
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2' fontWeight={600}>{v.name}</Typography>
                </TableCell>
                <TableCell align='right'>{(v.size / (1024*1024)).toFixed(2)}</TableCell>
                <TableCell align='right'>
                  <Stack direction='row' spacing={1} justifyContent='flex-end' alignItems='center'>
                    <Tooltip title='Copy URL'>
                      <IconButton size='small' onClick={() => copyUrl(v.url)}>
                        <ContentCopyIcon fontSize='inherit' />
                      </IconButton>
                    </Tooltip>
                    <input id={`file-${v.name}`} type='file' accept='video/*' hidden onChange={e => replaceFileFor(v.name, e.target.files?.[0] || null)} />
                    <label htmlFor={`file-${v.name}`}>
                      <Button variant='outlined' size='small' component='span' startIcon={<CloudUploadIcon />} disabled={loading}>Replace</Button>
                    </label>
                    <Button size='small' href={`http://localhost:4000${v.url}`} target='_blank'>Open</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')} message={snack} />
    </AppLayout>
  )
}
