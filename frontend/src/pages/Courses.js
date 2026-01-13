import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Add, Book, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    class: '',
    teacher: '',
    credits: 3,
    academicYear: '2024-2025',
  });

  useEffect(() => {
    fetchCourses();
    if (user.role === 'admin') {
      fetchTeachers();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students'); // This should be a teachers endpoint
      if (response.data.success) {
        setTeachers(response.data.data.filter(u => u.role === 'teacher'));
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/courses', formData);
      if (response.data.success) {
        toast.success('Course created successfully');
        setOpenDialog(false);
        fetchCourses();
        setFormData({
          courseName: '',
          courseCode: '',
          description: '',
          class: '',
          teacher: '',
          credits: 3,
          academicYear: '2024-2025',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Courses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all courses and subjects
            </Typography>
          </motion.div>
          {user.role === 'admin' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
              >
                Add Course
              </Button>
            </motion.div>
          )}
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box
                          sx={{
                            bgcolor: 'primary.light',
                            borderRadius: 2,
                            p: 1.5,
                            mr: 2,
                          }}
                        >
                          <Book sx={{ color: 'white' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {course.courseName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {course.description || 'No description available'}
                      </Typography>
                      
                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        <Chip label={`Class ${course.class}`} size="small" color="primary" />
                        <Chip label={`${course.credits} Credits`} size="small" variant="outlined" />
                      </Box>
                      
                      {course.teacher && (
                        <Box display="flex" alignItems="center">
                          <Person sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {course.teacher.name}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
            {courses.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" textAlign="center" py={5}>
                  No courses found
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* Add Course Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Course</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Course Name"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Course Code"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Credits"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Academic Year"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Teacher"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Courses;

