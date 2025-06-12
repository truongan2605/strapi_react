import {
    Show,
    TabbedShowLayout,
    Tab,
    useShowContext,
    useGetMany,
    DateField,
    useNotify,
    useRedirect,
    DeleteWithConfirmButton,
    usePermissions
} from 'react-admin';
import {
    Grid,
    Box,
    Typography,
    Chip,
    Avatar,
    Button,
    Stack,
    Paper,
    CircularProgress,
    Alert,
    Card,
    CardContent,

} from '@mui/material';




const UserKindredInfo = () => {
    const { record } = useShowContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const { permissions } = usePermissions();
    const canShow = permissions?.['my-users']?.show;
    const canDelete = permissions?.['my-users']?.delete;
    const canEdit = permissions?.['my-users']?.edit;



    if (!canShow) {
        return <div>Không có quyền xem chi tiết.</div>;
    }

    if (!record) return <CircularProgress />;


    return (
        <Grid container spacing={4} padding={3}>
            {/* Cột trái */}
            <Grid size={{ xs: 12, md: 5 }} >
                <Box display="flex" flexDirection="column" gap={2}>
                    <img
                        src={record.avatar}
                        alt="Avatar"
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                            objectFit: 'cover',
                        }}
                    />

                </Box>
            </Grid>

            {/* Cột phải */}
            <Grid size={{ xs: 4, md: 7 }} >
                <Typography variant="h4" gutterBottom>
                    {record.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    {record.company}
                </Typography>

                <Stack direction="row" spacing={1} mb={2}>
                    <Chip label="Developer" />
                    <Chip label="Designer" />
                    <Chip label="Founder" />
                </Stack>

                <Typography variant="body1" component="p">
                    Sống tại {record.city}, {record.country}. Làm việc tại {record.company}.
                </Typography>

                <Stack direction="row" spacing={2} mb={3}>
                    <Button variant="outlined" startIcon={<Avatar src={record.avatar} />}>
                        Giới thiệu
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Avatar src="" />}
                    >
                        Nút bấm
                    </Button>
                </Stack>

                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Email
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                        <Avatar src={record.avatar} sx={{ mr: 2 }} />
                        <Box>
                            <Typography>{record.name}</Typography>
                            <Typography variant="caption">{record.email}</Typography>
                        </Box>
                    </Box>
                </Paper>

                <Box mt={2}>
                    <Typography variant="caption" color="textSecondary">
                        Ngày tạo: <DateField source="createdAt" record={record} />
                    </Typography>
                </Box>
            </Grid>

            <Grid size={{xs:12, md:6}}>
                <Stack direction="row" spacing={2} mt={2}>
                    {canDelete && (
                        <DeleteWithConfirmButton
                            resource="my-users"
                            record={record}
                            mutationOptions={{
                                onSuccess: () => {
                                    notify('Xoá thành công', { type: 'success' });
                                    redirect('/my-users');
                                },
                                onError: () => {
                                    notify('Lỗi khi xoá');
                                },
                            }}
                            confirmTitle="Xác nhận xoá"
                            confirmContent="Bạn chắc chắn muốn xoá chứ"
                            label="Xoá người dùng"
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                boxShadow: 1,
                                '& .RaButton-label': {
                                    textTransform: 'none',
                                },
                            }}
                        />
                    )}

                    {canEdit && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => redirect(`/my-users/${record.id}/edit`)}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                boxShadow: 2,
                                textTransform: 'none',
                                minWidth: '120px',
                                '&:hover': {
                                    backgroundColor: '#2e7d32',
                                },
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    )}
                </Stack>
            </Grid>



        </Grid>
    );
};

const ProductListForUser = () => {
    const { data, isLoading, error } = useGetMany('products', { ids: ['2', '4'] });

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Lỗi khi tải sản phẩm</Alert>;
    if (!data || data.length === 0) return <Alert severity="info">Không có sản phẩm nào</Alert>;

    return (
        <Grid container spacing={2}>
            {data.map((product) => (
                <Grid size={{ xs: 12, md: 6 }} key={product.id}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Sản phẩm #{product.id}: {product.name}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Loại:</strong> {product.product}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Chất liệu:</strong> {product.material}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Mô tả:</strong> {product.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

const UserShow = () => (
    <Show actions={false}>
        <TabbedShowLayout>
            <Tab label="Thông tin người dùng">
                <UserKindredInfo />
            </Tab>
            <Tab label="Sản phẩm cố định">
                <ProductListForUser />
            </Tab>
            <Tab label="Thông tin thêm">
                <Box sx={{ m: 2 }}>
                    <Typography variant="body1">Đây là tab sử dụng MUI</Typography>
                </Box>
            </Tab>
        </TabbedShowLayout>
    </Show>
);

export default UserShow;
