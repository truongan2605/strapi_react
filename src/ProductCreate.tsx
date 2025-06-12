// ProductCreate.tsx
import { Create, SimpleForm, TextInput, SelectInput, required } from 'react-admin';
import { Box, Typography, Grid } from '@mui/material';
const materialChoices = [
  { id: 'Steel', name: 'Steel' },
  { id: 'Bronze', name: 'Bronze' },
  { id: 'Plastic', name: 'Plastic' },
];

const validateRequired = required('Trường này là bắt buộc');

const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <Typography variant="h6" gutterBottom>
        Thêm sản phẩm mới
      </Typography>
      <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 2 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }} >
            <TextInput source="name" fullWidth label="Tên sản phẩm" validate={validateRequired}/>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput source="product" fullWidth label="Loại sản phẩm" validate={validateRequired}/>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectInput
              source="material"
              label="Chất liệu"
              choices={materialChoices}
              validate={required()}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextInput source="description" fullWidth multiline rows={6} label="Mô tả" />
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  </Create>
);

export default ProductCreate;
