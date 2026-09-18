import { Chip, Stack, TextField } from '@mui/material';
import { FC, Fragment } from 'react';

const filterData = [
  {
    gender: 'male',
    backColor: '#14cc14'
  },
  {
    gender: 'female',
    backColor: '#ffa100e8'
  }
];

interface ComonUserFieldsProps {
  formik: any;
}

const CommonUserFields: FC<ComonUserFieldsProps> = ({ formik }) => {
  return (
    <Fragment>
      <TextField
        variant="outlined"
        fullWidth
        required
        error={Boolean(formik.errors.name)}
        helperText={formik.errors.name}
        label="Name"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        name="name"
        sx={{ my: 1 }}
        value={formik.values.name}
      />

      <TextField
        variant="outlined"
        fullWidth
        required
        error={Boolean(formik.errors.phoneNumber)}
        helperText={formik.errors.phoneNumber}
        label="Phone Number"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        name="phoneNumber"
        sx={{ my: 1 }}
        value={formik.values.phoneNumber}
      />
      <TextField
        variant="outlined"
        fullWidth
        required
        error={Boolean(formik.errors.mail)}
        helperText={formik.errors.mail}
        label="E-Mail"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        name="mail"
        sx={{ margin: '5px 0px' }}
        value={formik.values.mail}
      />
      {/* <TextField
        variant="outlined"
        fullWidth
        required
        error={Boolean(formik.errors.address)}
        helperText={formik.errors.address}
        label="Address"
        multiline
        rows={3}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        name="address"
        sx={{ my: 1 }}
        value={formik.values.address}
      /> */}
    </Fragment>
  );
};

export default CommonUserFields;
