import { Autocomplete, Avatar, Box, Stack, TextField, Typography } from '@mui/material';
import { IUser, getUsersList } from 'api/user';
import useDebounce from 'hooks/useDebounce';
import { FC, useState } from 'react';

interface CommonUserSearchProps {
  selected: string;
  handleChange: (newVal: string) => void;
  error?: boolean;
  helperText?: string;
}
export const CommonUserSearch: FC<CommonUserSearchProps> = ({ selected, handleChange, error, helperText }) => {
  const [users, setUsers] = useState<IUser[] | []>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const checkType = (value: string) => {
    // Regular expressions for checking email, phone number, and name
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{1,4}-?[0-9]{6,}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (emailRegex.test(value)) {
      return { email: value };
    } else if (phoneRegex.test(value) && value.length === 10) {
      return { phoneNumber: value };
    } else if (nameRegex.test(value)) {
      return { name: value };
    }
  };

  console.log('key===>', search);
  console.log('users===>', users);

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      const query = checkType(search);
      usersList(query);
    },
    [search],
    1000
  );

  const handleSearchChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSearch(newValue);
  };

  return (
    <Autocomplete
      options={users}
      loading={loading}
      id="combo-box-demo"
      value={users.find((user) => user._id === selected) ?? (null as any)}
      inputValue={search}
      clearOnBlur={false}
      onChange={(e: any, newVal: any) => handleChange(newVal?._id)}
      onInputChange={handleSearchChange} // Update search value on input change
      getOptionLabel={(option: any) => `${option.name}(${option.phoneNumber})`}
      renderOption={(props, option: any) => (
        <Box component="li" {...props} key={option._id}>
          <Stack direction="row" spacing={2}>
            <Avatar src={option.imageUrl} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {option.name}
              </Typography>
              <Typography variant="subtitle2" color="grey">
                {option.phoneNumber}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          sx={{ '.css-1rv8w63-MuiFormLabel-root-MuiInputLabel-root': { lineHeight: '1.4375em' } }}
          label={'Select User'}
        />
      )}
    />
  );

  async function usersList(query: any) {
    setLoading(true);
    getUsersList({ ...query, limit: 50 })
      .then((res) => {
        if (res.data) setUsers(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err))
      .finally(() => setLoading(false));
  }
};
