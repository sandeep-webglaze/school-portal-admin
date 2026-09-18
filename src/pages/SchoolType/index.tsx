import { Button, Grid, TextField } from '@mui/material';
import { ISchoolType, createSchoolType, deleteSchoolType, editSchoolType, getSchoolTypes } from 'api/school';
import AddDialog from 'components/Dialogs/AddDialog';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import { Snack } from 'contexts/SnackBarContext';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import useSnackBarContext from 'hooks/useSnackBar';
import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';

const SchoolTypeList = () => {
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const [loading, setLoading] = useState(false);
  const [schoolTypes, setSchoolTypes] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  const [selected, setSelected] = useState<ISchoolType>();
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    schoolTypesList({ page: 1 });
  }, []);

  const handleEditClick = (state: ISchoolType) => {
    setSelected(state);
    handleOpen();
  };

  const handleDeleteClick = (state: ISchoolType) => {
    setSelected(state);
    setDeletePopup(true);
  };

  const handleCloseAddPopUp = () => {
    handleClose();
    setSelected(undefined);
  };

  const handleCloseDeletePopUp = () => {
    setDeletePopup(false);
    setSelected(undefined);
  };

  const formik = useFormik({
    initialValues: {
      name: selected?.name ?? ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).max(255).required('Name is required')
    }),
    enableReinitialize: true,
    onSubmit: postData
  });

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) schoolTypesList({ name: search });
    },
    [search],
    1000
  );

  return (
    <Fragment>
      <ComonTable
        rows={schoolTypes}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => schoolTypesList({ ...pagination })}
        tableHeaderContent={
          <TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} btnText="Add Type" />
        }
        columns={['NAME', 'ACTIONS']}
      />
      <AddDialog
        open={open}
        title="Add New School Type"
        subtitle="Fill Details to Add School Type"
        handleClose={handleCloseAddPopUp}
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
        subText={`By deleting ${selected?.name} school type, all schools that are assigned to school that will not come.`}
        handleClose={handleCloseDeletePopUp}
      />
    </Fragment>
  );

  async function postData(values: { name: string }) {
    let res;
    try {
      formik.resetForm();
      if (selected?._id) res = await editSchoolType(selected._id, values);
      else res = await createSchoolType(values);
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: `School Type ${selected?._id ? 'Updated' : 'Created'} Successfully` });
        setTimeout(() => {
          handleClose();
          setMsg({ active: false, severity: 'success', msg: '' });
        }, 500);
        schoolTypesList({ page: 1 });
      }
    } catch (err: any) {
      console.log('err in creating user', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function schoolTypesList(query: any) {
    setLoading(true);
    getSchoolTypes(query)
      .then((res) => {
        if (res.data) {
          setSchoolTypes(
            res.data.map((schoolType: ISchoolType) => ({
              key: schoolType._id,
              NAME: schoolType.name,
              ACTIONS: (
                <ActionsTool
                  isDelete={true}
                  handleEdit={() => handleEditClick(schoolType)}
                  handleDelete={() => handleDeleteClick(schoolType)}
                />
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

  function handleOkay() {
    setDeletePopup(false);
    if (selected?._id) {
      deleteSchoolType(selected?._id)
        .then((res) => {
          if (res.data) {
            setSnack(new Snack({ message: 'Facility Deleted Successfully', color: 'success', open: true }));
            schoolTypesList({ page: 1 });
          }
        })
        .catch((err) => {
          setSnack(new Snack({ message: err?.error?.message ?? 'Internal Server Error', color: 'error', open: true }));
        });
      setSelected(undefined);
    }
  }
};

export default SchoolTypeList;
