import React from 'react';
import { Box, Container, Grid, Typography, Button,Avatar  } from '@mui/material';

function BlogSection() {
  const blogPosts = [
    {
      image: 'imgs/sousse.png',
      day: '11',
      month: 'September',
      year: '2020',
      title: 'Most Popular Place In This World',
      desc: 'Most Popular Place In This World..',

      link: 'blog-single.html',
            authorName: 'John Doe',
      authorImage: 'imgs/author1.jpg',
    },
    {
      image: 'imgs/sousse.png',
      day: '11',
      month: 'September',
      year: '2020',
      title: 'Most Popular Place In This World',
            desc: 'Most Popular Place In This World..',

      link: 'blog-single.html',
            authorName: 'John Doe',
      authorImage: 'imgs/author1.jpg',
    },
    {
      image: 'imgs/sousse.png',
      day: '11',
      month: 'September',
      year: '2020',
      title: 'Most Popular Place In This World',
            desc: 'Most Popular Place In This World..',

      link: 'blog-single.html',
            authorName: 'John Doe',
      authorImage: 'imgs/author1.jpg',
    },
  ];

  return (
    <Box sx={{ py: 2 }}> {/* ftco-section */}
      <Container>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Notre blog
          </Typography>
        </Box>
        <Grid container spacing={2} justifyContent="center">
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={3} key={index} sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  width: '100%',
                }}
              >
                <Box
                  component="a"
                  href={post.link}
                  sx={{
                    display: 'block',
                    height: 250,
                    backgroundImage: `url(${post.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textDecoration: 'none',
                  }}
                />
<Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    {/* Left: Date */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
        {post.day}
      </Typography>
      <Box>
        <Typography variant="body2" component="span" sx={{ display: 'block', lineHeight: 1 }}>
          {post.year}
        </Typography>
        <Typography variant="body2" component="span" sx={{ display: 'block', lineHeight: 1 }}>
          {post.month}
        </Typography>
      </Box>
    </Box>

    {/* Right: Author */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar src={post.authorImage} alt={post.authorName} sx={{ width: 36, height: 36, mr: 1 }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {post.authorName}
      </Typography>
    </Box>
  </Box>

  <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', flexGrow: 1 }}>
    <a href={post.link} style={{ textDecoration: 'none', color: 'inherit' }}>
      {post.title}
    </a>
  </Typography>
  <Typography sx={{ mb: 2,  flexGrow: 1 }}>
    <a href={post.link} style={{ textDecoration: 'none', color: 'inherit' }}>
      {post.desc}
    </a>
  </Typography>
  <Button variant="text" color="primary" href={post.link} sx={{ alignSelf: 'flex-start' }}>
    Read more
  </Button>
</Box>
</Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default BlogSection;