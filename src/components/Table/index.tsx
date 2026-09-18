import {
  Box,
  Checkbox, // Import Checkbox component
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import { FC, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import LoadingSkeleton from './Loading';

interface TableProps {
  rows: Array<any>;
  columns: string[];
  tableHeaderContent?: any;
  perPage?: number;
  totalRowCount?: number;
  loading?: boolean;
  onPageChange?: (event: { page: number; limit: number }) => void;
  showCheckbox?: boolean;
  handleChangeSelect?: (selectedIds: string[]) => void;
}

const ComonTable: FC<TableProps> = ({
  rows,
  columns,
  tableHeaderContent,
  perPage,
  totalRowCount = rows.length,
  loading = false,
  showCheckbox = false,
  handleChangeSelect = () => { },
  onPageChange = () => { }
}) => {
  const [PER_PAGE, SET_PER_PAGE] = useState(perPage ?? 10);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // State to track selected rows
  const srno = (page - 1) * PER_PAGE;

  const handleChange = (e: any, p: number, limit: number = PER_PAGE) => {
    setPage(p);
    onPageChange({ page: p, limit });
  };

  const handleRowCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, row]); // Add row to selectedRows if checkbox is checked
      handleChangeSelect([...selectedRows, row].map((row) => row?._id));
    } else {
      setSelectedRows(selectedRows.filter((selectedRow) => selectedRow !== row)); // Remove row from selectedRows if checkbox is unchecked
      handleChangeSelect(selectedRows.filter((selectedRow) => selectedRow !== row).map((row) => row?._id));
    }
  };

  const handleSelectAllRows = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(rows); // Select all rows if "Select All" checkbox is checked
      handleChangeSelect(rows.map((row) => row?._id));
    } else {
      setSelectedRows([]); // Deselect all rows if "Select All" checkbox is unchecked
      handleChangeSelect([]);
    }
  };

  console.log('props in table', totalRowCount, srno, rows);

  return (
    <MainCard sx={{ mt: 2 }} content={false}>
      {tableHeaderContent && <Box sx={{ width: '100%', background: '#fff' }}>{tableHeaderContent}</Box>}

      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' },
          userSelect: 'text',
        }}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <PerfectScrollbar>
            <Table
              aria-labelledby="tableTitle"
              sx={{
                '& .MuiTableCell-root:first-of-type': {
                  pl: 2
                },
                '& .MuiTableCell-root:last-of-type': {
                  pr: 3
                }
              }}
            >
              <TableHead
                sx={{
                  display: 'table-header-group',
                  backgroundColor: 'rgb(250, 250, 250)',
                  borderTop: '1px solid rgb(240, 240, 240)',
                  borderBottom: '2px solid rgb(240, 240, 240)'
                }}
              >
                <TableRow>
                  {showCheckbox && (
                    <TableCell align={'left'}>
                      <Checkbox // Checkbox for "Select All"
                        indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                        checked={selectedRows.length === rows.length}
                        onChange={handleSelectAllRows}
                      />
                    </TableCell>
                  )}
                  <TableCell align={'left'}>SRNO</TableCell>
                  {columns.map((headCell: string, idx: number) => (
                    <TableCell key={idx} align={'left'}>
                      {headCell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any, idx: number) => {
                  const isSelected = selectedRows.includes(row); // Check if the current row is selected
                  return (
                    <TableRow
                      hover
                      key={idx}
                      role="checkbox"
                      selected={isSelected}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {showCheckbox && (
                        <TableCell component="th" scope="row" align="left">
                          <Checkbox // Checkbox for each row
                            checked={isSelected}
                            onChange={(event) => handleRowCheckboxChange(event, row)}
                          />
                        </TableCell>
                      )}
                      <TableCell component="th" scope="row" align="left">
                        {srno + idx + 1}
                      </TableCell>
                      {columns.map((col: string, idx: number) => (
                        <TableCell component="th" key={idx} id={`${col} ${idx}`} scope="row" align="left">
                          {row[col]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        )}
        <Box sx={{ width: '100%', borderTop: '1px solid rgb(240, 240, 240)' }}>
          <Grid container justifyContent="center" alignItems="center" padding={2} spacing={2}>
            <Grid item md={6}>
              <Stack direction="row" alignItems="center">
                <Typography variant="h6" color="grey">
                  Row per page
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    id="demo-controlled-open-select"
                    value={PER_PAGE}
                    onChange={(e) => {
                      SET_PER_PAGE(Number(e.target.value));
                      handleChange({}, page, Number(e.target.value));
                    }}
                    size="small"
                    sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
                  >
                    <MenuItem value={5}>5 / page</MenuItem>
                    <MenuItem value={10}>10 / page</MenuItem>
                    <MenuItem value={25}>25 / page</MenuItem>
                    <MenuItem value={50}>50 / page</MenuItem>
                    <MenuItem value={100}>100 / page</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid item md={6}>
              <Pagination
                sx={{ float: 'right' }}
                count={Math.ceil(totalRowCount / PER_PAGE)}
                page={page}
                onChange={handleChange}
                showFirstButton
                showLastButton
                color="primary"
                shape="rounded"
                variant={'outlined'}
              />
            </Grid>
          </Grid>
        </Box>
      </TableContainer>
    </MainCard>
  );
};

export default ComonTable;
