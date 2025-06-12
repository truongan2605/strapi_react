import { TopToolbar, CreateButton, usePermissions } from 'react-admin';

type CustomListActionsProps = {
    resource: string;
};

const CustomListActionsCreate = ({ resource }: CustomListActionsProps) => {
    const { permissions } = usePermissions();
    const canCreate = permissions?.[resource]?.create;

    return (
        <TopToolbar sx={{ minHeight: '61px', justifyContent: 'flex-end', px: 2 }}>
            {canCreate && (
                <CreateButton
                    label="Thêm"
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        textTransform: 'none',
                        boxShadow: 1,
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                    }}
                />
            )}
        </TopToolbar>
    );
};

export default CustomListActionsCreate;
