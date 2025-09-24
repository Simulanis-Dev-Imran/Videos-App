import { useEffect, useState } from 'react'
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
import DownloadIcon from '@mui/icons-material/Download'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('IBHEEM')

  const token = localStorage.getItem('token') || ''

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

  const UNITS = ['IBHEEM', 'RAM', 'CIT', 'ADU']

  function belongsToUnit(name, unit) {
    const n = (name || '').toLowerCase()
    const u = unit.toLowerCase()
    return n.includes(u)
  }

  const videosByUnit = UNITS.reduce((acc, unit) => {
    acc[unit] = videos.filter(v => belongsToUnit(v.name, unit)).slice(0, 3)
    return acc
  }, {})

  async function upload(e) {
    e.preventDefault()
    if (!file) return setError('Choose a file')
    if (!filename) return setError('Enter a filename')
    setError('')
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    const lower = (filename || '').toLowerCase()
    const unitLower = selectedUnit.toLowerCase()
    const filenameWithUnit = lower.includes(unitLower) ? filename : `${unitLower}_${filename}`
    form.append('filename', filenameWithUnit)
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
    <AppLayout title="Videos">
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }} component="form" onSubmit={upload}>
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}>
          <Button variant="outlined" startIcon={<CloudUploadIcon />} component="label">
            Choose video
            <input type="file" accept="video/*" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
          </Button>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select labelId="unit-label" label="Unit" value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)}>
              {UNITS.map(u => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Desired filename (e.g. myvideo.mp4)" value={filename} onChange={e => setFilename(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" disabled={loading}>Add new</Button>
        </Stack>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
          File will be saved exactly as your entered filename (sanitized).
        </Typography>
      </Paper>

      {UNITS.map(unit => (
        <Paper key={unit} elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>{unit}</Typography>
          <TableContainer>
            <Table size="small" aria-label={`${unit} videos`}>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Preview</TableCell> */}
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Size (MB)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videosByUnit[unit].length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2">No video found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  videosByUnit[unit].map(v => (
                    <TableRow key={`${unit}-${v.name}`} hover>
                      {/* <TableCell>
                        <Box
                          sx={{
                            width: 140,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {v.url && (
                            <video
                              src={`http://localhost:4000${v.url}`}
                              muted
                              autoPlay
                              loop
                              playsInline
                              preload="metadata"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                // background: '#000',
                                display: 'block',
                              }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          )}
                        </Box>
                      </TableCell> */}
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>{v.name}</Typography>
                      </TableCell>
                      <TableCell align="right">{(v.size / (1024 * 1024)).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          {/* <Tooltip title="Copy URL">
                            <IconButton size="small" onClick={() => copyUrl(v.url)}>
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip> */}
                          <input id={`file-${unit}-${v.name}`} type="file" accept="video/*" hidden onChange={e => replaceFileFor(v.name, e.target.files?.[0] || null)} />
                          <label htmlFor={`file-${unit}-${v.name}`}>
                            <Button variant="outlined" size="small" component="span" startIcon={<CloudUploadIcon />} disabled={loading}>Replace</Button>
                          </label>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              component="a"
                              href={`http://localhost:4000${v.url}`}
                              download
                              target="_blank"
                            >
                              <DownloadIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}

      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')} message={snack} />
    </AppLayout>
  )
}
