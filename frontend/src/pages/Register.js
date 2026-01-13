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
  MenuItem,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, School } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollNo: '',
    class: '',
    section: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      const userRole = result.role || result.data.role;
      toast.success(`Account created successfully! Welcome ${result.data.name} (${userRole})!`);
      
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
            maxWidth: 600,
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
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join EduManage today
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight="600" gutterBottom color="primary">
                    Select Your Role *
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Box
                          onClick={() => setFormData({ ...formData, role: 'admin' })}
                          sx={{
                            p: 2,
                            border: '2px solid',
                            borderColor: formData.role === 'admin' ? 'error.main' : 'grey.300',
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: formData.role === 'admin' ? 'error.lighter' : 'white',
                            transition: 'all 0.3s',
                            textAlign: 'center',
                            '&:hover': {
                              borderColor: 'error.main',
                              transform: 'translateY(-2px)',
                              boxShadow: 3,
                            }
                          }}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>🔑</Typography>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Admin
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Full system access
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Box
                          onClick={() => setFormData({ ...formData, role: 'teacher' })}
                          sx={{
                            p: 2,
                            border: '2px solid',
                            borderColor: formData.role === 'teacher' ? 'info.main' : 'grey.300',
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: formData.role === 'teacher' ? 'info.lighter' : 'white',
                            transition: 'all 0.3s',
                            textAlign: 'center',
                            '&:hover': {
                              borderColor: 'info.main',
                              transform: 'translateY(-2px)',
                              boxShadow: 3,
                            }
                          }}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>👨‍🏫</Typography>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Teacher
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Manage classes
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Box
                          onClick={() => setFormData({ ...formData, role: 'student' })}
                          sx={{
                            p: 2,
                            border: '2px solid',
                            borderColor: formData.role === 'student' ? 'success.main' : 'grey.300',
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: formData.role === 'student' ? 'success.lighter' : 'white',
                            transition: 'all 0.3s',
                            textAlign: 'center',
                            '&:hover': {
                              borderColor: 'success.main',
                              transform: 'translateY(-2px)',
                              boxShadow: 3,
                            }
                          }}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>👨‍🎓</Typography>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Student
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            View your records
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Grid>

                {formData.role === 'student' && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2, border: '1px solid', borderColor: 'success.main' }}>
                        <Typography variant="body2" color="success.dark" fontWeight="600">
                          📚 Student Additional Information (Required)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Roll Number *"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleChange}
                        placeholder="e.g., STU001"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        select
                        label="Class *"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="">Select Class</MenuItem>
                        <MenuItem value="1">Class 1</MenuItem>
                        <MenuItem value="2">Class 2</MenuItem>
                        <MenuItem value="3">Class 3</MenuItem>
                        <MenuItem value="4">Class 4</MenuItem>
                        <MenuItem value="5">Class 5</MenuItem>
                        <MenuItem value="6">Class 6</MenuItem>
                        <MenuItem value="7">Class 7</MenuItem>
                        <MenuItem value="8">Class 8</MenuItem>
                        <MenuItem value="9">Class 9</MenuItem>
                        <MenuItem value="10">Class 10</MenuItem>
                        <MenuItem value="11">Class 11</MenuItem>
                        <MenuItem value="12">Class 12</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        select
                        label="Section *"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="">Select Section</MenuItem>
                        <MenuItem value="A">Section A</MenuItem>
                        <MenuItem value="B">Section B</MenuItem>
                        <MenuItem value="C">Section C</MenuItem>
                        <MenuItem value="D">Section D</MenuItem>
                      </TextField>
                    </Grid>
                  </>
                )}
                
                {formData.role === 'teacher' && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
                      <Typography variant="body2" color="info.dark" fontWeight="600">
                        👨‍🏫 You're registering as a Teacher - Access to mark attendance, enter marks, and view salary
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {formData.role === 'admin' && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 2, border: '1px solid', borderColor: 'error.main' }}>
                      <Typography variant="body2" color="error.dark" fontWeight="600">
                        🔑 You're registering as an Admin - Full system access and control
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </motion.div>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Register;

