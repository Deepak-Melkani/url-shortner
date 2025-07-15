import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { URLProvider } from './contexts/URLContext';
import { theme } from './theme';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import URLShortener from './pages/URLShortener';
import Statistics from './pages/Statistics';
import RedirectHandler from './pages/RedirectHandler';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <URLProvider>
          <Router>
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Navigation />
                    <URLShortener />
                  </ProtectedRoute>
                } />
                <Route path="/stats" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Statistics />
                  </ProtectedRoute>
                } />
                
                <Route path="/:shortcode" element={<RedirectHandler />} />
              </Routes>
            </div>
          </Router>
        </URLProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
