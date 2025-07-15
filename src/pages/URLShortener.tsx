import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Chip,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Stack
} from '@mui/material';
import {
  ContentCopy,
  Launch,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useURL } from '../contexts/URLContext';
import { CustomError } from '@/types';

interface URLResult {
  id: number;
  originalUrl: string;
  shortcode: string;
  shortUrl: string;
  createdAt: number;
  expiryAt: number;
  expiryMinutes: number;
  clickCount: number;
  clickLogs: any[];
}

interface FormData {
  originalUrl: string;
  expiryMinutes: number;
  customShortcode: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const URLShortener = () => {
  const { createShortUrl, loading } = useURL();
  const [formData, setFormData] = useState<FormData>({
    originalUrl: '',
    expiryMinutes: 30,
    customShortcode: ''
  });
  const [result, setResult] = useState<URLResult | null>(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expiryMinutes' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');
  setResult(null);

  try {
    const result = await createShortUrl(
      formData.originalUrl,
      formData.expiryMinutes,
      formData.customShortcode || undefined
    );
    
    setResult(result);
    setSnackbar({ open: true, message: 'URL shortened successfully!', severity: 'success' });
    
    setFormData({
      originalUrl: '',
      expiryMinutes: 30,
      customShortcode: ''
    });
  } catch (err) {
    const error = err as CustomError;
    setError(error.message);
    setSnackbar({ open: true, message: error.message, severity: 'error' });
  }
};

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy to clipboard', severity: 'error' });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          URL Shortener
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Stack spacing={3}>

            <TextField
              fullWidth
              required
              name="originalUrl"
              label="Original URL"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={formData.originalUrl}
              onChange={handleInputChange}
              variant="outlined"
            />


            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                name="expiryMinutes"
                label="Expiry Period (minutes)"
                type="number"
                inputProps={{ min: 1, max: 525600 }}
                value={formData.expiryMinutes}
                onChange={handleInputChange}
                variant="outlined"
                helperText="Default: 30 minutes. Max: 1 year (525,600 minutes)"
              />

              <TextField
                fullWidth
                name="customShortcode"
                label="Custom Shortcode (optional)"
                placeholder="my-custom-code"
                value={formData.customShortcode}
                onChange={handleInputChange}
                variant="outlined"
                helperText="3-20 alphanumeric characters. Leave empty for auto-generation."
                inputProps={{ pattern: "[a-zA-Z0-9]+", title: "Only alphanumeric characters allowed" }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !formData.originalUrl}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }} icon={<ErrorIcon />}>
            {error}
          </Alert>
        )}

        {result && (
          <Card sx={{ mt: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1 }} />
                <Typography variant="h6">
                  URL Shortened Successfully!
                </Typography>
              </Box>

              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Short URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={result.shortUrl}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                  />
                  <IconButton
                    onClick={() => copyToClipboard(result.shortUrl)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <ContentCopy />
                  </IconButton>
                  <IconButton
                    onClick={() => window.open(result.originalUrl, '_blank')}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <Launch />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(result.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Expires:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(result.expiryAt)}
                  </Typography>
                </Box>
              </Box>

             
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={`Shortcode: ${result.shortcode}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Valid for ${result.expiryMinutes} minutes`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default URLShortener;
