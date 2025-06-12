import { useEffect } from "react";
import { useNotify, usePermissions, useRedirect } from "react-admin"

const permissionGuard = (
    WrapComponent: React.ComponentType,
    resource: string,
    action: 'edit' | 'show' | 'create' | 'delete',

) => {
    return (props: any) => {
        const { permissions, isLoading } = usePermissions();
        const notify = useNotify();
        const redirect = useRedirect();

        useEffect(() => {
            if (!isLoading && !permissions?.[resource]?.[action]) {
                notify('Bạn không có quyền truy cập', { type: 'warning' });
                redirect(`/${resource}`);
            }
        }, [isLoading, permissions, notify, redirect]);

        if (isLoading || !permissions?.[resource]?.[action]) {
            return null;
        }
        return <WrapComponent {...props}/>;
    };
};

export default permissionGuard;