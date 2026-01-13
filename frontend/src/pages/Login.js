import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, School } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const userRole = result.role || result.data.role;
      toast.success(`Welcome ${result.data.name}! Logging in as ${userRole}...`);
      
      // Role-based redirection
      setTimeout(() => {
        navigate(`/${userRole}/dashboard`);
      }, 500);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <School
                  sx={{
                    fontSize: 60,
                    color: 'primary.main',
                    mb: 2,
                  }}
                />
              </motion.div>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome to EduManage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your account
              </Typography>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    },
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '2px solid', borderColor: 'primary.light' }}>
              <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom>
                💡 Demo Accounts - Try Different Roles:
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
                    <Typography variant="caption" color="error.main" fontWeight="bold">
                      🔑 Admin Access
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      Email: admin@edu.com
                    </Typography>
                    <Typography variant="caption" display="block">
                      Password: admin123
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
                    <Typography variant="caption" color="info.main" fontWeight="bold">
                      👨‍🏫 Teacher Access
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      Email: teacher@edu.com
                    </Typography>
                    <Typography variant="caption" display="block">
                      Password: teacher123
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
                    <Typography variant="caption" color="success.main" fontWeight="bold">
                      👨‍🎓 Student Access
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      Email: student@edu.com
                    </Typography>
                    <Typography variant="caption" display="block">
                      Password: student123
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, fontStyle: 'italic' }}>
                ℹ️ Each role has different features and permissions
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;

