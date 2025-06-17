// src/videos/VideoListPage.tsx
import {
    DeleteWithConfirmButton,
    useNotify,
    useRedirect,
    useGetList,
    Button,
    usePermissions,
} from 'react-admin';
import {
    Card,
    CardMedia,
    CardContent,
    Grid,
    Typography,
    Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function VideoListPage() {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetList('videos', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'DESC' },
        filter: {},
    });
    const { permissions } = usePermissions();
    const canEdit = permissions?.['my-users']?.edit;
    const canDelete = permissions?.['my-users']?.delete;
    const canCreate = permissions?.['my-users']?.create;


    const notify = useNotify();
    const redirect = useRedirect();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" gutterBottom>
                    Video List
                </Typography>
                {canCreate && <Button
                    variant="contained"
                    onClick={() => navigate('/videos/create')}
                >
                    Add Video
                </Button>}
            </Box>
            <Grid container spacing={3}>
                {data?.map((video: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
                        <Card>
                            <Link
                                to={`/videos/${video.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={video.thumbnail}
                                    alt={video.title}
                                />
                                <CardContent>
                                    <Typography variant="h6">{video.title}</Typography>
                                </CardContent>
                            </Link>
                            <Box display="flex" justifyContent="flex-end" p={1}>
                                {canEdit && <Button
                                    component={Link}
                                    to={`/videos/${video.id}/edit`}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                // sx={{ ml: 5 }}
                                >
                                    Edit Video
                                </Button>}
                                {canDelete && <DeleteWithConfirmButton
                                    resource="videos"
                                    record={video}
                                    confirmTitle="Xác nhận xoá"
                                    confirmContent="Bạn có chắc muốn xoá video này không?"
                                    mutationOptions={{
                                        onSuccess: () => {
                                            notify('Đã xoá video', { type: 'success' });
                                            redirect('/videos');
                                        },
                                        onError: () => {
                                            notify('Lỗi khi xoá video', { type: 'error' });
                                        },
                                    }}
                                />}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
