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
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScienceIcon from '@mui/icons-material/Science';
import SpaIcon from '@mui/icons-material/Spa';
import AgricultureIcon from '@mui/icons-material/Agriculture';

export default function FertilizerDetails() {
  const parameters = [
    { label: 'Temperature', icon: <ThermostatIcon color="error" /> },
    { label: 'Humidity', icon: <OpacityIcon color="info" /> },
    { label: 'Moisture', icon: <WaterDropIcon color="primary" /> },
    { label: 'Nitrogen (N)', icon: <ScienceIcon color="success" /> },
    { label: 'Phosphorus (P)', icon: <ScienceIcon color="warning" /> },
    { label: 'Potassium (K)', icon: <ScienceIcon color="secondary" /> },
    { label: 'Soil Type (Red, Black, Sandy)', icon: <SpaIcon color="secondary" /> },
    { label: 'Crop Type (Rice, Maize, Pulses, Millets)', icon: <AgricultureIcon color="success" /> },
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
            maxWidth: 700,
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
            color="green"
            sx={{ mb: 2 }}
          >
            Fertilizer Recommendation Application
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="body1" paragraph>
            This application helps recommend the most suitable fertilizer based on soil and crop conditions to ensure optimal crop growth and yield.
          </Typography>

          <Typography variant="body1" paragraph>
            It considers the following parameters:
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
            Based on these, the model intelligently suggests whether to increase or decrease NPK levels and selects the best fertilizer accordingly.
          </Typography>

          <Typography variant="body1" paragraph>
            This empowers farmers to make smart, data-driven choices for sustainable and efficient agriculture.
          </Typography>
        </Card>
      </Grow>
    </Box>
  );
}
