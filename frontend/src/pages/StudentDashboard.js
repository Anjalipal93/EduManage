import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  TrendingUp,
  AttachMoney,
  CalendarToday,
  Grade,
  Event as EventIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
        border: `2px solid ${color}40`,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}20`,
              borderRadius: 3,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/student/${user._id}`);
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const attendanceData = dashboardData
    ? [
        { name: 'Present', value: dashboardData.attendance.presentDays, color: '#10b981' },
        { name: 'Absent', value: dashboardData.attendance.absentDays, color: '#ef4444' },
      ]
    : [];

  const feesStatus = dashboardData
    ? [
        { name: 'Paid', amount: dashboardData.fees.paidFees },
        { name: 'Pending', amount: dashboardData.fees.pendingFees },
      ]
    : [];

  return (
    <Layout>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Student Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome back! Here's your academic overview
          </Typography>
        </motion.div>

        {loading ? (
          <LinearProgress />
        ) : (
          <>
            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Attendance"
                  value={`${dashboardData?.attendance.percentage || 0}%`}
                  subtitle={`${dashboardData?.attendance.presentDays || 0}/${dashboardData?.attendance.totalDays || 0} days`}
                  icon={<CalendarToday sx={{ fontSize: 32, color: '#6366f1' }} />}
                  color="#6366f1"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Fees Status"
                  value={dashboardData?.fees.status || 'Pending'}
                  subtitle={`₹${dashboardData?.fees.pendingFees || 0} pending`}
                  icon={<AttachMoney sx={{ fontSize: 32, color: '#f59e0b' }} />}
                  color={dashboardData?.fees.status === 'Paid' ? '#10b981' : '#f59e0b'}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Recent Marks"
                  value={dashboardData?.recentMarks?.length || 0}
                  subtitle="Exam results"
                  icon={<Grade sx={{ fontSize: 32, color: '#8b5cf6' }} />}
                  color="#8b5cf6"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Upcoming Events"
                  value={dashboardData?.upcomingEvents?.length || 0}
                  subtitle="School events"
                  icon={<EventIcon sx={{ fontSize: 32, color: '#10b981' }} />}
                  color="#10b981"
                />
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Attendance Overview
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {attendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Fees Status
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={feesStatus}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Recent Marks & Events */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Recent Exam Results
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {dashboardData?.recentMarks?.length > 0 ? (
                        <List>
                          {dashboardData.recentMarks.map((mark, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Grade color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={mark.subject}
                                secondary={`${mark.examType} - ${mark.marksObtained}/${mark.totalMarks}`}
                              />
                              <Chip
                                label={mark.grade}
                                size="small"
                                color={
                                  mark.percentage >= 90
                                    ? 'success'
                                    : mark.percentage >= 75
                                    ? 'primary'
                                    : mark.percentage >= 60
                                    ? 'warning'
                                    : 'error'
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                          No exam results available yet
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Upcoming Events
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {dashboardData?.upcomingEvents?.length > 0 ? (
                        <List>
                          {dashboardData.upcomingEvents.map((event, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemIcon>
                                <EventIcon color="success" />
                              </ListItemIcon>
                              <ListItemText
                                primary={event.title}
                                secondary={new Date(event.eventDate).toLocaleDateString()}
                              />
                              <Chip
                                label={event.eventType}
                                size="small"
                                variant="outlined"
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                          No upcoming events
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default StudentDashboard;

