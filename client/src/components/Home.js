// src/components/Home.js
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
} from '@mui/material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url('/homephoto.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Precision Agriculture Using Machine Learning
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Get information details about your Farming Strategy
        </Typography>
      </Box>

      {/* About Us Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          About Us
        </Typography>
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction="row"
          sx={{ flexDirection: { xs: 'column', md: 'row' } }}
        >
          <Grid item xs={12} md={6}>
            <Card elevation={4}>
              <CardMedia
                component="img"
                height="300"
                image="/aboutimage.jpg?v=1"
                alt="About"
                sx={{ objectFit: 'cover', borderRadius: 2 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ px: { xs: 1, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Improving Agriculture, Improving Lives
              </Typography>
              <Typography variant="body1">
                We use state-of-the-art machine learning and deep learning technologies to help guide
                you through the entire farming process. Make informed decisions to understand the
                demographics of your area, identify factors affecting your crops, and keep them healthy
                for a highly productive yield.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Services Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Crop',
                description: 'Recommendation about the type of crops to be cultivated.',
                image: '/cropimage.jpg',
                route: '/crop-detail',
              },
              {
                title: 'Fertilizer',
                description: 'Recommendation about the type of fertilizer to use.',
                image: '/ferilizerimage.jpg',
                route: '/fertilizer-detail',
              },
              {
                title: 'Crop yield prediction',
                description: 'Predicting the yield for a particular crop.',
                image: '/cropdiseaseimage.jpg',
                route: '/crop-yield-detail',
              },
            ].map((service, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {service.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => navigate(service.route)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#2e7d32', color: '#fff', py: 4, textAlign: 'center' }}>
        <Typography variant="body1">
          © 2025 Precision Agriculture Using Machine Learning & IOT
        </Typography>
        <Typography variant="caption" fontStyle="italic">
          GO GREEN...
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;