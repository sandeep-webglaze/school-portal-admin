import { Box, Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { ISchoolBoard, getSchoolBoards } from 'api/school';
import { FC, useEffect, useState } from 'react';

interface CommonUserSearchProps {
  selected: string[];
  handleChange: (newVal: string[]) => void;
  error?: boolean;
  helperText?: string;
}
export const SelectSchoolBoards: FC<CommonUserSearchProps> = ({ selected, handleChange, error, helperText }) => {
  const [schoolBoards, setschoolBoards] = useState<ISchoolBoard[] | []>([]);

  useEffect(() => {
    getSchoolBoards({ limit: 100 })
      .then((res) => {
        if (res.data) setschoolBoards(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);

  console.log('Sellected Boards==>', selected);
  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel id="demo-multiple-checkbox-label">Select School Boards</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        fullWidth
        value={selected}
        onChange={(e) => {
          handleChange(e.target.value as string[]);
        }}
        input={<OutlinedInput label="School Boards" />}
        renderValue={(selected: string[]) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected?.map((selectVal: string) => (
              <Chip key={selectVal} label={(schoolBoards as any[])?.find((e) => e._id === selectVal)?.name ?? ''} />
            ))}
          </Box>
        )}
      >
        {schoolBoards.map((board) => (
          <MenuItem key={board._id} value={board._id}>
            <Checkbox checked={selected.includes(board._id)} />
            <ListItemText primary={board.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
