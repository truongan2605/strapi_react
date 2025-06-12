import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    Toolbar,
    SaveButton,
    useRedirect,
    DeleteWithConfirmButton,
    required,
    email,
    number,
    useNotify,
    useRecordContext,
    usePermissions,
} from 'react-admin';

const validateRequired = required('Trường này là bắt buộc');
const validateEmail = [required('Email là bắt buộc'), email('Email không hợp lệ')];
const validateNumber = [number('Phải là số'), required('Trường này là bắt buộc')];
const validateURL = (value: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return value && !urlPattern.test(value) ? 'URL không hợp lệ' : undefined;
};

const CustomToolbar = (props: any) => {

    const redirect = useRedirect();
    const record = useRecordContext();
    const notify = useNotify();
    const { permissions } = usePermissions();
    const canDelete = permissions?.['my-users']?.delete;
    return (
        <Toolbar {...props}>
            <SaveButton />
            {record && canDelete && (
                <DeleteWithConfirmButton
                    resource="my-users"
                    record={record}
                    mutationOptions={{
                        onSuccess: () => {
                            notify('Xoá thành công', { type: 'success' });
                            redirect('/my-users');
                        },
                        onError: () => {
                            notify('Lỗi khi xoá', { type: 'error' });
                        },
                    }}
                    confirmTitle="Xác nhận xoá"
                    confirmContent="Bạn chắc chắn muốn xoá chứ"
                    label="Xoá người dùng"

                />
            )}
        </Toolbar>
    );
};

const UserEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm toolbar={<CustomToolbar />}>
            <TextInput label="Full Name" source="name" validate={validateRequired} />
            <TextInput label="Company" source="company" validate={validateRequired} />
            <TextInput label="Email" source="email" validate={validateEmail} />
            <TextInput label="City" source="city" validate={validateRequired} />
            <TextInput label="Country" source="country" validate={validateRequired} />
            <NumberInput label="Zip Code" source="zipCode" validate={validateNumber} />
            <TextInput label="Avatar URL" source="avatar" validate={validateURL} />
        </SimpleForm>
    </Edit>
);

export default UserEdit;