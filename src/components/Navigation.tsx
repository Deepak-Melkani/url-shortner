import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Link as LinkIcon,
  BarChart,
  GitHub,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <LinkIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            URL Shortener
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            color={isActive('/') ? 'secondary' : 'inherit'}
            startIcon={<LinkIcon />}
          >
            Shorten
          </Button>
          
          <Button
            component={Link}
            to="/stats"
            color={isActive('/stats') ? 'secondary' : 'inherit'}
            startIcon={<BarChart />}
          >
            Statistics
          </Button>

          <IconButton
            color="inherit"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <GitHub />
          </IconButton>

          {/* User Menu */}
          <Box sx={{ ml: 2 }}>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
              sx={{ textTransform: 'none' }}
            >
              {user?.username}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user?.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
