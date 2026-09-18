import { Button, Grid, TextField } from '@mui/material';
import { ISchoolType } from 'api/school';
import {
  ISchoolClassification,
  createSchoolClassification,
  deleteClassification,
  editClassification,
  getSchoolClassifications
} from 'api/school/school-classification';
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

const ClassificationList = () => {
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const [loading, setLoading] = useState(false);
  const [classifications, setClassification] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  const [selected, setSelected] = useState<ISchoolClassification>();
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    classificationsList({ page: 1 });
  }, []);

  const handleEditClick = (state: ISchoolClassification) => {
    setSelected(state);
    handleOpen();
  };
  const handleDeleteClick = (state: ISchoolClassification) => {
    setSelected(state);
    setDeletePopup(true);
  };

  const handleCloseAddPopup = () => {
    setSelected(undefined);
    handleClose();
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
      if (search != null) classificationsList({ name: search });
    },
    [search],
    1000
  );

  return (
    <Fragment>
      <ComonTable
        rows={classifications}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => classificationsList({ ...pagination })}
        tableHeaderContent={
          <TableToolBar
            btnText="Add Classification"
            searchHandler={(newValue: string) => setSearch(newValue)}
            btnClickHandler={handleOpen}
          />
        }
        columns={['NAME', 'ACTIONS']}
      />
      <AddDialog
        open={open}
        title="Add New Classification"
        subtitle="Fill Details to Add Classification"
        handleClose={handleCloseAddPopup}
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
        subText={`By deleting ${selected?.name} classification, all schools that are assigned to this classification that will not come.`}
        handleOkay={handleOkay}
        handleClose={handleCloseDeletePopUp}
      />
    </Fragment>
  );

  async function postData(values: { name: string }) {
    let res;
    try {
      formik.resetForm();

      if (selected?._id) res = await editClassification(selected._id, values);
      else res = await createSchoolClassification(values);

      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'Classification Created Successfully' });
        setTimeout(() => {
          handleClose();
          setSelected(undefined);
        }, 500);
        classificationsList({ page: 1 });
      }
    } catch (err: any) {
      console.log('err in creating user', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function classificationsList(query: any) {
    setLoading(true);
    getSchoolClassifications(query)
      .then((res) => {
        if (res.data) {
          setClassification(
            res.data.map((user: ISchoolType) => ({
              key: user._id,
              NAME: user.name,
              ACTIONS: <ActionsTool isDelete handleEdit={() => handleEditClick(user)} handleDelete={() => handleDeleteClick(user)} />
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
      deleteClassification(selected?._id)
        .then((res) => {
          if (res.data) {
            setSnack(new Snack({ message: 'Classification  Deleted Successfully', color: 'success', open: true }));
            classificationsList({ page: 1 });
          }
        })
        .catch((err) => {
          setSnack(new Snack({ message: err?.error?.message ?? 'Internal Server Error', color: 'error', open: true }));
        });
      setSelected(undefined);
    }
  }
};

export default ClassificationList;
