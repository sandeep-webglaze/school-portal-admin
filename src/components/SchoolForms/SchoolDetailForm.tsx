import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material';
import { ICity } from 'api/city';
import { CreateSchool, ISchoolType, getSchoolTypes } from 'api/school';
import { CommonCitySelect } from 'components/CommonFields/SelectCity';
import { SelectClassification } from 'components/CommonFields/SelectClassification';
import { SelectSchoolBoards } from 'components/CommonFields/SelectSchoolBoards';
import SlugInputField from 'components/CommonFields/SlugInputField';
import SelectableChips from 'components/SelectableChips';
import Editor from 'components/TextEditor/Editor';
import { SCHOOL_CLASSES } from 'constants/schoolClasses';
import { FormikProps } from 'formik';
import { slugify } from 'helpers';
import { FC, Fragment, useEffect, useState } from 'react';
import InputField from './InputField';

interface PropertyDetailFormProps {
  formik: FormikProps<CreateSchool>;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PropertydetailForm: FC<PropertyDetailFormProps> = ({ formik }) => {
  const { values, setFieldValue, errors } = formik;
  const [schoolTypes, setSchoolTypes] = useState<ISchoolType[] | []>([]);

  useEffect(() => {
    getSchoolTypes({ limit: 100 })
      .then((res) => {
        if (res.data) setSchoolTypes(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);

  useEffect(() => {
    if (!(values as any)?.prevSlug) setFieldValue('slug', slugify(values.name), false);
  }, [values.name]);

  return (
    <Grid container spacing={2} my={2}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h4">
          Hi Ansh, Fill detail of your School
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CommonCitySelect selected={values.city} handleChange={(newVal: ICity) => setFieldValue('city', newVal._id, false)} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SelectableChips
          title={'Featured School'}
          compareKey="title"
          chips={[{ title: 'Yes' }, { title: 'No' }]}
          listKey="title"
          selected={values.isFeatured ? 'Yes' : 'No'}
          handleClick={(title: string | string[]) => formik.setFieldValue('isFeatured', title == 'Yes')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <SelectableChips
          title={'Status'}
          compareKey="title"
          chips={[{ title: 'Draft' }, { title: 'Publish' }]}
          listKey="title"
          selected={values.published ? 'Publish' : 'Draft'}
          handleClick={(title: string | string[]) => formik.setFieldValue('published', title == 'Publish')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InputField label={'School Name'} name={'name'} fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        <SlugInputField initialSlug={(values as any)?._id ? (values as any)?.prevSlug : ''} />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h4" mt={2}>
          School Details
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* <SelectSchoolType selected={formik.values.type} handleChange={(type) => formik.setFieldValue('type', type._id, false)} /> */}
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="demo-multiple-checkbox-label">Select School Type</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              fullWidth
              value={formik.values.type}
              onChange={(e) => {
                formik.setFieldValue('type', e.target.value as string[], false);
              }}
              input={<OutlinedInput label="School Type" />}
              renderValue={(selected: string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected?.map((selectVal: string) => (
                    <Chip key={selectVal} label={(schoolTypes as any[])?.find((e) => e._id === selectVal)?.name ?? ''} />
                  ))}
                </Box>
              )}
            >
              {schoolTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  <Checkbox checked={formik.values.type.includes(type._id)} />
                  <ListItemText primary={type.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <SelectClassification
            selected={formik.values.classification}
            handleChange={(type) => formik.setFieldValue('classification', type._id, false)}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <SelectSchoolBoards selected={values.schoolBoards} handleChange={(borads) => formik.setFieldValue('schoolBoards', borads, false)} />
      </Grid>
      <Grid item xs={12} md={6}>
        <InputField label={'Enter Medium'} type="text" name={'medium'} multiline rows={1} fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        {/* <InputField label={'Enter Admission Start Time'} type="text" name={'admissionStart'} multiline rows={1} fullWidth /> */}
        <FormControl fullWidth error={Boolean(errors.admissionStart)}>
          <InputLabel id="demo-multiple-checkbox-label">Select Admission Start Time</InputLabel>
          <Select
            value={values.admissionStart}
            onChange={(e: SelectChangeEvent<unknown>) => setFieldValue('admissionStart', e.target.value, false)}
            label="Select Admission Start Time"
          >
            {months.map((item, idx: number) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          {errors.admissionStart && <FormHelperText>{errors.admissionStart}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        {/* <InputField label="Enter Admission End Time" name={'admissionEnd'} multiline rows={1} fullWidth /> */}
        <FormControl fullWidth error={Boolean(errors.admissionEnd)}>
          <InputLabel id="demo-multiple-checkbox-label">Select Admission End Time</InputLabel>
          <Select
            value={values.admissionEnd}
            onChange={(e: SelectChangeEvent<unknown>) => setFieldValue('admissionEnd', e.target.value, false)}
            label="Select Admission End Time"
          >
            {months.map((item, idx: number) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          {errors.admissionEnd && <FormHelperText>{errors.admissionEnd}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <InputField label={'Enter Chairman'} type="text" name={'chairman'} multiline rows={1} fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        <InputField label={'Enter Establishment Yr'} type="number" name={'establishmentYear'} multiline rows={1} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h4" mt={2}>
          School Fees
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <InputField label={'Enter Min Fees'} name={'minFees'} multiline type="number" rows={1} fullWidth />
          <InputField label={'Enter Max Fees'} name={'maxFees'} multiline type="number" rows={1} fullWidth />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h4" mt={2}>
          School Classes
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth error={Boolean(errors.classFrom)}>
            <InputLabel id="select-class-from-label">Select Class From</InputLabel>
            <Select
              labelId="select-class-from-label"
              value={values.classFrom}
              onChange={(e: SelectChangeEvent<unknown>) => setFieldValue('classFrom', e.target.value, false)}
              label="Select Class From"
            >
              {SCHOOL_CLASSES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            {errors.classFrom && <FormHelperText>{errors.classFrom}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={Boolean(errors.classTo)}>
            <InputLabel id="select-class-to-label">Select Class To</InputLabel>
            <Select
              labelId="select-class-to-label"
              value={values.classTo}
              onChange={(e: SelectChangeEvent<unknown>) => setFieldValue('classTo', e.target.value, false)}
              label="Select Class To"
            >
              {SCHOOL_CLASSES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            {errors.classTo && <FormHelperText>{errors.classTo}</FormHelperText>}
          </FormControl>
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <InputField label={'Enter Contact Number'} type="text" name={'contactNumber'} multiline rows={1} fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        <InputField label={'Enter Email'} type="text" name={'mail'} multiline rows={1} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <InputField label="School Website" name={'website'} multiline minRows={3} maxRows={4} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <Fragment>
          <Typography gutterBottom variant="h6" mt={2}>
            School About
          </Typography>

          <Editor value={formik.values.about} setValue={(newValue: string) => formik.setFieldValue('about', newValue, false)} />
        </Fragment>
      </Grid>
    </Grid>
  );
};

export default PropertydetailForm;
