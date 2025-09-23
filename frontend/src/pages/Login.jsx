import { useState } from 'react'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AppLayout from '../layout/AppLayout.jsx'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('token', data.token)
      window.location.href = '/videos'
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout title='Sign in'>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 420, mx: 'auto' }} component='form' onSubmit={submit}>
        <Stack spacing={2}>
          <Typography variant='h5'>Welcome</Typography>
          <TextField label='Username' value={username} onChange={e => setUsername(e.target.value)} fullWidth />
          <TextField type='password' label='Password' value={password} onChange={e => setPassword(e.target.value)} fullWidth />
          {error && <Typography color='error' variant='body2'>{error}</Typography>}
          <Button type='submit' variant='contained' disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
        </Stack>
      </Paper>
    </AppLayout>
  )
}
