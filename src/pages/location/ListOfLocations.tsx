import { Button, FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import { CreateCity, ICity, addCity, deleteCity, editCity, getCitiesList } from 'api/city';
import { uploadFile } from 'api/uploader';
import SlugInputField from 'components/CommonFields/SlugInputField';
import AddDialog from 'components/Dialogs/AddDialog';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import UserAvatar from 'components/UserAvatar';
import { FILE_TYPE } from 'constants/enums';
import { Snack } from 'contexts/SnackBarContext';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { slugify } from 'helpers';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import useSnackBarContext from 'hooks/useSnackBar';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';
import * as Yup from 'yup';

const ListOfLocations = () => {
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null | string>();
  const { setSnack } = useSnackBarContext();
  const [selected, setSelected] = useState<ICity>();
  const [search, setSearch] = useState<string | null>(null);
  const navigate = useNavigate();

  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files?.item(0) as File);
    }
  };
  const handleEditClick = (state: ICity) => {
    setSelected(state);
    setSelectedImage(state.icon);
    handleOpen();
  };
  const handleDeleteClick = (state: ICity) => {
    setSelected(state);
    setDeletePopup(true);
  };

  const handleCloseAddPopup = () => {
    setSelected(undefined);
    setSelectedImage(null);
    handleClose();
  };

  const handleCloseDeletePopUp = () => {
    setDeletePopup(false);
    setSelected(undefined);
  };

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) cityList({ city: search });
    },
    [search],
    1000
  );

  const handleCityChange = (
    e: any,
    formik: FormikProps<{
      city: string;
      slug: string;
      country: string;
      isPopularCity: boolean;
      state: string;
      icon: string;
    }>
  ) => {
    formik.handleChange(e);
    if (!selected) formik.setFieldValue('slug', slugify(e.target.value), false);
  };

  useEffect(() => {
    cityList();
  }, []);

  return (
    <Fragment>
      <ComonTable
        rows={cities}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => cityList(pagination)}
        tableHeaderContent={
          <TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} btnText="Add City" />
        }
        columns={['CITY IMAGE', 'IS Featured', 'CITY NAME', 'STATE', 'ACTIONS']}
      />
      <Formik
        initialValues={{
          city: selected?.city ?? '',
          slug: selected?.slug ?? '',
          country: selected?.country ?? 'India',
          isPopularCity: selected?.isPopularCity ?? false,
          state: selected?.state ?? '',
          icon: selected?.icon ?? ''
        }}
        validationSchema={Yup.object().shape({
          city: Yup.string().min(3).max(255).required('City is required'),
          state: Yup.string().min(3).max(255).required('State is required')
        })}
        onSubmit={createCity}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <AddDialog
              open={open}
              fullScreen={false}
              title="Add New City"
              subtitle="Fill Details to Add City"
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
                      error={Boolean(formik.errors.city)}
                      helperText={formik.errors.city}
                      label="City"
                      onBlur={formik.handleBlur}
                      onChange={(e) => handleCityChange(e, formik)}
                      name="city"
                      sx={{ my: 1 }}
                      value={formik.values.city}
                    />
                    <TextField
                      variant="outlined"
                      fullWidth
                      required
                      error={Boolean(formik.errors.state)}
                      helperText={formik.errors.state}
                      label="State"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="state"
                      sx={{ my: 1 }}
                      value={formik.values.state}
                    />
                    <SlugInputField initialSlug={selected?.slug} />
                    {selected?._id && (
                      <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        onClick={() => navigate(ROUTES.EDIT_SEO, { state: { slug: selected?.slug, from: 'City' } })}
                      >
                        Seo Settings
                      </Button>
                    )}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.isPopularCity}
                          onChange={(e: any) => formik.setFieldValue('isPopularCity', e.target.checked, false)}
                        />
                      }
                      label="Is Popular"
                    />
                    <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                      Submit
                    </Button>
                  </form>
                </Grid>
              </Grid>
            </AddDialog>
          </Form>
        )}
      </Formik>
      <ConfirmDialog
        open={deletePopup}
        handleOkay={handleOkay}
        subText="By deleting the City You will not be able to create property with this City."
        handleClose={handleCloseDeletePopUp}
      />
    </Fragment>
  );

  async function createCity(values: CreateCity, { resetForm }: FormikHelpers<any>) {
    try {
      let uploadedImage;
      let res;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('type', FILE_TYPE.ICON);
        uploadedImage = await uploadFile(formData);
      }
      if (selected?._id) res = await editCity(selected._id, { ...values, icon: uploadedImage?.data || values.icon });
      else res = await addCity({ ...values, icon: uploadedImage?.data ?? '' });
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'City Created Successfully' });
        setTimeout(() => {
          handleClose();
          setSelected(undefined);
        }, 500);
        cityList();
      }
      resetForm();
    } catch (err: any) {
      console.log('err in creating city', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function cityList(query: any = {}) {
    setLoading(true);
    getCitiesList(query)
      .then((res) => {
        if (res.data) {
          setCities(
            res.data.map((city: ICity) => ({
              key: city._id,
              'CITY IMAGE': <img src={city.icon} width={50} height={50} />,
              'CITY NAME': city.city,
              STATE: city.state,
              'IS Featured': city.isPopularCity ? 'Yes' : 'No',
              ACTIONS: <ActionsTool isDelete handleEdit={() => handleEditClick(city)} handleDelete={() => handleDeleteClick(city)} />
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
    setDeletePopup(false);
    if (selected?._id) {
      deleteCity(selected?._id)
        .then((res) => {
          if (res.data) {
            setSnack(new Snack({ message: 'Facility Deleted Successfully', color: 'success', open: true }));
            cityList();
          }
        })
        .catch((err) => {
          setSnack(new Snack({ message: err?.error?.message ?? 'Internal Server Error', color: 'error', open: true }));
        });
      setSelected(undefined);
    }
  }
};

export default ListOfLocations;
