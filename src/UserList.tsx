import { List, Datagrid, TextField, ImageField, EditButton } from 'react-admin';
import { usePermissions } from 'react-admin';
import CustomListActionsCreate from './CustomListActionsCreate';

export const UserList = () => {
  const { permissions } = usePermissions();
  const canEdit = permissions?.['my-users']?.edit;
  const canShow = permissions?.['my-users']?.show;

  return (
    <List perPage={10} sort={{ field: 'numberId', order: 'DESC' }} actions={<CustomListActionsCreate resource="my-users" />} >
      <Datagrid rowClick={canShow ? "show" : undefined}>
        <TextField source="numberId" label="ID" />
        <TextField source="name" />
        <TextField source="company" />
        <TextField source="city" />
        <TextField source="country" />
        <TextField source="zipCode" />
        <ImageField source="avatar" title="name" />
        <TextField source="createdAt" />
        {canEdit && <EditButton />}
      </Datagrid>
    </List>
  );
};
