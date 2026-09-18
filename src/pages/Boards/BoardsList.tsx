import { Button, FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import { ISchoolBoard, createSchoolBoard, deleteBoard, editBoard, getSchoolBoards } from 'api/school';
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

const BoardsList = () => {
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  const [selected, setSelected] = useState<ISchoolBoard>();
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    boardsList({ page: 1 });
  }, []);

  const handleEditClick = (state: ISchoolBoard) => {
    setSelected(state);
    handleOpen();
  };
  const handleDeleteClick = (state: ISchoolBoard) => {
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
      name: selected?.name ?? '',
      featured: selected?.featured ?? false
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      featured: Yup.boolean()
    }),
    enableReinitialize: true,
    onSubmit: postData
  });

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) boardsList({ name: search });
    },
    [search],
    1000
  );

  return (
    <Fragment>
      <ComonTable
        rows={boards}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => boardsList({ ...pagination })}
        tableHeaderContent={
          <TableToolBar btnText="Add Board" searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} />
        }
        columns={['NAME', 'IS FEATURED', 'ACTIONS']}
      />
      <AddDialog
        open={open}
        title="Add New Board"
        subtitle="Fill Details to Add Board"
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
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.featured}
                    onChange={(e: any) => formik.setFieldValue('featured', e.target.checked, false)}
                  />
                }
                label="Is Featured"
              />
              <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </AddDialog>
      <ConfirmDialog
        subText={`By deleting ${selected?.name} board, all schools that are assigned to this board that will not come.`}
        open={deletePopup}
        handleOkay={handleOkay}
        handleClose={handleCloseDeletePopUp}
      />
    </Fragment>
  );

  async function postData(values: { name: string }) {
    let res;
    try {
      formik.resetForm();
      if (selected?._id) res = await editBoard(selected._id, values);
      else res = await createSchoolBoard(values);
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'Classification Created Successfully' });
        setTimeout(() => {
          handleClose();
          setSelected(undefined);
        }, 500);
        boardsList({ page: 1 });
      }
    } catch (err: any) {
      console.log('err in creating user', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function boardsList(query: any) {
    setLoading(true);
    getSchoolBoards(query)
      .then((res) => {
        if (res.data) {
          setBoards(
            res.data.map((board: ISchoolBoard) => ({
              key: board._id,
              NAME: board.name,
              'IS FEATURED': board.featured ? 'Yes' : 'No',
              ACTIONS: <ActionsTool isDelete handleEdit={() => handleEditClick(board)} handleDelete={() => handleDeleteClick(board)} />
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
      deleteBoard(selected?._id)
        .then((res) => {
          if (res.data) {
            setSnack(new Snack({ message: 'School Board  Deleted Successfully', color: 'success', open: true }));
            boardsList({ page: 1 });
          }
        })
        .catch((err) => {
          setSnack(new Snack({ message: err?.error?.message ?? 'Internal Server Error', color: 'error', open: true }));
        });
      setSelected(undefined);
    }
  }
};

export default BoardsList;
