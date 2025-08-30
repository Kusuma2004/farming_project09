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

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OpacityIcon from '@mui/icons-material/Opacity';
import BugReportIcon from '@mui/icons-material/BugReport';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import PublicIcon from '@mui/icons-material/Public';
import AgricultureIcon from '@mui/icons-material/Agriculture';

export default function CropYieldDetails() {
  const parameters = [
    { label: 'Year of Cultivation', icon: <CalendarMonthIcon color="primary" /> },
    { label: 'Average Rainfall (mm/year)', icon: <OpacityIcon color="info" /> },
    { label: 'Pesticides Used (tonnes)', icon: <BugReportIcon color="error" /> },
    { label: 'Average Temperature (°C)', icon: <ThermostatIcon color="warning" /> },
    { label: 'Area / Country', icon: <PublicIcon color="success" /> },
    { label: 'Crop Type', icon: <AgricultureIcon color="secondary" /> },
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
            boxShadow: 10,
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
            Crop Yield Prediction
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body1" paragraph>
            Our Crop Yield Prediction system leverages agricultural data and machine learning to estimate the crop yield for a given season.
          </Typography>

          <Typography variant="body1" paragraph>
            The prediction considers the following critical parameters:
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
            These inputs help predict the expected yield of crops like wheat, maize, rice, pulses, etc., across various regions and seasons.
          </Typography>

          <Typography variant="body1" paragraph>
            This feature empowers farmers, policymakers, and agri-businesses to make data-driven decisions and improve food production planning.
          </Typography>
        </Card>
      </Grow>
    </Box>
  );
}
