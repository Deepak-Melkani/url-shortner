import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  Login as LoginIcon,
  Person,
  Lock,
  Security
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(formData.username, formData.password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const handleDemoLogin = (username: string, password: string) => {
    setFormData({ username, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              URL Shortener
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Please login to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              disabled={loading}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              disabled={loading}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !formData.username || !formData.password}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Chip label="Demo Accounts" size="small" />
          </Divider>

          <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Login (Demo Accounts):
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoLogin('admin', 'admin123')}
                  disabled={loading}
                >
                  Admin
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoLogin('user', 'user123')}
                  disabled={loading}
                >
                  User
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoLogin('demo', 'demo123')}
                  disabled={loading}
                >
                  Demo
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Click any button above to auto-fill credentials, then click "Sign In"
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              This is a demo application with simulated authentication.
              <br />
              All data is stored locally in your browser.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
