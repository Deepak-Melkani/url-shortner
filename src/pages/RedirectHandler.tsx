import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Launch,
  Error as ErrorIcon,
  Schedule,
  Link as LinkIcon
} from '@mui/icons-material';
import { useURL } from '../contexts/URLContext';
import { logger } from '../lib/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const { getUrlByShortcode, recordClick } = useURL();
  const [status, setStatus] = useState('loading'); 
  const [urlData, setUrlData] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);
  const clickRecorded = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const handleRedirect = async () => {
      if (!shortcode) {
        setStatus('not-found');
        return;
      }

      try {
        const url = getUrlByShortcode(shortcode);
        
        if (!url) {
          setStatus('not-found');
          return;
        }

        setUrlData(url);
        setStatus('found');

        if (!clickRecorded.current) {
          clickRecorded.current = true;
          const success = recordClick(shortcode, {
            source: 'Direct',
            location: 'India', 
            userAgent: navigator.userAgent
          });
          
          if (success) {
            logger.info('Click recorded for redirect', { shortcode });
          }
        }

        let timeLeft = 3;
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            window.location.href = url.originalUrl;
          }
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error('Redirect error:', error);
        setStatus('error');
      }
    };

    handleRedirect();

    return () => {
      mountedRef.current = false;
    };
  }, [shortcode, getUrlByShortcode]); 

  const handleManualRedirect = () => {
    if (urlData) {
      window.location.href = urlData.originalUrl;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Checking URL...</Typography>
        </Paper>
      </Container>
    );
  }

  if (status === 'not-found') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" color="error" gutterBottom>
              URL Not Found
            </Typography>
          </Box>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            The shortened URL <code>/{shortcode}</code> does not exist or has expired.
          </Alert>
          
          <Button
            variant="contained"
            fullWidth
            onClick={() => window.location.href = '/'}
          >
            Create New Short URL
          </Button>
        </Paper>
      </Container>
    );
  }

  if (status === 'found' && urlData) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LinkIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" color="success.main" gutterBottom>
              Redirecting...
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You will be redirected in:
            </Typography>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
              {countdown}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              seconds
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Destination:
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                wordBreak: 'break-all',
                fontSize: '0.875rem'
              }}
            >
              {urlData.originalUrl}
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Created:
              </Typography>
              <Typography variant="body2">
                {formatDate(urlData.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Clicks:
              </Typography>
              <Typography variant="body2">
                {urlData.clickCount + 1}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Launch />}
              onClick={handleManualRedirect}
              fullWidth
            >
              Go Now
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/'}
              fullWidth
            >
              Create Another Short URL
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Expires: {formatDate(urlData.expiryAt)}
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          An error occurred while processing the URL.
        </Alert>
        <Button variant="contained" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </Paper>
    </Container>
  );
};

export default RedirectHandler;
