// src/videos/VideoEditPage.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Typography,
  Slider,
  Box,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOne, useNotify, useRedirect, useUpdate } from 'react-admin';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/plugins/regions';

export default function VideoEditPage() {
  const { id } = useParams();
  const documentId = id ?? '';

  const notify = useNotify();
  const redirect = useRedirect();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetOne('videos', { id: documentId });
  console.log(data);
  const [update] = useUpdate();

  const [region, setRegion] = useState({ start: 0, end: 0 });
  const [duration, setDuration] = useState(0);

  const waveRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      wsRef.current?.destroy();
    };
  }, []);

  const handleSliderChange = (_: any, v: number | number[]) => {
    const [start, end] = v as number[];

    if (start == null || end == null) {
      return
    }

    setRegion({ start, end });

    if (videoRef.current) {
      videoRef.current.currentTime = start;

      console.log(videoRef)
      videoRef.current.play();
    }

    const regions = (wsRef as any).current?.plugins?.regions;
    if (regions) {
      const allRegions: any = Object.values(regions.regions);
      if (allRegions.length > 0) {
        allRegions[0].update({ start, end });
      }
    }
  };

  const handleSave = () => {

    update(
      'videos',
      {
        id: documentId,
        data: { trimStart: region.start, trimEnd: region.end },
        previousData: data,
      },
      {
        onSuccess: () => {
          notify('Đã cập nhật video', { type: 'success' });
          redirect('/videos');
        },
        onError: (error) => {
          notify(`Lỗi: ${error.message}`, { type: 'error' });
        },
      }
    );
  };

  console.log('Trim start:', region.start, 'Trim end:', region.end);

  if (isLoading) return <Typography>Đang tải...</Typography>;
  if (error) return <Typography>Lỗi: {error.message}</Typography>;
  if (!data) return <Typography>Không tìm thấy video</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Chỉnh sửa: {data.title}
      </Typography>

      <video
        src={data.src}
        controls
        ref={videoRef}
        style={{ width: '100%', marginBottom: 16 }}
        onLoadedMetadata={() => {
          if (!videoRef.current || !waveRef.current) return;

          const regionsPlugin = RegionsPlugin.create();
          const ws = WaveSurfer.create({
            container: waveRef.current,
            waveColor: '#ddd',
            progressColor: '#888',
            height: 80,
            backend: 'MediaElement',
            media: videoRef.current,
            plugins: [regionsPlugin],
          });

          wsRef.current = ws;

          ws.on('ready', () => {
            const dur = ws.getDuration();
            setDuration(dur);
            const start = typeof data.trimStart === 'number' ? data.trimStart : 0;

            const end = typeof data.trimEnd === 'number' ? data.trimEnd : dur;


            setRegion({ start, end });

            regionsPlugin.addRegion({
              start,
              end,
              color: 'rgba(0, 123, 255, 0.1)',
              drag: false,
              resize: false,
            });
          });

          (ws as any).on('region-update-end', (r: any) => {
            setRegion({ start: r.start, end: r.end });
            if (videoRef.current) {
              videoRef.current.currentTime = r.start;
              videoRef.current.play();
            }
          });
        }}
      />


      <Typography>Trim:</Typography>
      
      <Slider
        value={[region.start, region.end]}
        min={0}
        max={duration}
        step={0.01}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
      />
      <Typography>
        Start: {region.start.toFixed(2)}s — End: {region.end.toFixed(2)}s
      </Typography>

      <Box ref={waveRef} sx={{ my: 2 }} />

      <Button variant="contained" onClick={handleSave}>
        Lưu chỉnh sửa
      </Button>

    </Container>
  );
}
