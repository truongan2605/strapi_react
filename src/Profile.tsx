import {
  Card, CardContent, Typography, Box, Avatar,
  CircularProgress, Alert
} from '@mui/material';
import { useGetIdentity } from 'react-admin';

const Profile = () => {
  const { data: identity, isLoading, error } = useGetIdentity();

  if (isLoading) return <CircularProgress />;
  if (error || !identity) return <Alert severity="error">Không thể lấy thông tin người dùng</Alert>;
  return (
    <Card sx={{ maxWidth: 600, m: '2rem auto' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            alt={identity.fullName}
            src={identity.avatar}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{identity.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">{identity.email || ''}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;
