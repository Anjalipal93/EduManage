import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  People,
  Assignment,
  Grade,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon, color, action }) => (
  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
        border: `2px solid ${color}40`,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h3" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {title}
            </Typography>
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
        {action && (
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderColor: color,
              color: color,
              '&:hover': {
                borderColor: color,
                bgcolor: `${color}10`,
              },
            }}
          >
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Teacher Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage your classes and student progress
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="My Students"
              value="45"
              icon={<People sx={{ fontSize: 32, color: '#6366f1' }} />}
              color="#6366f1"
              action="View All"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Assignments"
              value="12"
              icon={<Assignment sx={{ fontSize: 32, color: '#8b5cf6' }} />}
              color="#8b5cf6"
              action="Manage"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Grades"
              value="8"
              icon={<Grade sx={{ fontSize: 32, color: '#f59e0b' }} />}
              color="#f59e0b"
              action="Grade Now"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Today's Classes"
              value="4"
              icon={<CalendarToday sx={{ fontSize: 32, color: '#10b981' }} />}
              color="#10b981"
              action="View Schedule"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Today's Schedule
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    {[
                      { time: '09:00 - 10:00', subject: 'Mathematics', class: 'Class 10-A' },
                      { time: '10:15 - 11:15', subject: 'Physics', class: 'Class 10-B' },
                      { time: '11:30 - 12:30', subject: 'Mathematics', class: 'Class 9-A' },
                      { time: '14:00 - 15:00', subject: 'Physics Lab', class: 'Class 10-A' },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: 'grey.50',
                            border: '1px solid',
                            borderColor: 'grey.200',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight="600">
                              {item.subject}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.time}
                            </Typography>
                          </Box>
                          <Chip label={item.class} color="primary" />
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => window.location.href = '/attendance'}
                    >
                      Mark Attendance
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.location.href = '/marks'}
                    >
                      Add Marks
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.location.href = '/courses'}
                    >
                      View Courses
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[
                      'Attendance marked for Class 10-A',
                      'Marks uploaded for Mid-term',
                      'New assignment created',
                    ].map((activity, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        • {activity}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default TeacherDashboard;

