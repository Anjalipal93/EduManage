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
  Avatar,
  IconButton,
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
  Box as MuiBox,
} from '@mui/material';
import { Add, Edit, Delete, Person, FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    class: '',
    section: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, selectedClass, selectedSection]);

  const filterStudents = () => {
    let filtered = students;

    if (selectedClass !== 'All') {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    if (selectedSection !== 'All') {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    setFilteredStudents(filtered);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/students', formData);
      if (response.data.success) {
        toast.success('Student added successfully');
        setOpenDialog(false);
        fetchStudents();
        setFormData({
          name: '',
          email: '',
          password: '',
          rollNo: '',
          class: '',
          section: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/students/${id}`);
        if (response.data.success) {
          toast.success('Student deleted successfully');
          fetchStudents();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete student');
      }
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
              Students Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Students: {students.length} | Showing: {filteredStudents.length}
            </Typography>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add Student
            </Button>
          </motion.div>
        </Box>

        {/* Filter Section */}
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
                label={`${filteredStudents.length} students`} 
                color="primary" 
                sx={{ ml: 'auto' }}
              />
            </Box>
          </CardContent>
        </Card>

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
                        <TableCell>Student</TableCell>
                        <TableCell>Roll No</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.map((student, index) => (
                        <motion.tr
                          key={student._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          component="tr"
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {student.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight="600">
                                {student.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell>
                            {student.class} {student.section && `- ${student.section}`}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phone || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={student.isActive ? 'Active' : 'Inactive'}
                              color={student.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" color="error" onClick={() => handleDelete(student._id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </motion.tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography variant="body2" color="text.secondary" py={3}>
                              No students found
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

        {/* Add Student Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Student</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Roll Number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Section"
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
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

export default Students;

