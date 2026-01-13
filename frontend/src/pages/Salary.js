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
} from '@mui/material';
import { Add, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Salary = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    basicSalary: '',
    allowances: 0,
    deductions: 0,
    status: 'Pending',
    remarks: '',
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchSalaries();
    if (user.role === 'admin') {
      fetchTeachers();
    }
  }, [user]);

  const fetchSalaries = async () => {
    try {
      const url = user.role === 'teacher'
        ? `http://localhost:5000/api/salary/teacher/${user._id}`
        : 'http://localhost:5000/api/salary';
      
      const response = await axios.get(url);
      if (response.data.success) {
        setSalaries(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching salaries:', error);
      toast.error('Failed to fetch salary records');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      if (response.data.success) {
        const teachersList = response.data.data.filter(u => u.role === 'teacher');
        setTeachers(teachersList);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/salary', formData);
      if (response.data.success) {
        toast.success('Salary record created successfully');
        setOpenDialog(false);
        fetchSalaries();
        setFormData({
          teacherId: '',
          month: new Date().toLocaleString('default', { month: 'long' }),
          year: new Date().getFullYear(),
          basicSalary: '',
          allowances: 0,
          deductions: 0,
          status: 'Pending',
          remarks: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create salary record');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      default:
        return 'default';
    }
  };

  const netSalary = formData.basicSalary ? 
    parseFloat(formData.basicSalary) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0) : 0;

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.role === 'teacher' ? 'My Salary' : 'Teacher Salary Management'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role === 'teacher' ? 'View your salary history' : 'Manage teacher remuneration records'}
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
                Add Salary Record
              </Button>
            </motion.div>
          )}
        </Box>

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
                        {user.role !== 'teacher' && <TableCell>Teacher</TableCell>}
                        <TableCell>Month/Year</TableCell>
                        <TableCell>Basic Salary</TableCell>
                        <TableCell>Allowances</TableCell>
                        <TableCell>Deductions</TableCell>
                        <TableCell>Net Salary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salaries.map((salary, index) => (
                        <motion.tr
                          key={salary._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          component="tr"
                        >
                          {user.role !== 'teacher' && (
                            <TableCell>{salary.teacherId?.name}</TableCell>
                          )}
                          <TableCell>
                            {salary.month} {salary.year}
                          </TableCell>
                          <TableCell>₹{salary.basicSalary.toLocaleString()}</TableCell>
                          <TableCell>₹{salary.allowances.toLocaleString()}</TableCell>
                          <TableCell>₹{salary.deductions.toLocaleString()}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              ₹{salary.netSalary.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={salary.status}
                              color={getStatusColor(salary.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {salary.paymentDate 
                              ? new Date(salary.paymentDate).toLocaleDateString()
                              : '-'}
                          </TableCell>
                        </motion.tr>
                      ))}
                      {salaries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            <Typography variant="body2" color="text.secondary" py={3}>
                              No salary records found
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

        {/* Add Salary Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add Salary Record</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Teacher"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    required
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.email}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Basic Salary (₹)"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Allowances (₹)"
                    value={formData.allowances}
                    onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Deductions (₹)"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
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
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box p={2} bgcolor="primary.light" borderRadius={2}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Net Salary: ₹{netSalary.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
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

export default Salary;

