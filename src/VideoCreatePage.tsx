// src/videos/VideoCreatePage.tsx
import { useState, useRef, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Slider,
} from '@mui/material';
import { useCreate } from 'react-admin';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/plugins/regions';
import { useRedirect, useNotify } from 'react-admin';

export default function VideoCreatePage() {
    const [create] = useCreate();
    const notify = useNotify();
    const redirect = useRedirect();

    const [title, setTitle] = useState('');
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbUrl, setThumbUrl] = useState<string>();
    const [videoUrl, setVideoUrl] = useState<string>();
    const [duration, setDuration] = useState(0);
    const [region, setRegion] = useState({ start: 0, end: 0 });

    const waveRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WaveSurfer | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (thumbFile) setThumbUrl(URL.createObjectURL(thumbFile));
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setVideoUrl(url);
        }
    }, [thumbFile, videoFile]);

    useEffect(() => {
        if (!videoUrl || !waveRef.current || !videoRef.current) return;

        const regionsPlugin = RegionsPlugin.create();

        const ws = WaveSurfer.create({
            container: waveRef.current,
            waveColor: '#ddd',
            progressColor: '#888',
            // waveColor: 'rgb(60, 171, 69)',
            // progressColor: 'rgb(100, 0, 100)',
            height: 80,
            backend: 'MediaElement',
            // mediaControls: false,
            plugins: [regionsPlugin],
            media: videoRef.current, // dùng video element thay vì tạo mới
        });

        wsRef.current = ws;

        ws.on('ready', () => {
            const dur = ws.getDuration();
            setDuration(dur);
            setRegion({ start: 0, end: dur });

            regionsPlugin.addRegion({
                start: 0,
                end: dur,
                color: 'rgba(73, 120, 171, 0.1)',
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

        return () => {
            ws.destroy();
        };
    }, [videoUrl]);


    const handleSliderChange = (_: any, v: number | number[]) => {
        const [start, end] = v as number[];
        setRegion({ start, end });

        if (videoRef.current) {
            videoRef.current.currentTime = start;
            videoRef.current.play();
        }

        // Tìm plugin regions từ wsRef hiện tại và cập nhật
        const regions = (wsRef as any).current?.plugins?.regions;
        if (regions) {
            const allRegions: any = Object.values(regions.regions);
            if (allRegions.length > 0) {
                allRegions[0].update({ start, end });
            }
        }
    };


    const handleSubmit = () => {
        if (!title || !videoFile || !videoUrl ) {
            notify('Vui lòng điền đầy đủ', { type: 'warning' });
            return;
        }

        const newVideo = {
            title,
            src: videoUrl,
            thumbnail: thumbUrl,
            trimStart: region.start,
            trimEnd: region.end,
        };

        create('videos', { data: newVideo }, {
            onSuccess: () => {
                notify('Đã thêm video', { type: 'success' });
                redirect('/videos');
            },
            onError: (error: any) => {
                notify(`Lỗi: ${error.message}`, { type: 'error' });
            }
        });
    };


    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
                Add New Video
            </Typography>
            <Box component="form" noValidate autoComplete="on">
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                    Chọn thumbnail
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                    />
                </Button>
                {thumbUrl && (
                    <Box component="img" src={thumbUrl} alt="thumb" width={200} mb={2} />
                )}

                <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                    Chọn video
                    <input
                        hidden
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                </Button>

                {videoUrl && (
                    <>
                        <video
                            src={videoUrl}
                            controls
                            ref={videoRef}
                            style={{ width: '100%', marginBottom: 16 }}
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
                    </>
                )}

                <Button variant="contained" onClick={handleSubmit}>
                    Save
                </Button>
            </Box>
        </Container>
    );
}
