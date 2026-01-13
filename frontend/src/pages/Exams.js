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
  Divider,
} from '@mui/material';
import { Add, Assignment, CalendarToday, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    examName: '',
    examType: 'Mid Term',
    class: user.class || '',
    section: user.section || '',
    subject: '',
    examDate: '',
    startTime: '',
    endTime: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    room: '',
    academicYear: '2024-2025',
  });

  useEffect(() => {
    fetchExams();
  }, [user]);

  const fetchExams = async () => {
    try {
      const params = user.role === 'student' 
        ? `?class=${user.class}&section=${user.section}`
        : '';
      
      const response = await axios.get(`http://localhost:5000/api/exams${params}`);
      if (response.data.success) {
        setExams(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/exams', formData);
      if (response.data.success) {
        toast.success('Exam scheduled successfully');
        setOpenDialog(false);
        fetchExams();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule exam');
    }
  };

  const getExamTypeColor = (type) => {
    const colors = {
      'Mid Term': 'primary',
      'End Semester': 'secondary',
      'Unit Test': 'info',
      'Final': 'error',
      'Quiz': 'warning',
    };
    return colors[type] || 'default';
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
              Examinations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage exam schedules
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
                Schedule Exam
              </Button>
            </motion.div>
          )}
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {exams.map((exam, index) => (
              <Grid item xs={12} sm={6} md={4} key={exam._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {exam.examName}
                          </Typography>
                          <Chip
                            label={exam.examType}
                            color={getExamTypeColor(exam.examType)}
                            size="small"
                          />
                        </Box>
                        <Box
                          sx={{
                            bgcolor: 'primary.light',
                            borderRadius: 2,
                            p: 1,
                          }}
                        >
                          <Assignment sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {new Date(exam.examDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <AccessTime sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {exam.startTime} - {exam.endTime} ({exam.duration} min)
                        </Typography>
                      </Box>

                      <Box mt={2} p={2} bgcolor="grey.50" borderRadius={2}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Subject
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {exam.subject}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Total Marks
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {exam.totalMarks}
                            </Typography>
                          </Grid>
                          {exam.room && (
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Room
                              </Typography>
                              <Typography variant="body2" fontWeight="600">
                                {exam.room}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
            {exams.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" textAlign="center" py={5}>
                  No exams scheduled
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* Schedule Exam Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Schedule Exam</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Exam Name"
                    value={formData.examName}
                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Exam Type"
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    required
                  >
                    <MenuItem value="Mid Term">Mid Term</MenuItem>
                    <MenuItem value="End Semester">End Semester</MenuItem>
                    <MenuItem value="Unit Test">Unit Test</MenuItem>
                    <MenuItem value="Final">Final</MenuItem>
                    <MenuItem value="Quiz">Quiz</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Section"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Exam Date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (minutes)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="End Time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Total Marks"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Passing Marks"
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
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
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Schedule
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Exams;

