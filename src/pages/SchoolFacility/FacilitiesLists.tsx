import { Button, Grid, TextField } from '@mui/material';
import { FacilityApiProvider, ICreateFacility, IFacility } from 'api/school/facility-api';
import { uploadFile } from 'api/uploader';
import AddDialog from 'components/Dialogs/AddDialog';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import UserAvatar from 'components/UserAvatar';
import { FILE_TYPE } from 'constants/enums';
import { Snack } from 'contexts/SnackBarContext';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import useSnackBarContext from 'hooks/useSnackBar';
import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';

const FacilitiesList = () => {
  const facilityApiProvider = new FacilityApiProvider();
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const [selectedFacility, setSelectedFacility] = useState<IFacility | undefined>();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null | string>();
  const { setSnack } = useSnackBarContext();
  const [selected, setSelected] = useState<IFacility>();
  const [search, setSearch] = useState<string | null>(null);

  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files?.item(0) as File);
    }
  };

  const handleEditClick = (state: IFacility) => {
    setSelected(state);
    setSelectedImage(state.icon);
    handleOpen();
  };
  const handleDeleteClick = (state: IFacility) => {
    setSelectedFacility(state);
    setDeletePopup(true);
  };

  const handleCloseAddPopup = () => {
    setSelected(undefined);
    setSelectedImage(null);
    handleClose();
  };

  const handleCloseDeletePopUp = () => {
    setDeletePopup(false);
    setSelectedFacility(undefined);
  };

  const handleOkay = () => {
    setDeletePopup(false);
    if (selectedFacility?._id) {
      facilityApiProvider
        .deleteFacility(selectedFacility?._id)
        .then((res) => {
          if (res.data) {
            setSnack(new Snack({ message: 'Facility Deleted Successfully', color: 'success', open: true }));
            getFacilities();
          }
        })
        .catch((err) => {
          setSnack(new Snack({ message: err?.error?.message ?? 'Internal Server Error', color: 'error', open: true }));
        });
      setSelectedFacility(undefined);
    }
  };

  console.log('Selected VAlue==>', selected);

  const formik = useFormik<ICreateFacility>({
    initialValues: {
      name: selected?.name ?? '',
      icon: selected?.icon ?? ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).max(255).required('Facility is required')
    }),
    enableReinitialize: true,
    onSubmit: createFacility
  });

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) getFacilities({ name: search });
    },
    [search],
    1000
  );

  useEffect(() => {
    getFacilities();
  }, []);

  return (
    <Fragment>
      <ComonTable
        rows={facilities}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => getFacilities(pagination)}
        tableHeaderContent={
          <TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} btnText="Add Facility" />
        }
        columns={['Facility IMAGE', 'Facility NAME', 'ACTIONS']}
      />
      <AddDialog
        open={open}
        fullScreen={false}
        title="Add New Facility"
        subtitle="Fill Details to Add Facility"
        handleClose={handleCloseAddPopup}
        loading={formik.isSubmitting}
        msg={msg}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <UserAvatar selectedImage={selectedImage} imageChange={imageChange} />
          </Grid>
          <Grid item xs={12} md={9}>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                variant="outlined"
                fullWidth
                required
                error={Boolean(formik.errors.name)}
                helperText={formik.errors.name}
                label="Facility"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="name"
                sx={{ my: 1 }}
                value={formik.values.name}
              />
              <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </AddDialog>
      <ConfirmDialog
        open={deletePopup}
        handleOkay={handleOkay}
        subText="By deleting the Facility You will not be able to create property with this Facility."
        handleClose={handleCloseDeletePopUp}
      />
    </Fragment>
  );

  async function createFacility(values: ICreateFacility) {
    try {
      let res;
      let uploadedImage;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('type', FILE_TYPE.ICON);
        uploadedImage = await uploadFile(formData);
      }
      if (selected?._id)
        res = await facilityApiProvider.editFacility(selected._id, { ...values, icon: uploadedImage?.data || values.icon });
      else res = await facilityApiProvider.addFacility({ ...values, icon: uploadedImage?.data ?? '' });
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'Facility Created Successfully' });
        setTimeout(() => {
          handleClose();
        }, 500);
        getFacilities();
      }
      formik.resetForm();
    } catch (err: any) {
      console.log('err in creating Facility', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function getFacilities(query: any = {}) {
    setLoading(true);
    facilityApiProvider
      .getFacilityList(query)
      .then((res) => {
        if (res.data) {
          setFacilities(
            res.data.map((facility) => ({
              key: facility._id,
              'Facility IMAGE': <img src={facility.icon} width={50} height={50} />,
              'Facility NAME': facility.name,
              ACTIONS: (
                <ActionsTool isDelete handleEdit={() => handleEditClick(facility)} handleDelete={() => handleDeleteClick(facility)} />
              )
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

export default FacilitiesList;
