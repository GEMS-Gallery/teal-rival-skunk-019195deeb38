import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Card, CardContent, TextField, Modal, Box, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    setIsLoading(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      await fetchPosts();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          backgroundImage: 'url(https://loremflickr.com/g/1200/400/crypto?lock=42)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Typography variant="h2" component="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Crypto Blog
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Create Post
      </Button>

      {posts.map((post) => (
        <Card key={Number(post.id)} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
            </Typography>
            <Typography variant="body2" component="p">
              {post.body}
            </Typography>
          </CardContent>
        </Card>
      ))}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
            Create New Post
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              defaultValue=""
              rules={{ required: 'Body is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Body"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              defaultValue=""
              rules={{ required: 'Author is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Author"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default App;
