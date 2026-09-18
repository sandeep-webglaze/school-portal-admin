import { DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography
} from '@mui/material';
import { AuthorApiProvider, IAuthorCard, IAuthorStat } from 'api/author';
import { ErrorResponseSchema } from 'api/types';
import { uploadFile } from 'api/uploader';
import InputField from 'components/SchoolForms/InputField';
import Editor from 'components/TextEditor/Editor';
import UserAvatar from 'components/UserAvatar';
import { FILE_TYPE } from 'constants/enums';
import { Snack } from 'contexts/SnackBarContext';
import { FieldArray, FieldArrayRenderProps, Form, Formik } from 'formik';
import useSnackBarContext from 'hooks/useSnackBar';
import { CardComponent } from 'pages/setting';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';
import * as Yup from 'yup';

const AddAuthor = () => {
  const { setSnack } = useSnackBarContext();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const authorApi = new AuthorApiProvider();
  const [initialValues, setInitialValues] = useState({
    name: '',
    slug: '',
    designation: '',
    photo: '',
    shortBio: '',
    fullBioHtml: '',
    quote: '',
    linkedinUrl: '',
    whatsappNumber: '',
    stats: [] as IAuthorStat[],
    specialisations: [] as IAuthorCard[],
    credentials: [] as IAuthorCard[],
    isActive: true
  });

  useEffect(() => {
    if (!state?._id) return;
    authorApi
      .getAuthorDetailById(state._id)
      .then((res) => {
        if (res.data)
          setInitialValues({
            name: res.data.name ?? '',
            slug: res.data.slug ?? '',
            designation: res.data.designation ?? '',
            photo: res.data.photo ?? '',
            shortBio: res.data.shortBio ?? '',
            fullBioHtml: res.data.fullBioHtml ?? '',
            quote: res.data.quote ?? '',
            linkedinUrl: res.data.linkedinUrl ?? '',
            whatsappNumber: res.data.whatsappNumber ?? '',
            stats: res.data.stats ?? [],
            specialisations: res.data.specialisations ?? [],
            credentials: res.data.credentials ?? [],
            isActive: res.data.isActive ?? true
          });
      })
      .catch((err) => console.error('Error in author detail=>', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name Is Required'),
    slug: Yup.string().required('Slug Is Required')
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
      onSubmit={postData}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <CardComponent
            title="Author Details"
            subheader=""
            avatar={<UserOutlined />}
            content={
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="info">
                    <AlertTitle sx={{ fontWeight: 600 }}>How this works</AlertTitle>
                    <Typography variant="body2">
                      Create the author once here, then assign them to any combination slug from the Add/Edit Slug
                      page. The search page shows an &quot;Expert Behind This Page&quot; box automatically, and the
                      full profile lives at <strong>/author/[slug]</strong> with all their assigned pages listed.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField name="name" fullWidth label="Full Name" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField
                    name="slug"
                    fullWidth
                    label="Author Page Slug"
                    helperText="e.g. gaurav-sharma → educationportal.ae/author/gaurav-sharma"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="designation"
                    fullWidth
                    label="Designation"
                    helperText='e.g. "School Admission Expert · Education Advisor at Education Portal"'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Profile Photo
                  </Typography>
                  <UserAvatar
                    selectedImage={selectedPhoto ?? values.photo}
                    imageChange={({ target }) => setSelectedPhoto(target.files?.item(0) as File)}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    Square image recommended. Leave empty to show initials instead.
                  </Typography>
                  {(selectedPhoto || values.photo) && (
                    <Button
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setSelectedPhoto(null);
                        setFieldValue('photo', '', false);
                      }}
                    >
                      Remove photo
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="shortBio"
                    fullWidth
                    multiline
                    rows={3}
                    label="Short Bio (inline box)"
                    helperText="2–4 sentences shown in the author box at the bottom of search pages."
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="quote"
                    fullWidth
                    multiline
                    rows={2}
                    label="Pull Quote"
                    helperText="Optional — highlighted quote shown on the author page."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField name="linkedinUrl" fullWidth label="LinkedIn URL" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField
                    name="whatsappNumber"
                    fullWidth
                    label="WhatsApp Number"
                    helperText="International format, digits only, e.g. 919876543210"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isActive}
                        onChange={({ target }) => setFieldValue('isActive', target.checked, false)}
                      />
                    }
                    label="Active (public author page live)"
                  />
                </Grid>
              </Grid>
            }
          />

          <CardComponent
            title="Full Bio (author page)"
            subheader=""
            avatar={<UserOutlined />}
            content={
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Rich &quot;About me&quot; content for the dedicated author page — story, experience, why parents
                    can trust this expert. Headings here should be H2/H3.
                  </Typography>
                </Alert>
                <Editor value={values?.fullBioHtml} setValue={(value: string) => setFieldValue('fullBioHtml', value, false)} />
              </Box>
            }
          />

          <CardComponent
            title="Stats"
            subheader=""
            avatar={<UserOutlined />}
            content={
              <FieldArray name="stats">
                {({ push, remove }: FieldArrayRenderProps) => (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Small stat chips, e.g. Value: <strong>2,000+</strong> / Label: <strong>School visits</strong>.
                        Shown on the author box and author page.
                      </Typography>
                    </Alert>
                    {(values.stats ?? []).map((_stat, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={5}>
                            <InputField name={`stats.${index}.value`} fullWidth label="Value (e.g. 2,000+)" />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <InputField name={`stats.${index}.label`} fullWidth label="Label (e.g. School visits)" />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <IconButton size="small" color="error" onClick={() => remove(index)} aria-label="Remove stat">
                              <DeleteOutlined />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button variant="outlined" startIcon={<PlusOutlined />} onClick={() => push({ value: '', label: '' })}>
                      Add Stat
                    </Button>
                  </Box>
                )}
              </FieldArray>
            }
          />

          <CardComponent
            title="Areas of Specialisation"
            subheader=""
            avatar={<UserOutlined />}
            content={
              <FieldArray name="specialisations">
                {({ push, remove }: FieldArrayRenderProps) => (
                  <Box>
                    {(values.specialisations ?? []).map((_item, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">Specialisation #{index + 1}</Typography>
                            <IconButton size="small" color="error" onClick={() => remove(index)} aria-label="Remove specialisation">
                              <DeleteOutlined />
                            </IconButton>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <InputField name={`specialisations.${index}.icon`} fullWidth label="Emoji (e.g. 🏫)" />
                          </Grid>
                          <Grid item xs={12} md={10}>
                            <InputField name={`specialisations.${index}.title`} fullWidth label="Title (e.g. Boarding Schools)" />
                          </Grid>
                          <Grid item xs={12}>
                            <InputField name={`specialisations.${index}.description`} fullWidth multiline rows={2} label="Description" />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button variant="outlined" startIcon={<PlusOutlined />} onClick={() => push({ icon: '', title: '', description: '' })}>
                      Add Specialisation
                    </Button>
                  </Box>
                )}
              </FieldArray>
            }
          />

          <CardComponent
            title="Credentials & Recognition"
            subheader=""
            avatar={<UserOutlined />}
            content={
              <FieldArray name="credentials">
                {({ push, remove }: FieldArrayRenderProps) => (
                  <Box>
                    {(values.credentials ?? []).map((_item, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">Credential #{index + 1}</Typography>
                            <IconButton size="small" color="error" onClick={() => remove(index)} aria-label="Remove credential">
                              <DeleteOutlined />
                            </IconButton>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <InputField name={`credentials.${index}.icon`} fullWidth label="Emoji (e.g. 🎓)" />
                          </Grid>
                          <Grid item xs={12} md={10}>
                            <InputField name={`credentials.${index}.title`} fullWidth label="Title (e.g. 10+ Years in Education)" />
                          </Grid>
                          <Grid item xs={12}>
                            <InputField name={`credentials.${index}.description`} fullWidth multiline rows={2} label="Description" />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button variant="outlined" startIcon={<PlusOutlined />} onClick={() => push({ icon: '', title: '', description: '' })}>
                      Add Credential
                    </Button>
                  </Box>
                )}
              </FieldArray>
            }
          />

          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );

  async function postData(values: any) {
    const authorApiProvider = new AuthorApiProvider();
    let uploadedPhoto;
    let res;
    try {
      if (selectedPhoto) {
        const formData = new FormData();
        formData.append('file', selectedPhoto);
        formData.append('type', FILE_TYPE.PROFILE);
        uploadedPhoto = await uploadFile(formData);
      }

      // Everything sent explicitly (even empty strings) so clearing a field
      // in edit mode actually persists.
      const body = {
        name: (values?.name ?? '').trim(),
        slug: (values?.slug ?? '').trim(),
        designation: (values?.designation ?? '').trim(),
        photo: (uploadedPhoto?.data ?? values?.photo ?? '').trim(),
        shortBio: (values?.shortBio ?? '').trim(),
        fullBioHtml: values?.fullBioHtml ?? '',
        quote: (values?.quote ?? '').trim(),
        linkedinUrl: (values?.linkedinUrl ?? '').trim(),
        whatsappNumber: (values?.whatsappNumber ?? '').trim(),
        // Drop fully-blank rows from each list before saving.
        stats: (Array.isArray(values?.stats) ? values.stats : [])
          .map((s: any) => ({ value: (s?.value ?? '').trim(), label: (s?.label ?? '').trim() }))
          .filter((s: any) => s.value || s.label),
        specialisations: cleanCards(values?.specialisations),
        credentials: cleanCards(values?.credentials),
        isActive: Boolean(values?.isActive)
      };

      if (state?._id) {
        res = await authorApiProvider.updateAuthor(body, state._id);
      } else res = await authorApiProvider.createAuthor(body);
      if (res.data) {
        setSnack(new Snack({ open: true, color: 'success', message: 'Author Saved Successfully' }));
        // Go back to the list after save. Staying on a fresh "add" form after
        // a successful CREATE meant a second Submit tried to create the same
        // author again → "Duplicate Key slug. Key already exists".
        setTimeout(() => navigate(ROUTES.AUTHORS), 600);
      }
    } catch (error) {
      console.error('Error in saving author', error);
      setSnack(
        new Snack({ open: true, color: 'error', message: (error as ErrorResponseSchema)?.error?.message ?? 'Something Went Wrong!' })
      );
    }
  }

  function cleanCards(list: any): IAuthorCard[] {
    return (Array.isArray(list) ? list : [])
      .map((c: any) => ({
        icon: (c?.icon ?? '').trim(),
        title: (c?.title ?? '').trim(),
        description: (c?.description ?? '').trim()
      }))
      .filter((c: any) => c.title);
  }
};

export default AddAuthor;
