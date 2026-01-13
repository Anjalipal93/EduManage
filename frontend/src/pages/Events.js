import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
  CardMedia,
} from '@mui/material';
import { Add, Event as EventIcon, LocationOn, People } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Academic',
    eventDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    targetAudience: ['All'],
    organizer: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/events', formData);
      if (response.data.success) {
        toast.success('Event created successfully');
        setOpenDialog(false);
        fetchEvents();
        setFormData({
          title: '',
          description: '',
          eventType: 'Academic',
          eventDate: '',
          startTime: '',
          endTime: '',
          venue: '',
          targetAudience: ['All'],
          organizer: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      Academic: 'primary',
      Sports: 'success',
      Cultural: 'secondary',
      Holiday: 'warning',
      Meeting: 'info',
      Other: 'default',
    };
    return colors[type] || 'default';
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
              Events & Announcements
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated with school events
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
                Create Event
              </Button>
            </motion.div>
          )}
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card sx={{ height: '100%' }}>
                    {event.imageUrl && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={event.imageUrl}
                        alt={event.title}
                      />
                    )}
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {event.title}
                        </Typography>
                        <Chip
                          label={event.eventType}
                          color={getEventTypeColor(event.eventType)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {event.description}
                      </Typography>

                      <Box display="flex" alignItems="center" mb={1}>
                        <EventIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {event.startTime && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            🕐 {event.startTime} - {event.endTime}
                          </Typography>
                        </Box>
                      )}

                      {event.venue && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {event.venue}
                          </Typography>
                        </Box>
                      )}

                      {event.organizer && (
                        <Box display="flex" alignItems="center">
                          <People sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Organized by {event.organizer}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
            {events.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" textAlign="center" py={5}>
                  No events available
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* Create Event Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Event</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Event Type"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    required
                  >
                    <MenuItem value="Academic">Academic</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Cultural">Cultural</MenuItem>
                    <MenuItem value="Holiday">Holiday</MenuItem>
                    <MenuItem value="Meeting">Meeting</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Event Date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organizer"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Events;

