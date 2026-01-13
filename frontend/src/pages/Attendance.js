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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
  Box as MuiBox,
  Avatar,
} from '@mui/material';
import { Add, CalendarToday, FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: '',
  });
  const [bulkAttendanceMode, setBulkAttendanceMode] = useState(false);
  const [selectedClassForBulk, setSelectedClassForBulk] = useState('');
  const [selectedSectionForBulk, setSelectedSectionForBulk] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classStudents, setClassStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetchAttendance();
    if (user.role !== 'student') {
      fetchStudents();
    }
  }, [user]);

  useEffect(() => {
    filterAttendance();
  }, [attendance, selectedClass, selectedSection]);

  const filterAttendance = () => {
    if (user.role === 'student') {
      setFilteredAttendance(attendance);
      return;
    }

    let filtered = attendance;

    if (selectedClass !== 'All') {
      filtered = filtered.filter(record => record.studentId?.class === selectedClass);
    }

    if (selectedSection !== 'All') {
      filtered = filtered.filter(record => record.studentId?.section === selectedSection);
    }

    setFilteredAttendance(filtered);
  };

  const fetchAttendance = async () => {
    try {
      const url = user.role === 'student'
        ? `http://localhost:5000/api/attendance/student/${user._id}`
        : 'http://localhost:5000/api/attendance';
      
      const response = await axios.get(url);
      if (response.data.success) {
        setAttendance(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const loadClassStudents = () => {
    if (!selectedClassForBulk) {
      toast.error('Please select a class');
      return;
    }

    let filtered = students.filter(s => s.class === selectedClassForBulk);
    
    if (selectedSectionForBulk) {
      filtered = filtered.filter(s => s.section === selectedSectionForBulk);
    }

    if (filtered.length === 0) {
      toast.error('No students found in this class');
      return;
    }

    setClassStudents(filtered);
    
    // Initialize attendance data - all marked as Present by default
    const initialAttendance = {};
    filtered.forEach(student => {
      initialAttendance[student._id] = 'Present';
    });
    setAttendanceData(initialAttendance);
    
    toast.success(`Loaded ${filtered.length} students from Class ${selectedClassForBulk}${selectedSectionForBulk ? '-' + selectedSectionForBulk : ''}`);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkSubmit = async () => {
    if (!selectedLecture) {
      toast.error('Please select a lecture/period');
      return;
    }

    if (classStudents.length === 0) {
      toast.error('No students loaded');
      return;
    }

    try {
      const promises = classStudents.map(student => {
        return axios.post('http://localhost:5000/api/attendance', {
          studentId: student._id,
          date: selectedDate,
          status: attendanceData[student._id] || 'Present',
          subject: selectedLecture,
          remarks: `Lecture: ${selectedLecture}`
        });
      });

      await Promise.all(promises);
      toast.success(`Attendance marked successfully for ${classStudents.length} students!`);
      setBulkAttendanceMode(false);
      setClassStudents([]);
      setAttendanceData({});
      fetchAttendance();
    } catch (error) {
      if (error.response?.status === 400) {
        toast.warning('Attendance already marked for some students on this date');
      } else {
        toast.error('Failed to mark attendance');
      }
      console.error('Error marking attendance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/attendance', formData);
      if (response.data.success) {
        toast.success('Attendance marked successfully');
        setOpenDialog(false);
        fetchAttendance();
        setFormData({
          studentId: '',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
          remarks: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Absent':
        return 'error';
      case 'Late':
        return 'warning';
      case 'Excused':
        return 'info';
      default:
        return 'default';
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
              Attendance Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role !== 'student' && `Total Records: ${attendance.length} | Showing: ${filteredAttendance.length}`}
              {user.role === 'student' && 'Track and manage your attendance'}
            </Typography>
          </motion.div>
          {(user.role === 'teacher' || user.role === 'admin') && (
            <Box display="flex" gap={2}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={bulkAttendanceMode ? "outlined" : "contained"}
                  startIcon={<CalendarToday />}
                  onClick={() => {
                    setBulkAttendanceMode(true);
                    setClassStudents([]);
                  }}
                >
                  Mark Class Attendance
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                >
                  Individual Entry
                </Button>
              </motion.div>
            </Box>
          )}
        </Box>

        {/* Bulk Attendance Marking Section */}
        {bulkAttendanceMode && user.role !== 'student' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  📋 Mark Attendance for Entire Class
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      select
                      label="Class"
                      value={selectedClassForBulk}
                      onChange={(e) => setSelectedClassForBulk(e.target.value)}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {[...Array(12)].map((_, i) => (
                        <MenuItem key={i+1} value={String(i+1)}>Class {i+1}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      select
                      label="Section"
                      value={selectedSectionForBulk}
                      onChange={(e) => setSelectedSectionForBulk(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="A">Section A</MenuItem>
                      <MenuItem value="B">Section B</MenuItem>
                      <MenuItem value="C">Section C</MenuItem>
                      <MenuItem value="D">Section D</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      select
                      label="Lecture/Subject"
                      value={selectedLecture}
                      onChange={(e) => setSelectedLecture(e.target.value)}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Mathematics">Mathematics</MenuItem>
                      <MenuItem value="Physics">Physics</MenuItem>
                      <MenuItem value="Chemistry">Chemistry</MenuItem>
                      <MenuItem value="Biology">Biology</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="History">History</MenuItem>
                      <MenuItem value="Geography">Geography</MenuItem>
                      <MenuItem value="Computer Science">Computer Science</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={loadClassStudents}
                      sx={{ height: '56px' }}
                    >
                      Load Students
                    </Button>
                  </Grid>
                </Grid>

                {classStudents.length > 0 && (
                  <>
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="600" color="info.dark">
                        📚 Class {selectedClassForBulk}{selectedSectionForBulk ? `-${selectedSectionForBulk}` : ''} - {classStudents.length} Students
                      </Typography>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell width="10%">Roll No</TableCell>
                            <TableCell width="30%">Student Name</TableCell>
                            <TableCell width="60%">Attendance Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {classStudents.map((student, index) => (
                            <TableRow key={student._id}>
                              <TableCell>
                                <Chip label={student.rollNo} size="small" color="primary" />
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Avatar sx={{ mr: 2, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                    {student.name.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight="600">
                                    {student.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" gap={1}>
                                  <Button
                                    size="small"
                                    variant={attendanceData[student._id] === 'Present' ? 'contained' : 'outlined'}
                                    color="success"
                                    onClick={() => handleAttendanceChange(student._id, 'Present')}
                                  >
                                    Present
                                  </Button>
                                  <Button
                                    size="small"
                                    variant={attendanceData[student._id] === 'Absent' ? 'contained' : 'outlined'}
                                    color="error"
                                    onClick={() => handleAttendanceChange(student._id, 'Absent')}
                                  >
                                    Absent
                                  </Button>
                                  <Button
                                    size="small"
                                    variant={attendanceData[student._id] === 'Late' ? 'contained' : 'outlined'}
                                    color="warning"
                                    onClick={() => handleAttendanceChange(student._id, 'Late')}
                                  >
                                    Late
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setBulkAttendanceMode(false);
                          setClassStudents([]);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleBulkSubmit}
                        size="large"
                      >
                        Submit Attendance ({classStudents.length} students)
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filter Section - Only for Admin/Teacher */}
        {user.role !== 'student' && !bulkAttendanceMode && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <FilterList color="primary" />
                <Typography variant="subtitle1" fontWeight="600">
                  Filter by:
                </Typography>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={selectedClass}
                    label="Class"
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <MenuItem value="All">All Classes</MenuItem>
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
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={selectedSection}
                    label="Section"
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <MenuItem value="All">All Sections</MenuItem>
                    <MenuItem value="A">Section A</MenuItem>
                    <MenuItem value="B">Section B</MenuItem>
                    <MenuItem value="C">Section C</MenuItem>
                    <MenuItem value="D">Section D</MenuItem>
                  </Select>
                </FormControl>
                <Chip 
                  label={`${filteredAttendance.length} records`} 
                  color="primary" 
                  sx={{ ml: 'auto' }}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {loading && !bulkAttendanceMode ? (
          <LinearProgress />
        ) : !bulkAttendanceMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {user.role !== 'student' && <TableCell>Student</TableCell>}
                        {user.role !== 'student' && <TableCell>Roll No</TableCell>}
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(user.role === 'student' ? attendance : filteredAttendance).map((record, index) => (
                        <motion.tr
                          key={record._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          component="tr"
                        >
                          {user.role !== 'student' && (
                            <TableCell>{record.studentId?.name}</TableCell>
                          )}
                          {user.role !== 'student' && (
                            <TableCell>{record.studentId?.rollNo}</TableCell>
                          )}
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              color={getStatusColor(record.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{record.remarks || '-'}</TableCell>
                        </motion.tr>
                      ))}
                      {(user.role === 'student' ? attendance : filteredAttendance).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={user.role === 'student' ? 3 : 5} align="center">
                            <Typography variant="body2" color="text.secondary" py={3}>
                              No attendance records found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mark Attendance Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Mark Attendance</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Student"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  >
                    {students.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.name} - {student.rollNo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                    <MenuItem value="Late">Late</MenuItem>
                    <MenuItem value="Excused">Excused</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
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

export default Attendance;

