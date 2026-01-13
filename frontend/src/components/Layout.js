import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  CalendarToday,
  AttachMoney,
  Book,
  Schedule,
  Assignment,
  Grade,
  Event,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: `/${user?.role}/dashboard` },
      { text: 'Attendance', icon: <CalendarToday />, path: '/attendance' },
      { text: 'Courses', icon: <Book />, path: '/courses' },
      { text: 'Timetable', icon: <Schedule />, path: '/timetable' },
      { text: 'Exams', icon: <Assignment />, path: '/exams' },
      { text: 'Marks', icon: <Grade />, path: '/marks' },
      { text: 'Events', icon: <Event />, path: '/events' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems.slice(0, 1),
        { text: 'Students', icon: <People />, path: '/admin/students' },
        { text: 'Fees', icon: <AttachMoney />, path: '/fees' },
        { text: 'Teacher Salary', icon: <AttachMoney />, path: '/admin/salary' },
        ...commonItems.slice(1),
      ];
    }

    if (user?.role === 'student') {
      return [
        ...commonItems.slice(0, 1),
        { text: 'Fees', icon: <AttachMoney />, path: '/fees' },
        ...commonItems.slice(1),
      ];
    }

    if (user?.role === 'teacher') {
      return [
        ...commonItems,
        { text: 'My Salary', icon: <AttachMoney />, path: '/salary' },
      ];
    }

    return commonItems;
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: 'white',
        }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Book sx={{ fontSize: 40 }} />
        </motion.div>
        <Typography variant="h5" fontWeight="bold">
          EduManage
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ px: 2, pt: 2 }}>
        {getMenuItems().map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: 'white',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Welcome, {user?.name}!
          </Typography>
          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout;

