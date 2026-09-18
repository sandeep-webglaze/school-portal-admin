import { TextField, TextFieldProps } from '@mui/material';
import { useField, useFormikContext } from 'formik';

export default function InputField(props: TextFieldProps) {
  const { type, ...rest } = props;
  const [field, meta, helpers] = useField(props.name as string);
  const form = useFormikContext();

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    console.log('inputVlaue==>', inputValue);

    // Convert the value to a number if props.type is 'number'
    const newValue = type === 'number' ? (inputValue !== '' ? parseFloat(inputValue) : '') : inputValue;

    // Set the new value in the field, making sure it's a number when the type is 'number'
    helpers.setValue(type === 'number' ? newValue : inputValue);

    // Parse the value and set it explicitly as a number using Formik's setFieldValue
    const parsedValue = type === 'number' ? (newValue !== '' && newValue !== null ? parseFloat(newValue) : '') : newValue;

    console.log('vals==>', parsedValue, newValue);
    form.setFieldValue(field.name, parsedValue, false);

    // Call Formik's default handleChange to ensure other functionality works as expected
    // field.onChange(event);
  };

  return (
    <TextField
      type={type ?? 'text'}
      error={meta.touched && meta.error ? true : false}
      helperText={meta.error}
      {...field}
      {...rest}
      value={field.value || ''}
      onChange={handleChange}
    />
  );
}
