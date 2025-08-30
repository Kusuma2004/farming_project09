import React from 'react';
import {
  Box,
  Card,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grow,
} from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';
import NatureIcon from '@mui/icons-material/Nature';
import GrainIcon from '@mui/icons-material/Grain';

export default function CropDetails() {
  const parameters = [
    { label: 'Nitrogen content in soil', icon: <GrainIcon color="primary" /> },
    { label: 'Phosphorus content', icon: <GrainIcon color="secondary" /> },
    { label: 'Potassium content', icon: <GrainIcon color="success" /> },
    { label: 'Temperature', icon: <ThermostatIcon color="error" /> },
    { label: 'Humidity', icon: <OpacityIcon color="info" /> },
    { label: 'Soil pH level', icon: <NatureIcon color="warning" /> },
    { label: 'Rainfall amount', icon: <WaterIcon color="secondary" /> },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/crop_background.jpg')`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Grow in timeout={1200}>
        <Card
          sx={{
            maxWidth: 650,
            width: '100%',
            boxShadow: 8,
            borderRadius: 4,
            bgcolor: 'white',
            p: 4,
          }}
          elevation={10}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
            color='green'
            sx={{ mb: 2 }}
          >
            Crop Prediction Application
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="body1" paragraph>
            This application predicts the most suitable crop to cultivate based on various soil and climatic parameters.
          </Typography>

          <Typography variant="body1" paragraph>
            The prediction considers key factors such as:
          </Typography>

          <List>
            {parameters.map(({ label, icon }) => (
              <ListItem key={label}>
                <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            Based on these parameters, the system recommends the best crop to maximize yield and sustainability, such as rice, maize, peas, cotton, coffee, mango, and many more.
          </Typography>

          <Typography variant="body1" paragraph>
            This helps farmers and agricultural planners make informed decisions to optimize crop production suited to local soil and weather conditions.
          </Typography>
        </Card>
      </Grow>
    </Box>
  );
}
