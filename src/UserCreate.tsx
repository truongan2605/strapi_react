import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  email,
  number,
} from 'react-admin';
const validateZipCode = [
  number('Phải là số'),
  required('Bắt buộc'),
  (value: number) =>
    value >= 99999 ? 'Mã zip không được lớn hơn 99999' : undefined,
  (value: number) =>
    value <= 10000 ? 'Mã zip không được nhỏ hơn 10000' : undefined,
 
];
const validateRequired = required('Trường này là bắt buộc');
const validateEmail = [required('Email là bắt buộc'), email('Email không hợp lệ')];
const validateImageURL = (value: string) => {
  if (!value) return undefined; // không bắt buộc
  const pattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif)(\?.*)?$/i;
  return pattern.test(value) ? undefined : 'URL ảnh không hợp lệ (.jpg, .png, .gif)';
};

const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      
      <TextInput label="Full Name" source="name" validate={validateRequired} />
      <TextInput label="Company" source="company" validate={validateRequired} />
      <TextInput label="Email" source="email" validate={validateEmail} />
      <TextInput label="City" source="city" validate={validateRequired} />
      <TextInput label="Country" source="country" validate={validateRequired} />
      <NumberInput label="Zip Code" source="zipCode" validate={validateZipCode}/> 
      <TextInput label="Avatar URL" source="avatar" validate={validateImageURL}/> 
    </SimpleForm>
  </Create>
);

export default UserCreate;
