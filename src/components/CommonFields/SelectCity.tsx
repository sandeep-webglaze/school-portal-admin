import { Autocomplete, Box, Checkbox, TextField } from '@mui/material';
import { ICity, getCitiesList } from 'api/city';
import { FC, useEffect, useState } from 'react';

interface CommonUserSearchProps {
  selected: string;
  handleChange: (newVal: ICity) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}
export const CommonCitySelect: FC<CommonUserSearchProps> = ({ selected, handleChange, error, helperText, required }) => {
  const [cities, setCities] = useState<ICity[] | []>([]);

  useEffect(() => {
    getCitiesList({ limit: 100 })
      .then((res) => {
        if (res.data) setCities(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);
  return (
    <Autocomplete
      options={cities}
      value={cities.find((city) => city?._id === selected) ?? (null as any)}
      onChange={(e: any, newVal: any) => handleChange(newVal)}
      autoHighlight
      getOptionLabel={(option: any) => option.city}
      renderOption={(props, option: any) => (
        <Box component="li" {...props}>
          {option.city}
        </Box>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          margin="dense"
          required={required}
          helperText={helperText}
          sx={{ '.css-1rv8w63-MuiFormLabel-root-MuiInputLabel-root': { lineHeight: '1.4375em' } }}
          label={'Select City'}
        />
      )}
    />
  );
};

interface SelectMultipleCityProps {
  selected: string[];
  handleChange: (newVal: string[]) => void;
  error?: boolean;
  helperText?: string;
}

export const SelectMultipleCities: FC<SelectMultipleCityProps> = ({ selected, handleChange, error, helperText }) => {
  const [cities, setCities] = useState<ICity[] | []>([]);

  useEffect(() => {
    getCitiesList({ limir: 100 })
      .then((res) => {
        if (res.data) setCities(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);

  return (
    <Autocomplete
      multiple
      fullWidth
      id="checkboxes-tags-demo"
      options={cities}
      value={cities?.filter((city) => selected.includes(city._id))}
      onChange={(e: any, newVal: any) => handleChange(newVal.map((item: { _id: any }) => item._id))}
      disableCloseOnSelect
      getOptionLabel={(option) => option.city}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {option.city}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="City" placeholder="Select City" />}
    />
  );
};
