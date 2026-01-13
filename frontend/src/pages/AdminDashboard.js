import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  People,
  School,
  AttachMoney,
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout from '../components/Layout';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
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
            <Typography variant="h3" fontWeight="bold" color={color} gutterBottom>
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
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                <Typography variant="caption" color="#10b981" fontWeight={600}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}20`,
              borderRadius: 3,
              p: 1.5,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/admin');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = [
    { month: 'Jan', students: 120, fees: 450000 },
    { month: 'Feb', students: 135, fees: 480000 },
    { month: 'Mar', students: 145, fees: 520000 },
    { month: 'Apr', students: 160, fees: 580000 },
    { month: 'May', students: 175, fees: 620000 },
    { month: 'Jun', students: 185, fees: 650000 },
  ];

  const attendanceData = [
    { name: 'Present', value: dashboardData?.todayAttendance.present || 0, color: '#10b981' },
    { name: 'Absent', value: (dashboardData?.todayAttendance.total || 0) - (dashboardData?.todayAttendance.present || 0), color: '#ef4444' },
  ];

  return (
    <Layout>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Complete overview of school management
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
                  title="Total Students"
                  value={dashboardData?.students || 0}
                  icon={<People sx={{ fontSize: 32, color: '#6366f1' }} />}
                  color="#6366f1"
                  trend="+12% this month"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Teachers"
                  value={dashboardData?.teachers || 0}
                  icon={<School sx={{ fontSize: 32, color: '#8b5cf6' }} />}
                  color="#8b5cf6"
                  trend="+3 new this month"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Fees Collected"
                  value={`₹${(dashboardData?.feesCollection || 0).toLocaleString()}`}
                  icon={<AttachMoney sx={{ fontSize: 32, color: '#10b981' }} />}
                  color="#10b981"
                  subtitle="This month"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Pending Fees"
                  value={`₹${(dashboardData?.pendingFees || 0).toLocaleString()}`}
                  icon={<Warning sx={{ fontSize: 32, color: '#f59e0b' }} />}
                  color="#f59e0b"
                  subtitle="To be collected"
                />
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Student Growth & Fee Collection
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="students"
                            stroke="#6366f1"
                            strokeWidth={3}
                            name="Students"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="fees"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Fees (₹)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} lg={4}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Today's Attendance
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
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
            </Grid>

            {/* Recent Events */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Recent School Events
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {dashboardData?.recentEvents?.map((event, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                                border: '1px solid',
                                borderColor: 'grey.200',
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                {event.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(event.eventDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                        {(!dashboardData?.recentEvents || dashboardData.recentEvents.length === 0) && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                              No recent events
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
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

export default AdminDashboard;

