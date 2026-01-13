import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Schedule, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Timetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    day: 'Monday',
    period: 1,
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    teacher: '',
    teacherName: '',
    room: '',
    academicYear: '2024-2025',
  });
  const [useCustomTeacher, setUseCustomTeacher] = useState(false);
  const [busyTeachers, setBusyTeachers] = useState([]);
  const [freeTeachers, setFreeTeachers] = useState([]);

  useEffect(() => {
    fetchTimetable();
    if (user.role === 'admin') {
      fetchTeachers();
    }
  }, [user]);

  useEffect(() => {
    if (openDialog && user.role === 'admin') {
      fetchTeachers();
    }
  }, [openDialog, user.role]);

  const fetchTimetable = async () => {
    try {
      const params = user.role === 'student' 
        ? `?class=${user.class}&section=${user.section}`
        : '';
      
      const response = await axios.get(`http://localhost:5000/api/timetable${params}`);
      if (response.data.success) {
        setTimetable(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast.error('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      if (response.data.success) {
        const teachersList = response.data.data.filter(u => u.role === 'teacher');
        setTeachers(teachersList);
        console.log('Teachers loaded:', teachersList.length);
        if (teachersList.length === 0) {
          toast.info('No teachers found. Please create teacher accounts first.');
        }
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoadingTeachers(false);
    }
  };

  const checkTeacherAvailability = async () => {
    if (!formData.day || !formData.period) {
      toast.error('Please select day and period first');
      return;
    }

    try {
      // Get all timetable entries for this day and period
      const response = await axios.get('http://localhost:5000/api/timetable');
      if (response.data.success) {
        const allEntries = response.data.data;
        
        // Find teachers who are busy at this time
        const busy = allEntries.filter(entry => 
          entry.day === formData.day && 
          entry.period === parseInt(formData.period)
        ).map(entry => entry.teacher);

        setBusyTeachers(busy);

        // Find teachers who are free
        const busyIds = busy.map(t => t?._id).filter(Boolean);
        const free = teachers.filter(t => !busyIds.includes(t._id));
        setFreeTeachers(free);

        toast.success(`Found ${free.length} free teachers for ${formData.day} Period ${formData.period}`);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check teacher availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!useCustomTeacher && !formData.teacher) {
      toast.error('Please select a teacher or enter custom teacher name');
      return;
    }

    if (useCustomTeacher && !formData.teacherName) {
      toast.error('Please enter teacher name');
      return;
    }

    try {
      const submitData = useCustomTeacher 
        ? { ...formData, teacher: null }
        : { ...formData, teacherName: '' };

      const response = await axios.post('http://localhost:5000/api/timetable', submitData);
      if (response.data.success) {
        toast.success('Timetable entry created successfully');
        setOpenDialog(false);
        fetchTimetable();
        // Reset form
        setFormData({
          class: '',
          section: '',
          day: 'Monday',
          period: 1,
          startTime: '09:00',
          endTime: '10:00',
          subject: '',
          teacher: '',
          teacherName: '',
          room: '',
          academicYear: '2024-2025',
        });
        setUseCustomTeacher(false);
        setBusyTeachers([]);
        setFreeTeachers([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create timetable entry');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const groupedTimetable = days.map(day => ({
    day,
    periods: timetable.filter(t => t.day === day).sort((a, b) => a.period - b.period)
  }));

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Timetable
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage class schedules
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
                Add Period
              </Button>
            </motion.div>
          )}
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {groupedTimetable.map((dayData, index) => (
              <Grid item xs={12} key={dayData.day}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        {dayData.day}
                      </Typography>
                      {dayData.periods.length > 0 ? (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Period</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Teacher</TableCell>
                                <TableCell>Room</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dayData.periods.map((period) => (
                                <TableRow key={period._id}>
                          <TableCell>
                            <Chip label={`Period ${period.period}`} size="small" color="primary" variant="filled" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {period.startTime} - {period.endTime}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600" color="primary">
                              {period.subject}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Person sx={{ fontSize: 18, color: 'secondary.main' }} />
                              <Typography variant="body2" fontWeight="600">
                                {period.teacher?.name || period.teacherName || 'Not Assigned'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={period.room || 'TBA'} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                          No classes scheduled
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Period Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <Schedule color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Add Timetable Period
              </Typography>
            </Box>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Class *"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  >
                    <MenuItem value="">Select Class</MenuItem>
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i+1} value={String(i+1)}>Class {i+1}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Section *"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    required
                  >
                    <MenuItem value="">Select Section</MenuItem>
                    <MenuItem value="A">Section A</MenuItem>
                    <MenuItem value="B">Section B</MenuItem>
                    <MenuItem value="C">Section C</MenuItem>
                    <MenuItem value="D">Section D</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Day"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    required
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Period"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
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
                    select
                    label="Subject *"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  >
                    <MenuItem value="">Select Subject</MenuItem>
                    <MenuItem value="Mathematics">Mathematics</MenuItem>
                    <MenuItem value="Physics">Physics</MenuItem>
                    <MenuItem value="Chemistry">Chemistry</MenuItem>
                    <MenuItem value="Biology">Biology</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="History">History</MenuItem>
                    <MenuItem value="Geography">Geography</MenuItem>
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                    <MenuItem value="Physical Education">Physical Education</MenuItem>
                    <MenuItem value="Arts">Arts</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" color="info.dark" fontWeight="600">
                      📊 Check Teacher Availability First
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="info"
                    onClick={checkTeacherAvailability}
                    disabled={!formData.day || !formData.period}
                    sx={{ mb: 2 }}
                  >
                    🔍 Check Which Teachers Are Free
                  </Button>
                </Grid>

                {freeTeachers.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="success.dark" gutterBottom>
                        ✅ Free Teachers ({freeTeachers.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {freeTeachers.map(teacher => (
                          <Chip 
                            key={teacher._id}
                            label={teacher.name}
                            color="success"
                            size="small"
                            onClick={() => setFormData({ ...formData, teacher: teacher._id })}
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}

                {busyTeachers.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="error.dark" gutterBottom>
                        ❌ Busy Teachers ({busyTeachers.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {busyTeachers.map((teacher, idx) => (
                          teacher && (
                            <Chip 
                              key={idx}
                              label={teacher.name || 'Unknown'}
                              color="error"
                              size="small"
                              variant="outlined"
                            />
                          )
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" color="primary.dark" fontWeight="600">
                      👨‍🏫 Select or Enter Teacher
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant={!useCustomTeacher ? 'contained' : 'outlined'}
                      onClick={() => setUseCustomTeacher(false)}
                      fullWidth
                    >
                      Select from List
                    </Button>
                    <Button
                      variant={useCustomTeacher ? 'contained' : 'outlined'}
                      onClick={() => setUseCustomTeacher(true)}
                      fullWidth
                    >
                      Enter Manually
                    </Button>
                  </Box>

                  {!useCustomTeacher ? (
                    <TextField
                      fullWidth
                      select
                      label="Teacher *"
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      required
                      helperText={loadingTeachers ? "Loading teachers..." : teachers.length === 0 ? "No teachers found." : `${teachers.length} teachers available`}
                    >
                      {loadingTeachers ? (
                        <MenuItem value="">Loading...</MenuItem>
                      ) : teachers.length === 0 ? (
                        <MenuItem value="">No teachers available</MenuItem>
                      ) : (
                        <>
                          <MenuItem value="">Select a teacher</MenuItem>
                          {teachers.map((teacher) => (
                            <MenuItem key={teacher._id} value={teacher._id}>
                              👨‍🏫 {teacher.name} {teacher.email ? `(${teacher.email})` : ''}
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      label="Teacher Name *"
                      value={formData.teacherName}
                      onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                      placeholder="Enter teacher's full name"
                      required
                      helperText="Enter the name of an external or guest teacher"
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Room/Class Number"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g., Room 101, Lab A"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenDialog(false)} size="large">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loadingTeachers || !formData.teacher}
              >
                {loadingTeachers ? 'Loading...' : 'Add to Timetable'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Timetable;

