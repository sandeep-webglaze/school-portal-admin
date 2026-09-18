import { FilterOutlined } from '@ant-design/icons';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Badge,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ICity } from 'api/city';
import { IEnquiry, bulkUpdateEnquiries, deleteEnquiries, getEnquiries } from 'api/enquiry';
import { ISchoolType } from 'api/school';
import { ErrorResponseSchema } from 'api/types';
import { CommonCitySelect } from 'components/CommonFields/SelectCity';
import { SelectSchoolType } from 'components/CommonFields/SelectSchoolType';
import AddDialog from 'components/Dialogs/AddDialog';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import LeadsFilters from 'components/LeadsFilters';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import { ENQUIRY_PLATFORMS, GENDER, SCHOOL_ENQUIRY_STATUS } from 'constants/enums';
import { Snack } from 'contexts/SnackBarContext';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import useSnackBarContext from 'hooks/useSnackBar';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

const EnquiryList = () => {
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([]);
  const { setSnack } = useSnackBarContext();
  const [searchParams, setSearchParams] = useSearchParams({ status: 'all' });
  const tabValue = searchParams.get('status') || 'all';
  const [filters, setFilters] = useState<any>();
  const { open: filterModal, setOpen: setFilterModal, handleClose: closeFilters, handleOpen: openFilters } = useDialog();
  const [selectedLead, setSelectedLead] = useState<IEnquiry>();
  const { open, msg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, handleClose: closeDeletePopup, handleOpen: openDeletePopup } = useDialog();

  useEffect(() => {
    const query: any = { page: 1 };
    if (tabValue !== 'all') query.status = tabValue;
    enquiryList(query);
  }, [tabValue]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ status: newValue });
    setSelectedEnquiries([]);
  };

  const handleEditClick = (state: IEnquiry) => {
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
      pageUrl: selectedLead?.pageUrl ?? '',
      userIp: selectedLead?.userIp,
      platform: selectedLead?.platform ?? '',
      message: selectedLead?.message
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
    onSubmit: (_) => { }
  });

  function handleClosePopup() {
    handleClose();
    setSelectedLead(undefined);
  }

  const handleDelete = (enquiry: IEnquiry) => {
    openDeletePopup();
    setSelectedLead(enquiry);
  };

  return (
    <Fragment>
      <LeadsFilters
        {...{ handleRefresh: enquiryList, filters, setFilters }}
        open={filterModal}
        setOpen={setFilterModal}
        handleClose={closeFilters}
        showPriceRange={false}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h3">Enquiries</Typography>
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

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All" value={'all'} />
            <Tab label="Pending" value={SCHOOL_ENQUIRY_STATUS.PENDING} />
            <Tab label="Accepted" value={SCHOOL_ENQUIRY_STATUS.ACCEPTED} />
            <Tab label="Rejected" value={SCHOOL_ENQUIRY_STATUS.REJECTED} />
          </TabList>
        </Box>
        {selectedEnquiries.length > 0 && (
          <Stack direction="row" gap={2} justifyContent={'end'} mt={2}>
            {tabValue === SCHOOL_ENQUIRY_STATUS.PENDING && (
              <Fragment>
                <Button variant="contained" onClick={() => handleStatusChange({ status: SCHOOL_ENQUIRY_STATUS.ACCEPTED })}>
                  Mark All as Accepted
                </Button>
                <Button variant="outlined" onClick={() => handleStatusChange({ status: SCHOOL_ENQUIRY_STATUS.REJECTED })} color="error">
                  Mark All as Rejected
                </Button>
              </Fragment>
            )}
            <Button variant="outlined" sx={{ float: 'right' }} onClick={openDeletePopup} color="error">
              Delete all Enquiries
            </Button>
          </Stack>
        )}
        <TabPanel value={'all'}>
          <ComonTable
            showCheckbox
            handleChangeSelect={(selectedIds: string[]) => setSelectedEnquiries(selectedIds)}
            rows={enquiries}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination) => enquiryList({ ...pagination })}
            columns={['DATE', 'NAME', 'EMAIL', 'MESSAGE', 'IP', 'PAGE', 'STATUS', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={SCHOOL_ENQUIRY_STATUS.PENDING}>
          <ComonTable
            rows={enquiries}
            loading={loading}
            totalRowCount={totalCount}
            showCheckbox
            handleChangeSelect={(selectedIds: string[]) => setSelectedEnquiries(selectedIds)}
            onPageChange={(pagination) => enquiryList({ ...pagination, status: SCHOOL_ENQUIRY_STATUS.PENDING })}
            columns={['DATE', 'NAME', 'EMAIL', 'MESSAGE', 'IP', 'PAGE', 'STATUS', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={SCHOOL_ENQUIRY_STATUS.ACCEPTED}>
          <ComonTable
            showCheckbox
            handleChangeSelect={(selectedIds: string[]) => setSelectedEnquiries(selectedIds)}
            rows={enquiries}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination) => enquiryList({ ...pagination, status: SCHOOL_ENQUIRY_STATUS.ACCEPTED })}
            columns={['DATE', 'NAME', 'EMAIL', 'MESSAGE', 'IP', 'PAGE', 'STATUS', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={SCHOOL_ENQUIRY_STATUS.REJECTED}>
          <ComonTable
            showCheckbox
            handleChangeSelect={(selectedIds: string[]) => setSelectedEnquiries(selectedIds)}
            rows={enquiries}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination) => enquiryList({ ...pagination, status: SCHOOL_ENQUIRY_STATUS.REJECTED })}
            columns={['DATE', 'NAME', 'EMAIL', 'MESSAGE', 'IP', 'PAGE', 'STATUS', 'ACTIONS']}
          />
        </TabPanel>
      </TabContext>

      <AddDialog
        open={open}
        title="Enquiry Details"
        subtitle="Fill Details to Update Enquiry"
        handleClose={handleClosePopup}
        loading={formik.isSubmitting}
        msg={msg}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Stack direction="row" gap={2} mt={1} display={'flex'} alignItems={'center'}>
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
              </Stack>
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

              <Stack direction="row" gap={2} mt={1} display={'flex'} alignItems={'center'}>
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
              </Stack>

              <FormControl fullWidth error={Boolean(formik.errors.class)} sx={{ mt: 1 }}>
                <InputLabel id="demo-multiple-checkbox-label">Select Class</InputLabel>
                <Select
                  value={formik.values.class}
                  onChange={(e: SelectChangeEvent<unknown>) => formik.setFieldValue('class', e.target.value, false)}
                  label="Select Class"
                >
                  {[...Array(12)].map((item, idx: number) => (
                    <MenuItem key={idx} value={String(idx + 1)}>
                      Class {idx + 1}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.class && <FormHelperText>{formik.errors.class}</FormHelperText>}
              </FormControl>

              <Stack direction="row" gap={2} mt={1} display={'flex'} alignItems={'center'}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  error={Boolean(formik.errors.pageUrl)}
                  helperText={formik.errors.pageUrl}
                  label="E-Mail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  name="pageUrl"
                  sx={{ margin: '5px 0px' }}
                  value={formik.values.pageUrl}
                />
                <FormControl fullWidth>
                  <InputLabel id="platform">Select Platform</InputLabel>
                  <Select
                    name="platform"
                    value={formik.values.platform}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Select Platform"
                  >
                    {Object.values(ENQUIRY_PLATFORMS).map((item, idx: number) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <TextField
                variant="outlined"
                fullWidth
                required
                multiline
                minRows={3}
                maxRows={4}
                error={Boolean(formik.errors.message)}
                helperText={formik.errors.message}
                label="Message"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="message"
                sx={{ margin: '5px 0px' }}
                value={formik.values.message}
              />

              <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </AddDialog>
      <ConfirmDialog open={deletePopup} handleOkay={handleOkay} handleClose={closeDeletePopup} />
    </Fragment>
  );

  function handleStatusChange(values: any) {
    bulkUpdateEnquiries({ enquiriesIds: selectedEnquiries, ...values })
      .then((res) => {
        if (res.data) {
          const isModified = (res.data as any).modifiedCount > 0;
          setSnack(
            new Snack({
              message: isModified ? 'Status Changed Successfully' : 'You Can Only Change Pending Leads',
              color: isModified ? 'success' : 'error',
              open: true
            })
          );
          setSelectedEnquiries([]);
          enquiryList({ page: 1, status: tabValue });
        }
      })
      .catch((err) => {
        setSnack(new Snack({ message: err?.error?.message ?? 'Something Went Wrong!', color: 'error', open: true }));
        setSelectedEnquiries([]);
      });
  }

  function enquiryList(query: any) {
    setLoading(true);
    getEnquiries({ ...filters, ...query })
      .then((res) => {
        if (res.data) {
          setEnquiries(
            res.data.map((enquiry) => ({
              _id: enquiry._id,
              key: enquiry._id,
              NAME: enquiry.name,
              EMAIL: enquiry.email,
              MESSAGE:
                enquiry.message.length > 80 ? (
                  <Tooltip title={enquiry.message}>
                    <Typography>{enquiry.message.substring(0, 80) + '...'}</Typography>
                  </Tooltip>
                ) : (
                  enquiry.message
                ),
              IP: enquiry.userIp,
              PAGE: enquiry.pageUrl,
              STATUS: (
                <Chip
                  label={enquiry.status}
                  variant={'light' as any}
                  color={enquiry.status === SCHOOL_ENQUIRY_STATUS.REJECTED ? 'error' : 'primary'}
                />
              ),
              DATE: moment(enquiry.createdAt).format('ll'),
              ACTIONS: <ActionsTool handleEdit={() => handleEditClick(enquiry)} />
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
  function handleOkay() {
    if (!selectedEnquiries.length) return;
    deleteEnquiries(selectedEnquiries)
      .then((res) => {
        if (res.data) {
          enquiryList({ page: 1 });
          closeDeletePopup();
          setSnack(new Snack({ open: true, color: 'success', message: 'Enquiry Deleted Successfully' }));
        }
      })
      .catch((err: ErrorResponseSchema) => {
        console.error('Err in deleting register enq==>', err);
        setSnack(new Snack({ open: true, color: 'error', message: err.error?.displayMessage ?? 'Something Went Wrong!' }));
      });
  }
};

export default EnquiryList;
