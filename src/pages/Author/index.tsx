import { LinkOutlined } from '@ant-design/icons';
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { AuthorApiProvider, IAuthor, IAuthorPage } from 'api/author';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import { SITE_DOMAIN } from 'constants/client';
import useDebounce from 'hooks/useDebounce';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';

const AuthorList = () => {
  const authorApiProvider = new AuthorApiProvider();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  // Dialog listing every page an author is published on.
  const [pagesDialog, setPagesDialog] = useState<{
    open: boolean;
    authorName: string;
    pages: IAuthorPage[];
  }>({ open: false, authorName: '', pages: [] });
  const navigate = useNavigate();

  useEffect(() => {
    authorList({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) authorList({ name: search });
    },
    [search],
    1000
  );

  const handleEditClick = (state: IAuthor) => {
    navigate(ROUTES.ADD_AUTHOR, { state });
  };

  const handleViewClick = (slug: string) => {
    window.open(`${SITE_DOMAIN}/author/${slug}`);
  };

  const openPageOnSite = (page: IAuthorPage) => {
    const path = page.slugType === 'individual' ? 'school' : 'search';
    window.open(`${SITE_DOMAIN}/${path}/${page.slug}`);
  };

  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h3">Authors / Page Experts</Typography>
      </Stack>

      <ComonTable
        rows={authors}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination) => authorList({ ...pagination })}
        tableHeaderContent={
          <TableToolBar
            searchHandler={(newValue: string) => setSearch(newValue)}
            btnClickHandler={() => navigate(ROUTES.ADD_AUTHOR)}
            btnText="Add Author"
          />
        }
        columns={['NAME', 'SLUG', 'DESIGNATION', 'PUBLISHED PAGES', 'ACTIVE', 'ACTIONS']}
      />

      {/* Published-pages detail — which pages, and how each one is attributed */}
      <Dialog
        open={pagesDialog.open}
        onClose={() => setPagesDialog((d) => ({ ...d, open: false }))}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Published pages — {pagesDialog.authorName} ({pagesDialog.pages.length})
        </DialogTitle>
        <DialogContent dividers>
          {pagesDialog.pages.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This author is not published on any page yet. Assign them from the slug form
              dropdown, or paste their /author/... link inside a page&apos;s content.
            </Typography>
          )}
          <List dense>
            {pagesDialog.pages.map((page) => (
              <ListItem
                key={page._id}
                secondaryAction={
                  <Button size="small" startIcon={<LinkOutlined />} onClick={() => openPageOnSite(page)}>
                    Open
                  </Button>
                }
              >
                <ListItemText
                  primary={page.heroTitle || page.formattedText || page.slug}
                  secondary={
                    <Fragment>
                      {page.slug}
                      {'  '}
                      <Chip
                        size="small"
                        sx={{ ml: 1 }}
                        label={page.attribution === 'assigned' ? 'Assigned (dropdown)' : 'Content link'}
                        color={page.attribution === 'assigned' ? 'success' : 'info'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        sx={{ ml: 1 }}
                        label={page.slugType === 'individual' ? 'School page' : 'Search page'}
                        variant="outlined"
                      />
                    </Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Fragment>
  );

  function authorList(query: any) {
    setLoading(true);
    authorApiProvider
      .getAuthorsList({ ...query })
      .then(async (res) => {
        if (res.data) {
          // Fetch the published-pages count for every author in parallel so
          // the admin can see at a glance where each expert is used.
          const pagesByAuthor = await Promise.all(
            res.data.map((author) =>
              authorApiProvider
                .getAuthorPages(author._id)
                .then((r) => r.data?.pages ?? [])
                .catch(() => [] as IAuthorPage[])
            )
          );

          setAuthors(
            res.data.map((author, idx) => ({
              key: author._id,
              NAME: author.name,
              SLUG: author.slug,
              DESIGNATION: author.designation,
              'PUBLISHED PAGES': (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setPagesDialog({ open: true, authorName: author.name, pages: pagesByAuthor[idx] })
                  }
                >
                  {pagesByAuthor[idx].length} page{pagesByAuthor[idx].length === 1 ? '' : 's'}
                </Button>
              ),
              ACTIVE: author.isActive ? 'Yes' : 'No',
              ACTIONS: (
                <ActionsTool
                  handleEdit={() => handleEditClick(author)}
                  isView
                  handleView={() => handleViewClick(author.slug)}
                  isDelete
                  handleDelete={() => deleteAuthor(author._id)}
                />
              )
            }))
          );
          setTotalCount(res.totalCount as number);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  async function deleteAuthor(id: string) {
    // Server also un-assigns this author from every slug, so the search
    // pages simply stop rendering the author box.
    if (!window.confirm('Delete this author? They will be removed from all assigned slugs.')) return;
    try {
      await authorApiProvider.deleteAuthor(id);
      authorList({ page: 1 });
    } catch (err) {
      console.error('Error deleting author', err);
    }
  }
};

export default AuthorList;
