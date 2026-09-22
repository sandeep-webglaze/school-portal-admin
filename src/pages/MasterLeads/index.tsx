import { FilterOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { ICity } from 'api/city';
import { CreateLead, ILead, createMasterLead, editMasterLead, getMasterLeads } from 'api/master-leads';
import { ISchoolType } from 'api/school';
import { CommonCitySelect } from 'components/CommonFields/SelectCity';
import { SelectSchoolType } from 'components/CommonFields/SelectSchoolType';
import AddDialog from 'components/Dialogs/AddDialog';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import LeadsFilters from 'components/LeadsFilters';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import { GENDER } from 'constants/enums';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';

const MasterLeads = () => {
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const [loading, setLoading] = useState(false);
  const [users, setUers] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<ILead>();
  const location = useLocation();

  const [filters, setFilters] = useState<any>();
  const { open: filterModal, setOpen: setFilterModal, handleClose: closeFilters, handleOpen: openFilters } = useDialog();

  useEffect(() => {
    masterLeads({ page: 1 });
  }, []);

  // Prefill + open the Add-Lead dialog when arriving from a CTA "Convert to Lead".
  useEffect(() => {
    const convert = (location.state as any)?.convertLead;
    if (convert) {
      setSelectedLead({ name: convert.name, phoneNumber: convert.phoneNumber } as ILead);
      handleOpen();
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (state: ILead) => {
    setSelectedLead(state);
    handleOpen();
  };

  const formik = useFormik({
    initialValues: {
      name: selectedLead?.name ?? '',
      phoneNumber: selectedLead?.phoneNumber ?? '',
      email: selectedLead?.email ?? '',
      schoolType: selectedLead?.schoolType?._id ?? '',
      city: selectedLead?.city?._id ?? '',
      class: selectedLead?.class ?? '',
      gender: selectedLead?.gender ?? '',
      actualPrice: selectedLead?.actualPrice ?? ('' as any),
      currentPrice: selectedLead?.currentPrice ?? ('' as any)
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      schoolType: Yup.string().required('schoolType is required'),
      city: Yup.string().required('city is required'),
      class: Yup.string().required('class is required'),
      gender: Yup.string().required('gender is required'),
      email: Yup.string().required('email is required'),
      phoneNumber: Yup.number().required('PhoneNumber is required')
    }),
    enableReinitialize: true,
    onSubmit: createLead
  });

  console.log('in lead ==>', selectedLead, formik.values);

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

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) {
        const query = checkType(search);
        masterLeads(query);
      }
    },
    [search],
    1000
  );

  function handleClosePopup() {
    handleClose();
    setSelectedLead(undefined);
  }

  return (
    <Fragment>
      <LeadsFilters
        {...{ handleRefresh: masterLeads, filters, setFilters }}
        open={filterModal}
        setOpen={setFilterModal}
        handleClose={closeFilters}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h3">Leads</Typography>
        <Badge
          badgeContent={Object.keys(filters ?? {}).length}
          color="primary"
          invisible={Object.keys(filters ?? {}).length === 0 ? true : false}
        >
          <IconButton
            size="large"
            onClick={openFilters}
            sx={{ background: '#fff!important', borderRadius: '50%', boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)' }}
          >
            <FilterOutlined />
          </IconButton>
        </Badge>
      </Stack>
      <ComonTable
        rows={users}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => masterLeads({ ...pagination })}
        tableHeaderContent={
          <TableToolBar btnText="Add Lead" searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} />
        }
        columns={['NAME', 'GENDER', 'SCHOOL TYPE', 'CITY', 'EMAIL', 'PHONE', 'CURRENT PRICE', 'PURCHASED', 'CREATED_AT', 'ACTIONS']}
      />
      <AddDialog
        open={open}
        title="Add New Lead"
        subtitle="Fill Details to Add Lead"
        handleClose={handleClosePopup}
        loading={formik.isSubmitting}
        msg={msg}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
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
              <Stack direction="row" gap={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  error={Boolean(formik.errors.email)}
                  helperText={formik.errors.email}
                  label="E-Mail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  name="email"
                  sx={{ margin: '5px 0px' }}
                  value={formik.values.email}
                />
                <FormControl fullWidth sx={{ margin: '5px 0px' }} error={Boolean(formik.errors.gender)}>
                  <InputLabel id="demo-multiple-checkbox-label">Select gender</InputLabel>
                  <Select
                    value={formik.values.gender}
                    onChange={(e: SelectChangeEvent<unknown>) => formik.setFieldValue('gender', e.target.value, false)}
                    label="Select gender"
                  >
                    {Object.values(GENDER).map((item, idx: number) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.errors.gender && <FormHelperText>{formik.errors.gender}</FormHelperText>}
                </FormControl>
              </Stack>

              <CommonCitySelect
                required={true}
                selected={formik.values.city}
                handleChange={function (newVal: ICity): void {
                  formik.setFieldValue('city', newVal._id, false);
                }}
              />
              <SelectSchoolType
                // required={true}
                selected={formik.values.schoolType}
                handleChange={function (newVal: ISchoolType): void {
                  formik.setFieldValue('schoolType', newVal._id, false);
                }}
              />

              <FormControl fullWidth error={Boolean(formik.errors.class)} sx={{ mt: 1 }}>
                <InputLabel id="class">Select Class</InputLabel>
                <Select
                  name="class"
                  value={formik.values.class}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Select Class"
                >
                  {[...Array(12)].map((item, idx: number) => (
                    <MenuItem key={idx} value={'Class ' + String(idx + 1)}>
                      Class {idx + 1}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.class && <FormHelperText>{formik.errors.class}</FormHelperText>}
              </FormControl>

              <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                <TextField
                  type="number" //ad this line
                  name="actualPrice"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.actualPrice}
                  label="Enter Actual Price"
                  variant="outlined"
                  fullWidth
                  required
                  error={Boolean(formik.errors.actualPrice)}
                  helperText={formik.errors.actualPrice}
                />
                <TextField
                  type="number" //ad this line
                  name="currentPrice"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPrice}
                  label="Enter Current Price"
                  variant="outlined"
                  fullWidth
                  required
                  error={Boolean(formik.errors.currentPrice)}
                  helperText={formik.errors.currentPrice}
                />
              </Stack>
              <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </AddDialog>
      <ConfirmDialog open={deletePopup} handleClose={() => setDeletePopup(false)} />
    </Fragment>
  );

  async function createLead(values: CreateLead) {
    try {
      formik.resetForm();
      let res;
      if (selectedLead) res = await editMasterLead(selectedLead._id, values);
      else res = await createMasterLead(values);
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'Lead Created Successfully' });
        setTimeout(() => {
          handleClose();
        }, 500);
        masterLeads({ page: 1 });
        setSelectedLead(undefined);
      }
    } catch (err: any) {
      console.log('err in creating user', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function masterLeads(query: any) {
    setLoading(true);
    getMasterLeads({ ...filters, ...query })
      .then((res) => {
        if (res.data) {
          setUers(
            res.data.map((lead: ILead) => ({
              _id: lead._id,
              key: lead._id,
              NAME: lead.name,
              GENDER: lead.gender,
              'SCHOOL TYPE': lead.schoolType?.name,
              CITY: lead.city?.city,
              EMAIL: lead.email,
              PHONE: lead.phoneNumber,
              'CURRENT PRICE': lead.currentPrice,
              PURCHASED: lead.owner != null ? "Yes" : "No",
              ACTIONS: <ActionsTool handleEdit={() => handleEditClick(lead)} handleDelete={() => setDeletePopup(true)} />,
              CREATED_AT: moment(lead.createdAt).format('ll')
            }))
          );
          setTotalCount(res.totalCount as number);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err');
      });
  }
};

export default MasterLeads;
