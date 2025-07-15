import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar
} from '@mui/material';
import {
  ContentCopy,
  Launch,
  Delete,
  BarChart,
  Schedule,
  Link as LinkIcon,
  TrendingUp,
  Visibility
} from '@mui/icons-material';
import { useURL } from '../contexts/URLContext';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const Statistics = () => {
  const { urls, stats, deleteUrl, loading } = useURL();
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy to clipboard', severity: 'error' });
    }
  };

  const handleDelete = async (shortcode: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const success = await deleteUrl(shortcode);
      if (success) {
        setSnackbar({ open: true, message: 'URL deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete URL', severity: 'error' });
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const isExpired = (expiryTimestamp: number) => {
    return Date.now() > expiryTimestamp;
  };

  const getStatusChip = (url: any) => {
    if (isExpired(url.expiryAt)) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          URL Statistics
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Track your shortened URLs and analytics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total URLs
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalUrls}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp color="success" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active URLs
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.activeUrls}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule color="warning" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Expired URLs
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.expiredUrls}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility color="secondary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Clicks
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalClicks}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* URLs Table */}
      <Paper elevation={3}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart />
          <Typography variant="h6" component="h2">
            All URLs
          </Typography>
        </Box>

        {urls.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">
              No URLs found. Create your first shortened URL to see statistics here.
            </Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url: any) => (
                  <TableRow key={url.id}>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          component="code"
                          sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}
                        >
                          {url.shortcode}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(url.shortUrl)}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(url)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {url.clickCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(url.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(url.expiryAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => window.open(url.originalUrl, '_blank')}
                        >
                          <Launch fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(url.shortcode)}
                          disabled={loading}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Snackbar for notifications */}
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

export default Statistics;
