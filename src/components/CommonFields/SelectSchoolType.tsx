import { Autocomplete, Box, TextField } from '@mui/material';
import { ISchoolType, getSchoolTypes } from 'api/school';
import SelectableChips from 'components/SelectableChips';
import { FC, useEffect, useState } from 'react';

interface CommonUserSearchProps {
  selected: string;
  handleChange: (newVal: ISchoolType) => void;
  error?: boolean;
  helperText?: string;
}
export const SelectSchoolType: FC<CommonUserSearchProps> = ({ selected, handleChange, error, helperText }) => {
  const [schoolTypes, setSchoolTypes] = useState<ISchoolType[] | []>([]);

  useEffect(() => {
    getSchoolTypes({ limit: 100 })
      .then((res) => {
        if (res.data) setSchoolTypes(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);
  return (
    <Autocomplete
      options={schoolTypes}
      value={schoolTypes.find((type) => type?._id === selected) ?? (null as any)}
      onChange={(e: any, newVal: any) => handleChange(newVal)}
      autoHighlight
      getOptionLabel={(option: any) => option.name}
      renderOption={(props, option: any) => (
        <Box component="li" {...props}>
          {option.name}
        </Box>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          margin="dense"
          helperText={helperText}
          sx={{ '.css-1rv8w63-MuiFormLabel-root-MuiInputLabel-root': { lineHeight: '1.4375em' } }}
          label={'Select School Type'}
        />
      )}
    />
  );
};

interface MultipleTypesProps {
  selected: string[];
  handleChange: (newVal: string[]) => void;
  error?: boolean;
  helperText?: string;
}

export const SelectMultipleSchoolTypes: FC<MultipleTypesProps> = ({ selected, handleChange, error, helperText }) => {
  const [schoolTypes, setSchoolTypes] = useState<ISchoolType[] | []>([]);

  useEffect(() => {
    getSchoolTypes()
      .then((res) => {
        if (res.data) setSchoolTypes(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);

  return (
    <SelectableChips
      title={'School Types'}
      chips={schoolTypes}
      handleClick={function (selected: string | string[]): void {
        handleChange(selected as string[]);
      }}
      listKey={'name'}
      compareKey={'_id'}
      isMultiSelect
      selected={selected}
    />
  );
};
