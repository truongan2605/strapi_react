import { List, Datagrid, TextField, EditButton, usePermissions } from 'react-admin';
import CustomListActionsCreate from './CustomListActionsCreate';

export const ProductList = () => {
  const { permissions } = usePermissions();
  const canEdit = permissions?.['products']?.edit;

  return (
    <List perPage={10} sort={{ field: 'numberId', order: 'DESC' }} actions={<CustomListActionsCreate resource="products" />}>
      <Datagrid rowClick= { canEdit? "edit" : undefined}>
        <TextField source="numberId" label="ID" />
        <TextField source="name" />
        <TextField source="product" />
        <TextField source="material" />
        <TextField source="description" />
        <TextField source="createdAt" />
        {canEdit && <EditButton />}
      </Datagrid>
    </List>
  )
};
