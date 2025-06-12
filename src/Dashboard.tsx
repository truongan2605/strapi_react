import {
  Card,
  Typography,
  Box,
  Grid,
  useTheme,
  LinearProgress,
  Stack,
  CardContent,
  // Tooltip,
} from '@mui/material';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const Categories = [
  { label: 'Food and Drinks', value: 872400, color: '#4caf50' },
  { label: 'Shopping', value: 1378200, color: '#2196f3' },
  { label: 'Housing', value: 928500, color: '#ff9800' },
  { label: 'Transportation', value: 420700, color: '#9c27b0' },
  { label: 'Vehicle', value: 520000, color: '#f44336' },
];

const productData = [
  { name: 'Product A', price: 100, quantity: 2400 },
  { name: 'Product B', price: 150, quantity: 4567 },
  { name: 'Product C', price: 200, quantity: 1398 },
  { name: 'Product D', price: 250, quantity: 9800 },
  { name: 'Product E', price: 300, quantity: 3908 },
];

const salesData = productData.map((product) => ({
  ...product,
  revenue: product.price * product.quantity,
}));

const totalRevenue = salesData.reduce((acc, product) => acc + product.revenue, 0);
const bestSellingProduct = salesData.reduce((max, product) =>
  product.revenue > max.revenue ? product : max
);
const leastSellingProduct = salesData.reduce((min, product) =>
  product.revenue < min.revenue ? product : min
);

const chartData = salesData.map((product) => ({
  name: product.name,
  sales: product.revenue,
}));

const Dashboard = () => {
  const theme = useTheme();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  return (
    <Box p={3}>
      

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 10 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Doanh số sản phẩm
              </Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        {/* Cột trái: Thẻ doanh thu */}
        <Grid size={{ xs: 12, md: 5 }} >
          <Stack spacing={2}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Tổng doanh thu
              </Typography>
              <Typography variant="h5" color={theme.palette.success.main}>
                {formatCurrency(totalRevenue)}
              </Typography>
            </Card>

            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Bán chạy nhất
              </Typography>
              <Typography variant="h6" color={theme.palette.warning.main}>
                {bestSellingProduct.name}
              </Typography>
              <Typography>{formatCurrency(bestSellingProduct.revenue)}</Typography>
            </Card>

            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Bán ít nhất
              </Typography>
              <Typography variant="h6" color={theme.palette.error.main}>
                {leastSellingProduct.name}
              </Typography>
              <Typography>{formatCurrency(leastSellingProduct.revenue)}</Typography>
            </Card>
          </Stack>
        </Grid>

        {/* Cột giữa: Where your money go */}
        <Grid size={{ xs: 12, md: 5 }} >
          <Typography variant="h6" gutterBottom>
            Where your money go?
          </Typography>

          {Categories.map((cat) => (
            <Box key={cat.label} mb={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">{cat.label}</Typography>
                <Typography variant="body2">{cat.value.toLocaleString()}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(cat.value / 1500000) * 100}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: '#eee',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: cat.color,
                  },
                }}
              />
            </Box>
          ))}
        </Grid>

        {/* Cột phải: Biểu đồ doanh thu */}

      </Grid>
    </Box>
  );
};

export default Dashboard;
