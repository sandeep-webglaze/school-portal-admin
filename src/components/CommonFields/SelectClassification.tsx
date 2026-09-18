import { Autocomplete, Box, TextField } from '@mui/material';
import { ISchoolClassification, ISchoolType, getSchoolClassifications } from 'api/school';
import SelectableChips from 'components/SelectableChips';
import { FC, useEffect, useState } from 'react';

interface CommonUserSearchProps {
  selected: string;
  handleChange: (newVal: ISchoolClassification) => void;
  error?: boolean;
  helperText?: string;
}
export const SelectClassification: FC<CommonUserSearchProps> = ({ selected, handleChange, error, helperText }) => {
  const [classifications, setclassifications] = useState<ISchoolType[] | []>([]);

  useEffect(() => {
    getSchoolClassifications({ limit: 100 })
      .then((res) => {
        if (res.data) setclassifications(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);
  return (
    <Autocomplete
      options={classifications}
      value={classifications.find((classification) => classification?._id === selected) ?? (null as any)}
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
          label={'Select School Classification'}
        />
      )}
    />
  );
};

interface MultipleClassificationsProps {
  selected: string[];
  handleChange: (newVal: string[]) => void;
  error?: boolean;
  helperText?: string;
}

export const SelectMultipleClassifications: FC<MultipleClassificationsProps> = ({ selected, handleChange, error, helperText }) => {
  const [classifications, setclassifications] = useState<ISchoolType[] | []>([]);

  useEffect(() => {
    getSchoolClassifications()
      .then((res) => {
        if (res.data) setclassifications(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);

  return (
    <SelectableChips
      title={'Classifications'}
      chips={classifications}
      handleClick={function (selected: string | string[]): void {
        console.log('changes classifications', selected);
        handleChange(selected as string[]);
      }}
      listKey={'name'}
      compareKey={'_id'}
      isMultiSelect
      selected={selected}
    />
  );
};
