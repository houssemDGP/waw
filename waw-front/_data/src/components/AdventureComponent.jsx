import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    useTheme,
    useMediaQuery,
    Stack // Added Stack component
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const getGradientBackground = (startColor, endColor) =>
    `linear-gradient(to top, ${startColor}, ${endColor})`;

const AdventureComponent = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const cardData = [
        {
            icon: <DirectionsBoatIcon />,
            title: 'Activities',
            description: 'A small river named Duden flows by their place and supplies it with the necessary',
            gradient: getGradientBackground('#4a90e2', '#82b1ff'),
            image: '/images/ocean-wave.jpg', // Placeholder: Update with your actual image paths
        },
        {
            icon: <MapIcon />,
            title: 'Travel Arrangements',
            description: 'A small river named Duden flows by their place and supplies it with the necessary',
            gradient: getGradientBackground('#ff7e5f', '#feb47b'),
            image: '/images/mountain-view.jpg', // Placeholder
        },
        {
            icon: <PersonIcon />,
            title: 'Private Guide',
            description: 'A small river named Duden flows by their place and supplies it with the necessary',
            gradient: getGradientBackground('#28a745', '#66bb6a'),
            image: '/images/person-silhouette.jpg', // Placeholder
        },
        {
            icon: <LocationOnIcon />,
            title: 'Location Manager',
            description: 'A small river named Duden flows by their place and supplies it with the necessary',
            gradient: getGradientBackground('#dc3545', '#ef5350'),
            image: '/images/city-map.jpg', // Placeholder
        },
    ];

    return (
        <Box
            sx={{
                padding: isSmallScreen ? 2 : 8,
                backgroundColor: '#f5f5f5',
                fontFamily: 'Arial, sans-serif',
                minHeight: '100vh', // Ensure component takes at least full viewport height
                display: 'flex',
                alignItems: 'center', // Vertically center the entire content within the Box
            }}
        >
            <Grid
                container
                spacing={isSmallScreen ? 2 : 4}
                sx={{
                    width: '100%', // Ensure grid takes full width of parent box
                    maxWidth: '1200px', // Optional: max width for the content area
                    margin: 'auto', // Center the content area
                }}
            >


                {/* Right section with text and button */}
                <Grid item xs={12} md={6}>
                    <Stack
                        spacing={3} // Adds spacing between direct children of Stack
                        sx={{
                            justifyContent: 'center', // Vertically centers content within Stack
                            height: '100%', // Ensure Stack takes full height of its Grid item
                            padding: isSmallScreen ? 0 : 4,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#ff7e5f',
                                fontWeight: 'bold',
                            }}
                        >
                            Welcome to WAW
                        </Typography>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                lineHeight: 1.2,
                                color: '#333',
                            }}
                        >
                            It's time to start your adventure
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            A small river named Duden flows by their place and supplies it with the necessary regelia. it is a paradisematic country, in which roasted parts of sentences fly into your mouth.
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelia.
                        </Typography>
                    </Stack>
                </Grid>
                                {/* Left section with cards */}
                <Grid item xs={12} md={6}>
                    <Grid container spacing={isSmallScreen ? 2 : 4}>
                        {cardData.map((card, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        color: 'white',
                                        minHeight: '200px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                    }}
                                >
                                    {/* Background image or gradient */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: card.gradient,
                                            backgroundImage: card.image ? `url(${process.env.PUBLIC_URL}${card.image})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            filter: card.image ? 'brightness(0.7)' : 'none',
                                            zIndex: 1,
                                        }}
                                    />
                                    {/* Content on top of the background */}
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            position: 'relative',
                                            zIndex: 2,
                                            padding: 3,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'white',
                                                color: '#ff7e5f',
                                                width: 56,
                                                height: 56,
                                                marginBottom: 2,
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 32,
                                                },
                                            }}
                                        >
                                            {card.icon}
                                        </Avatar>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 ,color: '#555'  }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ lineHeight: 1.5 , color: '#555'  }}>
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdventureComponent;