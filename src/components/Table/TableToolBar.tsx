import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { FC, Fragment } from 'react';

interface ToolBarProps {
  btnClickHandler?: Function;
  searchHandler?: Function;
  sortBy?: string;
  handleSortBy?: (event: SelectChangeEvent<string>) => void;
  btnActions?: boolean;
  btnText?: string;
}

const TableToolBar: FC<ToolBarProps> = ({
  btnClickHandler = () => {},
  searchHandler = () => {},
  handleSortBy,
  btnActions = true,
  sortBy,
  btnText = 'Add User'
}) => {
  return (
    <Grid container alignItems="center" padding={3} spacing={2}>
      <Grid item md={4} xs={12}>
        <OutlinedInput
          id="start-adornment-email"
          size="medium"
          fullWidth
          onChange={({ target }) => searchHandler(target.value)}
          placeholder="Search For Results"
          startAdornment={<SearchOutlined />}
        />
      </Grid>
      {btnActions && (
        <Fragment>
          <Grid item md={4} xs={12}>
            {sortBy && (
              <FormControl fullWidth sx={{ float: 'right' }}>
                <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                <Select
                  value={sortBy ?? ''}
                  onChange={(e) => {
                    handleSortBy && handleSortBy(e);
                  }}
                  label="Select Sort By"
                >
                  <MenuItem value={'createdAt'}>Sorty By CreatedAt</MenuItem>
                  <MenuItem value={'lastOnlineAt'}>Sorty By Last Online</MenuItem>
                </Select>
              </FormControl>
            )}
          </Grid>
          <Grid item md={4}>
            <Button
              sx={{ float: 'right' }}
              variant="contained"
              onClick={() => btnClickHandler()}
              size="medium"
              startIcon={<PlusOutlined />}
            >
              {btnText}
            </Button>
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default TableToolBar;
