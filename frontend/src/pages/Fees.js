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
} from '@mui/material';
import { Add, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Fees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    feeType: 'Tuition',
    amount: '',
    dueDate: '',
    academicYear: '2024-2025',
  });

  useEffect(() => {
    fetchFees();
    if (user.role === 'admin') {
      fetchStudents();
    }
  }, [user]);

  const fetchFees = async () => {
    try {
      const url = user.role === 'student'
        ? `http://localhost:5000/api/fees/student/${user._id}`
        : 'http://localhost:5000/api/fees';
      
      const response = await axios.get(url);
      if (response.data.success) {
        setFees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to fetch fees');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/fees', formData);
      if (response.data.success) {
        toast.success('Fee record created successfully');
        setOpenDialog(false);
        fetchFees();
        setFormData({
          studentId: '',
          feeType: 'Tuition',
          amount: '',
          dueDate: '',
          academicYear: '2024-2025',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create fee record');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      case 'Partial':
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
              Fees Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage fee payments
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
                Add Fee Record
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
                        {user.role !== 'student' && <TableCell>Student</TableCell>}
                        <TableCell>Fee Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Paid Amount</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fees.map((fee, index) => (
                        <motion.tr
                          key={fee._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          component="tr"
                        >
                          {user.role !== 'student' && (
                            <TableCell>{fee.studentId?.name}</TableCell>
                          )}
                          <TableCell>{fee.feeType}</TableCell>
                          <TableCell>₹{fee.amount}</TableCell>
                          <TableCell>₹{fee.paidAmount}</TableCell>
                          <TableCell>
                            {new Date(fee.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={fee.status}
                              color={getStatusColor(fee.status)}
                              size="small"
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                      {fees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" color="text.secondary" py={3}>
                              No fee records found
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

        {/* Add Fee Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Fee Record</DialogTitle>
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
                    select
                    label="Fee Type"
                    value={formData.feeType}
                    onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                    required
                  >
                    <MenuItem value="Tuition">Tuition</MenuItem>
                    <MenuItem value="Exam">Exam</MenuItem>
                    <MenuItem value="Library">Library</MenuItem>
                    <MenuItem value="Transport">Transport</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
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

export default Fees;

