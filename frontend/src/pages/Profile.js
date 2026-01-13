import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { Email, Phone, School, Person, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const InfoItem = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Box
      sx={{
        bgcolor: 'primary.light',
        borderRadius: 2,
        p: 1,
        mr: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="600">
        {value || 'Not provided'}
      </Typography>
    </Box>
  </Box>
);

const Profile = () => {
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
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            View and manage your profile information
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'primary.main',
                      fontSize: 48,
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user?.name}
                  </Typography>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    color="primary"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon={<Person sx={{ color: 'white' }} />}
                        label="Full Name"
                        value={user?.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon={<Email sx={{ color: 'white' }} />}
                        label="Email Address"
                        value={user?.email}
                      />
                    </Grid>
                    {user?.rollNo && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon={<School sx={{ color: 'white' }} />}
                          label="Roll Number"
                          value={user.rollNo}
                        />
                      </Grid>
                    )}
                    {user?.class && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon={<School sx={{ color: 'white' }} />}
                          label="Class"
                          value={`${user.class} ${user.section ? `- ${user.section}` : ''}`}
                        />
                      </Grid>
                    )}
                    {user?.phone && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon={<Phone sx={{ color: 'white' }} />}
                          label="Phone Number"
                          value={user.phone}
                        />
                      </Grid>
                    )}
                    {user?.dateOfBirth && (
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon={<CalendarToday sx={{ color: 'white' }} />}
                          label="Date of Birth"
                          value={new Date(user.dateOfBirth).toLocaleDateString()}
                        />
                      </Grid>
                    )}
                    {user?.address && (
                      <Grid item xs={12}>
                        <InfoItem
                          icon={<Person sx={{ color: 'white' }} />}
                          label="Address"
                          value={user.address}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Profile;

