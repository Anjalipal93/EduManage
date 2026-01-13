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
  Chip,
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
  Box as MuiBox,
} from '@mui/material';
import { Add, Grade, FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Marks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    subject: '',
    examType: 'Mid Term',
    marksObtained: '',
    totalMarks: '',
  });

  useEffect(() => {
    fetchMarks();
    if (user.role !== 'student') {
      fetchStudents();
      fetchExams();
    }
  }, [user]);

  useEffect(() => {
    filterMarks();
  }, [marks, selectedClass, selectedSection]);

  const filterMarks = () => {
    if (user.role === 'student') {
      setFilteredMarks(marks);
      return;
    }

    let filtered = marks;

    if (selectedClass !== 'All') {
      filtered = filtered.filter(mark => mark.studentId?.class === selectedClass);
    }

    if (selectedSection !== 'All') {
      filtered = filtered.filter(mark => mark.studentId?.section === selectedSection);
    }

    setFilteredMarks(filtered);
  };

  const fetchMarks = async () => {
    try {
      const url = user.role === 'student'
        ? `http://localhost:5000/api/marks/student/${user._id}`
        : 'http://localhost:5000/api/marks';
      
      const response = await axios.get(url);
      if (response.data.success) {
        setMarks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      toast.error('Failed to fetch marks');
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

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exams');
      if (response.data.success) {
        setExams(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/marks', formData);
      if (response.data.success) {
        toast.success('Marks added successfully');
        setOpenDialog(false);
        fetchMarks();
        setFormData({
          studentId: '',
          examId: '',
          subject: '',
          examType: 'Mid Term',
          marksObtained: '',
          totalMarks: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add marks');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'success',
      'A': 'success',
      'B+': 'info',
      'B': 'info',
      'C': 'warning',
      'D': 'warning',
      'F': 'error',
    };
    return colors[grade] || 'default';
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
              Marks & Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role !== 'student' && `Total Records: ${marks.length} | Showing: ${filteredMarks.length}`}
              {user.role === 'student' && 'View and manage your exam marks'}
            </Typography>
          </motion.div>
          {(user.role === 'teacher' || user.role === 'admin') && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
              >
                Add Marks
              </Button>
            </motion.div>
          )}
        </Box>

        {/* Filter Section - Only for Admin/Teacher */}
        {user.role !== 'student' && (
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
                  label={`${filteredMarks.length} records`} 
                  color="primary" 
                  sx={{ ml: 'auto' }}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <LinearProgress />
        ) : (
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
                        <TableCell>Subject</TableCell>
                        <TableCell>Exam Type</TableCell>
                        <TableCell>Marks Obtained</TableCell>
                        <TableCell>Total Marks</TableCell>
                        <TableCell>Percentage</TableCell>
                        <TableCell>Grade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(user.role === 'student' ? marks : filteredMarks).map((mark, index) => (
                        <motion.tr
                          key={mark._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          component="tr"
                        >
                          {user.role !== 'student' && (
                            <TableCell>{mark.studentId?.name}</TableCell>
                          )}
                          <TableCell>{mark.subject}</TableCell>
                          <TableCell>{mark.examType}</TableCell>
                          <TableCell>{mark.marksObtained}</TableCell>
                          <TableCell>{mark.totalMarks}</TableCell>
                          <TableCell>{mark.percentage}%</TableCell>
                          <TableCell>
                            <Chip
                              label={mark.grade}
                              color={getGradeColor(mark.grade)}
                              size="small"
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                      {(user.role === 'student' ? marks : filteredMarks).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography variant="body2" color="text.secondary" py={3}>
                              No marks records found
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

        {/* Add Marks Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Marks</DialogTitle>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Exam"
                    value={formData.examId}
                    onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                    required
                  >
                    {exams.map((exam) => (
                      <MenuItem key={exam._id} value={exam._id}>
                        {exam.examName} - {exam.subject}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
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
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Marks Obtained"
                    value={formData.marksObtained}
                    onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
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

export default Marks;

