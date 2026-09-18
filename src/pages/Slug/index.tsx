import { Badge, Box, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ICreateSlug, ISlug, SlugApiProvider } from 'api/slug';
import Filters from 'components/SlugFilters';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import { SITE_DOMAIN } from 'constants/client';
import { SLUG_TYPE } from 'constants/enums';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';
import * as Yup from 'yup';

const SlugList = () => {
  const slugApiProvoder = new SlugApiProvider();
  const { open, setOpen, msg, setMsg, handleClose, handleOpen } = useDialog();
  const [loading, setLoading] = useState(false);
  const [slugs, setSlugs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>();
  // Which kind of slug to list: COMBINATION = city/board landing pages
  // (e.g. boarding-schools-in-kolkata), INDIVIDUAL = the per-school slug
  // record that powers /school/[slug] (admin-edits FAQ/keywords/hero per
  // school from here too).
  const [slugType, setSlugType] = useState<SLUG_TYPE>(SLUG_TYPE.COMBINATION);

  useEffect(() => {
    slugList({ page: 1 });
    // Re-fetch on tab switch so the table reflects the selected slug type.
  }, [slugType]);

  const formik = useFormik<ICreateSlug>({
    initialValues: {
      slug: '',
      formattedText: '',
      isHomepageSlug: false
    },
    validationSchema: Yup.object().shape({
      slug: Yup.string().min(3).max(255).required('slug is required'),
      formattedText: Yup.string().min(3).max(255).required('Formatted text is required')
    }),
    onSubmit: addSlug
  });

  const handleEditClick = (state: ISlug) => {
    navigate(ROUTES.ADD_SLUG, { state });
  };

  const handleViewClick = (slug: string) => {
    // Route differs per slug type. INDIVIDUAL slugs are school detail pages
    // (/school/<slug>); COMBINATION slugs are city/board landing pages
    // (/search/<slug>). Picking the wrong path lands on a 404 or a single-
    // school search result instead of the actual page admin is editing.
    const path = slugType === SLUG_TYPE.INDIVIDUAL ? 'school' : 'search';
    window.open(`${SITE_DOMAIN}/${path}/${slug}`);
  };

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) slugList({ slug: search });
    },
    [search],
    1000
  );

  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h3">List of All Slugs</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={slugType}
            onChange={(_, value: SLUG_TYPE) => setSlugType(value)}
            aria-label="Slug type"
          >
            <Tab label="Combination Slugs" value={SLUG_TYPE.COMBINATION} />
            <Tab label="School Slugs" value={SLUG_TYPE.INDIVIDUAL} />
          </Tabs>
        </Box>
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.14228 14.9993C5.48547 14.0283 6.4115 13.3327 7.50002 13.3327C8.58852 13.3327 9.5146 14.0283 9.85777 14.9993H18.3334V16.666H9.85777C9.5146 17.637 8.58852 18.3327 7.50002 18.3327C6.4115 18.3327 5.48547 17.637 5.14228 16.666H1.66669V14.9993H5.14228ZM10.1423 9.16602C10.4854 8.19502 11.4115 7.49935 12.5 7.49935C13.5885 7.49935 14.5146 8.19502 14.8578 9.16602H18.3334V10.8327H14.8578C14.5146 11.8037 13.5885 12.4993 12.5 12.4993C11.4115 12.4993 10.4854 11.8037 10.1423 10.8327H1.66669V9.16602H10.1423ZM5.14228 3.33268C5.48547 2.36169 6.4115 1.66602 7.50002 1.66602C8.58852 1.66602 9.5146 2.36169 9.85777 3.33268H18.3334V4.99935H9.85777C9.5146 5.97034 8.58852 6.66602 7.50002 6.66602C6.4115 6.66602 5.48547 5.97034 5.14228 4.99935H1.66669V3.33268H5.14228ZM7.50002 4.99935C7.96025 4.99935 8.33335 4.62625 8.33335 4.16602C8.33335 3.70578 7.96025 3.33268 7.50002 3.33268C7.03979 3.33268 6.66669 3.70578 6.66669 4.16602C6.66669 4.62625 7.03979 4.99935 7.50002 4.99935ZM12.5 10.8327C12.9603 10.8327 13.3334 10.4596 13.3334 9.99935C13.3334 9.5391 12.9603 9.16602 12.5 9.16602C12.0398 9.16602 11.6667 9.5391 11.6667 9.99935C11.6667 10.4596 12.0398 10.8327 12.5 10.8327ZM7.50002 16.666C7.96025 16.666 8.33335 16.2929 8.33335 15.8327C8.33335 15.3724 7.96025 14.9993 7.50002 14.9993C7.03979 14.9993 6.66669 15.3724 6.66669 15.8327C6.66669 16.2929 7.03979 16.666 7.50002 16.666Z"
                fill="black"
              />
            </svg>
          </IconButton>
        </Badge>
      </Stack>
      <Filters {...{ open, setOpen, handleClose, handleRefresh: slugList, filters, setFilters }} />

      <ComonTable
        rows={slugs}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination) => slugList({ ...pagination })}
        tableHeaderContent={
          <TableToolBar
            searchHandler={(newValue: string) => setSearch(newValue)}
            btnClickHandler={() => navigate(ROUTES.ADD_SLUG)}
            btnText="Add Slug"
            btnActions={Boolean(Object.keys(filters ?? {}).length !== 0 && slugs.length <= 0)}
          />
        }
        columns={['SLUG', 'TITLE', 'IS HOMEPAGE', 'ACTIONS']}
      />
    </Fragment>
  );

  async function addSlug(data: ICreateSlug) {
    try {
      formik.resetForm();
      const res = await slugApiProvoder.createSlug(data);
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'Slug Created Successfully' });
        setTimeout(() => {
          handleClose();
        }, 500);
        slugList({ page: 1 });
      }
    } catch (err: any) {
      console.log('err in creating user', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function slugList(query: any) {
    setLoading(true);
    slugApiProvoder
      .getSlugsList({ ...filters, ...query, slugType })
      .then((res) => {
        if (res.data) {
          setSlugs(
            res.data.map((slug) => ({
              key: slug._id,
              SLUG: slug.slug,
              TITLE: slug.formattedText,
              'IS HOMEPAGE': slug.isHomepageSlug ? 'Yes' : 'No',
              ACTIONS: <ActionsTool handleEdit={() => handleEditClick(slug)} isView handleView={() => handleViewClick(slug.slug)} />
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

export default SlugList;
