import { useParams } from 'react-router-dom';
import { useGetOne } from 'react-admin';
import { Typography, Box } from '@mui/material';

export default function VideoDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOne('videos', { id });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Không tìm thấy video</p>;

  const trimStart = data.trimStart ?? 0;
  const trimEnd = data.trimEnd ?? null;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        {data.title}
      </Typography>

      <video
        controls
        width="80%"
        src={data.src}
        style={{ marginBottom: 20 }}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          video.currentTime = trimStart;
        }}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (trimEnd && video.currentTime > trimEnd) {
            video.pause();
            video.currentTime = trimStart;
          }
        }}
        onSeeking={(e) => {
          const video = e.currentTarget;
          if (video.currentTime < trimStart) {
            video.currentTime = trimStart;
          }

        }}
      />
    </Box>
  );
}
