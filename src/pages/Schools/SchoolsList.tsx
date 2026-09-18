import { FilterOutlined } from '@ant-design/icons';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Badge, Box, Chip, IconButton, Stack, Tab, Typography } from '@mui/material';
import { ISchool, deleteSchool, getSchoolList } from 'api/school';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import DragableSchools from 'components/DragableSchools';
import SchoolFilters from 'components/SchoolFilters';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import { SITE_DOMAIN } from 'constants/client';
import { Snack } from 'contexts/SnackBarContext';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import useSnackBarContext from 'hooks/useSnackBar';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ROUTES } from 'routes/MainRoutes';

enum SCHOOL_TABS {
  FEATURED = 'featured',
  SCHOOL_LIST = 'all'
}
const SchoolsList = () => {
  const { open: deletePopup, setOpen: setDeletePopup } = useDialog();
  const { setSnack } = useSnackBarContext();
  const [loading, setLoading] = useState(false);
  const [users, setUers] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ISchool>();
  const [search, setSearch] = useState<string | null>(null);
  const { open, setOpen, handleClose, handleOpen } = useDialog();
  const [filters, setFilters] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams({ type: SCHOOL_TABS.SCHOOL_LIST });
  const tabValue = searchParams.get('type') || SCHOOL_TABS.SCHOOL_LIST;
  const [schools, setSchools] = useState<ISchool[]>();

  useEffect(() => {
    const query: any = { page: 1 };
    if (tabValue == SCHOOL_TABS.FEATURED) {
      query.isFeatured = true;
      query.sortBy = {
        isFeatured: 'desc'
      };
      query.limit = 100;
    }
    schoolsList(query);
  }, [tabValue]);

  const handleEditClick = (state: ISchool) => {
    navigate(ROUTES.SCHOOL.SCHOOL_ADD, { state });
  };

  const handleAddSchool = () => {
    navigate(ROUTES.SCHOOL.SCHOOL_ADD);
  };

  const handleViewSchool = (slug: string) => {
    window.open(`${SITE_DOMAIN}/school/${slug}`, '_blank');
  };

  const handleDeleteClick = (state: ISchool) => {
    setSelected(state);
    setDeletePopup(true);
  };

  const handleCloseDeletePopUp = () => {
    setDeletePopup(false);
    setSelected(undefined);
  };

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) schoolsList({ name: search });
    },
    [search],
    1000
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ type: newValue });
  };

  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h3">List of All Schools</Typography>
        <Badge
          badgeContent={Object.keys(filters ?? {}).length}
          color="primary"
          invisible={Object.keys(filters ?? {}).length === 0 ? true : false}
        >
          <IconButton
            size="large"
            onClick={handleOpen}
            sx={{ background: '#fff!important', borderRadius: '50%', boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)' }}
          >
            <FilterOutlined />
          </IconButton>
        </Badge>
      </Stack>
      <SchoolFilters {...{ open, filters, setFilters, setOpen, handleClose, handleRefresh: schoolsList }} />
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All Schools" value={SCHOOL_TABS.SCHOOL_LIST} />
            <Tab label="Featured Schools" value={SCHOOL_TABS.FEATURED} />
          </TabList>
        </Box>
        <TabPanel value={SCHOOL_TABS.SCHOOL_LIST}>
          <ComonTable
            rows={users}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination: any) => schoolsList({ ...pagination, ...filters })}
            tableHeaderContent={
              <TableToolBar
                searchHandler={(newValue: string) => setSearch(newValue)}
                btnClickHandler={handleAddSchool}
                btnText="Add School"
              />
            }
            columns={['NAME', 'SLUG', 'RATING', 'CLASSIFICATION', 'TYPE OF SCHOOL', 'BOARDS', 'STATUS', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={SCHOOL_TABS.FEATURED}>
          {/* <ComonTable
            rows={users}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination: any) => schoolsList({ ...pagination, ...filters, isFeatured: true })}
            tableHeaderContent={
              <TableToolBar
                searchHandler={(newValue: string) => setSearch(newValue)}
                btnClickHandler={handleAddSchool}
                btnText="Add School"
              />
            }
            columns={['NAME', 'SLUG', 'RATING', 'CLASSIFICATION', 'TYPE OF SCHOOL', 'BOARDS', 'STATUS', 'ACTIONS']}
          /> */}
          <DragableSchools schools={schools} />
        </TabPanel>
      </TabContext>
      <ConfirmDialog
        open={deletePopup}
        handleOkay={handleDeleteOkay}
        subText="By deleting the School You will not be able to create property with this School."
        handleClose={handleCloseDeletePopUp}
      />
    </Fragment>
  );

  function schoolsList(query: any) {
    setLoading(true);
    getSchoolList(query)
      .then((res) => {
        if (res.data?.schools) {
          setSchools([...res.data.schools]);
          setUers(
            res.data.schools.map((school: ISchool) => ({
              key: school._id,
              NAME: school.name,
              SLUG: school.slug,
              EMAIL: school.mail,
              RATING: school.avgRating,
              CLASSIFICATION: school?.classification?.name,
              'TYPE OF SCHOOL': school?.type.map((type) => type.name).toString(),
              BOARDS: school.schoolBoards.map((board) => board.name).toString(),
              STATUS: (
                <Chip
                  label={school.published ? 'Published' : 'Draft'}
                  // variant={'light' as any}
                  sx={{ background: school.published ? '#d9f7be' : 'light', color: school.published ? '#278c22' : 'primaryBoards' }}
                  // color={school.published ? 'primary' : '#8c8c8c'}
                />
              ),
              ACTIONS: (
                <ActionsTool
                  isView
                  handleView={() => handleViewSchool(school.slug)}
                  handleEdit={() => handleEditClick(school)}
                  isDelete
                  handleDelete={() => handleDeleteClick(school)}
                />
              )
            }))
          );
          setTotalCount(res.data.totalCount as number);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err');
      });
  }

  function handleDeleteOkay() {
    setDeletePopup(false);
    if (selected?._id) {
      deleteSchool(selected?._id)
        .then((res) => {
          if (res.data) {
            setSnack(new Snack({ message: 'School Deleted Successfully', color: 'success', open: true }));
            schoolsList({});
          }
        })
        .catch((err) => {
          setSnack(new Snack({ message: err?.error?.message ?? 'Internal Server Error', color: 'error', open: true }));
        });
      setSelected(undefined);
    }
  }
};

export default SchoolsList;
