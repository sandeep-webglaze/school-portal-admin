import { DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Typography
} from '@mui/material';
import { AuthorApiProvider, IAuthor } from 'api/author';
import { ICity } from 'api/city';
import { IConfig, getConfigDetails } from 'api/config';
import { ISchoolBoard, ISchoolClassification, ISchoolType, getSchoolBoards } from 'api/school';
import { SlugApiProvider } from 'api/slug';
import { ErrorResponseSchema } from 'api/types';
import { uploadFile } from 'api/uploader';
import { CommonCitySelect } from 'components/CommonFields/SelectCity';
import { SelectClassification } from 'components/CommonFields/SelectClassification';
import { SelectSchoolType } from 'components/CommonFields/SelectSchoolType';
import SlugInputField from 'components/CommonFields/SlugInputField';
import InputField from 'components/SchoolForms/InputField';
import SeoForm from 'components/SeoForm';
import Editor from 'components/TextEditor/Editor';
import UserAvatar from 'components/UserAvatar';
import { FILE_TYPE } from 'constants/enums';
import { Snack } from 'contexts/SnackBarContext';
import { FieldArray, FieldArrayRenderProps, Form, Formik } from 'formik';
import { getInitialMetaData, removeEmpty } from 'helpers';
import useSnackBarContext from 'hooks/useSnackBar';
import { CardComponent } from 'pages/setting';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import * as Yup from 'yup';

const AddSlug = () => {
  const [schoolBoards, setschoolBoards] = useState<ISchoolBoard[] | []>([]);
  const [authors, setAuthors] = useState<IAuthor[] | []>([]);
  const { setSnack } = useSnackBarContext();
  const [selectedImgFacebook, setSelectedImage] = useState<File | null>(null);
  const [selectedImgTwitter, setSelectedImgTwiiter] = useState<File | null>(null);
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null);
  const [config, setConfig] = useState<IConfig>();
  const { state } = useLocation();
  const slugApi = new SlugApiProvider();
  const [initialValues, setinitialValues] = useState({
    slugMetaData: getInitialMetaData({}),
    slugJsonSchema: '',
    slug: '',
    formattedText: '',
    isHomepageSlug: false,
    filters: {
      city: '',
      classification: '',
      type: '',
      schoolBoard: ''
    },
    slugContent: '',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    faqs: [] as { question: string; answer: string }[],
    author: ''
  });

  useEffect(() => {
    if (!state?._id) return;
    console.log('state==>', state?._id);
    slugApi
      .getSlugDetailById(state?._id)
      .then((res) => {
        if (res.data)
          setinitialValues({
            slugMetaData: getInitialMetaData(res.data?.slugMetaData),
            slugJsonSchema: res.data?.slugJsonSchema ?? '',
            slug: res.data?.slug,
            slugContent: res.data.slugContent ?? '',
            formattedText: res.data?.formattedText,
            isHomepageSlug: res.data?.isHomepageSlug ?? false,
            filters: (res.data?.filters as any) ?? {
              city: '',
              classification: '',
              type: '',
              schoolBoard: ''
            },
            heroTitle: res.data?.heroTitle ?? '',
            heroSubtitle: res.data?.heroSubtitle ?? '',
            heroImage: res.data?.heroImage ?? '',
            faqs: (res.data?.faqs as { question: string; answer: string }[]) ?? [],
            // Author may come back as a plain id or a populated object —
            // normalise to the id string the dropdown expects.
            author: (res.data as any)?.author?._id ?? (res.data as any)?.author ?? ''
          });
      })
      .catch((err) => console.error('Error in slug detail=>', err));
  }, [state]);

  useEffect(() => {
    getSchoolBoards()
      .then((res) => {
        if (res.data) setschoolBoards(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING BPOARDS', err));

    new AuthorApiProvider()
      .getAuthorsList({ limit: 100 })
      .then((res) => {
        if (res.data) setAuthors(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING AUTHORS', err));
  }, []);

  const validationSchema = Yup.object().shape({
    slug: Yup.string().required('Slug Is Required'),
    formattedText: Yup.string().required('Formatted Text Is Required')
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
            title="Slug Dteails"
            subheader=""
            avatar={<SettingOutlined />}
            category={'CATEGORIES.PRIVACY_POLICY'}
            content={
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {/* <InputField name="slug" fullWidth label="Slug" /> */}
                  <SlugInputField initialSlug={state?.slug} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField name="formattedText" fullWidth label="Formattted Text" />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="heroTitle"
                    fullWidth
                    label="Hero Title (page H1)"
                    helperText="Big heading shown at the top of the search page. Leave blank to auto-generate from the slug."
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="heroSubtitle"
                    fullWidth
                    multiline
                    rows={2}
                    label="Hero Subtitle"
                    helperText="Short text shown under the hero heading. Leave blank to auto-generate from the slug."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Hero Banner Image
                  </Typography>
                  <UserAvatar
                    selectedImage={selectedHeroImage ?? values.heroImage}
                    imageChange={({ target }) =>
                      setSelectedHeroImage(target.files?.item(0) as File)
                    }
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    Recommended: 1920 × 450 px, under 500 KB. Leave empty to use the default site banner.
                  </Typography>
                  {(selectedHeroImage || values.heroImage) && (
                    <Button
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setSelectedHeroImage(null);
                        setFieldValue('heroImage', '', false);
                      }}
                    >
                      Remove image
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CommonCitySelect
                    selected={values.filters.city}
                    handleChange={function (newVal: ICity): void {
                      setFieldValue('filters.city', newVal._id, false);
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <SelectClassification
                    selected={values.filters.classification}
                    handleChange={function (newVal: ISchoolClassification): void {
                      setFieldValue('filters.classification', newVal._id, false);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SelectSchoolType
                    selected={values.filters.type}
                    handleChange={function (newVal: ISchoolType): void {
                      setFieldValue('filters.type', newVal._id, false);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">Select School Board</InputLabel>
                    <Select
                      value={values.filters.schoolBoard}
                      onChange={(e: SelectChangeEvent<unknown>) => setFieldValue('filters.schoolBoard', e.target.value, false)}
                      label="Select School Board"
                    >
                      {schoolBoards.map((item, idx: number) => (
                        <MenuItem key={idx} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="select-author-label">Select Author (Expert Behind This Page)</InputLabel>
                    <Select
                      labelId="select-author-label"
                      value={values.author ?? ''}
                      onChange={(e: SelectChangeEvent<unknown>) => setFieldValue('author', e.target.value, false)}
                      label="Select Author (Expert Behind This Page)"
                    >
                      <MenuItem value="">
                        <em>None — no author box on this page</em>
                      </MenuItem>
                      {authors.map((item, idx: number) => (
                        <MenuItem key={idx} value={item._id}>
                          {item.name} {item.designation ? `— ${item.designation}` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isHomepageSlug}
                        onChange={({ target }) => setFieldValue('isHomepageSlug', target.checked, false)}
                      />
                    }
                    label="Show on HomePage"
                  />
                </Grid>
              </Grid>
            }
          />
          <SeoForm {...{ values, setFieldValue, selectedImgFacebook, setSelectedImage, selectedImgTwitter, setSelectedImgTwiiter }} />

          <CardComponent
            title="Slug Content"
            subheader=""
            avatar={<SettingOutlined />}
            content={
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle sx={{ fontWeight: 600 }}>SEO Content Checklist</AlertTitle>
                  <Typography variant="body2" component="div">
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      <li>
                        Target <strong>1,800 – 2,500 words</strong>. Listing pages perform best in this range.
                      </li>
                      <li>
                        Use <strong>only one H1</strong> matching the primary keyword. All other section headings should be H2 / H3.
                      </li>
                      <li>Primary keyword in first sentence, in 1 H2, in the FAQ, and the conclusion (≈ 1 – 1.5 % density).</li>
                      <li>
                        Add a <strong>numbered Top 10 list</strong> linking to verified <code>/school/[slug]</code> profiles.
                      </li>
                      <li>
                        Include a <strong>fee comparison table</strong> and a <strong>FAQ section (6 – 8 Q&amp;A)</strong>.
                      </li>
                      <li>
                        Place <strong>3 – 5 keyword-rich internal links</strong> to sibling listings (other cities or boards).
                      </li>
                      <li>
                        Don&apos;t list individual schools manually — those render automatically from the filters above (City /
                        Classification / Type / Board).
                      </li>
                    </ul>
                  </Typography>
                </Alert>
                <Editor value={values?.slugContent} setValue={(value: string) => setFieldValue('slugContent', value, false)} />
              </Box>
            }
          />

          <CardComponent
            title="Page FAQs"
            subheader=""
            avatar={<SettingOutlined />}
            content={
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle sx={{ fontWeight: 600 }}>FAQ Section</AlertTitle>
                  <Typography variant="body2">
                    These questions render as an accordion on the search page and are emitted as Google FAQ
                    structured data. Add 4 – 8 questions. Leave this empty and the page auto-generates FAQs
                    from the slug.
                  </Typography>
                </Alert>
                <FieldArray name="faqs">
                  {({ push, remove }: FieldArrayRenderProps) => (
                    <Box>
                      {(values.faqs ?? []).length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          No FAQs added yet — the page will auto-generate them until you add your own.
                        </Typography>
                      )}
                      {(values.faqs ?? []).map((_faq, index) => (
                        <Box
                          key={index}
                          sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                        >
                          <Grid container spacing={2}>
                            <Grid
                              item
                              xs={12}
                              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <Typography variant="subtitle2">FAQ #{index + 1}</Typography>
                              <IconButton size="small" color="error" onClick={() => remove(index)} aria-label="Remove FAQ">
                                <DeleteOutlined />
                              </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                              <InputField name={`faqs.${index}.question`} fullWidth label="Question" />
                            </Grid>
                            <Grid item xs={12}>
                              <InputField name={`faqs.${index}.answer`} fullWidth multiline rows={3} label="Answer" />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<PlusOutlined />}
                        onClick={() => push({ question: '', answer: '' })}
                      >
                        Add FAQ
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Box>
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
    const slugApiProvider = new SlugApiProvider();
    let uploadedImage;
    let uploadedImageTwitter;
    let uploadedHeroImage;
    let res;
    try {
      if (selectedImgFacebook) {
        const formData = new FormData();
        formData.append('file', selectedImgFacebook);
        formData.append('type', FILE_TYPE.SEO_IMAGES);
        uploadedImage = await uploadFile(formData);
      }
      if (selectedImgTwitter) {
        const formData = new FormData();
        formData.append('file', selectedImgTwitter);
        formData.append('type', FILE_TYPE.SEO_IMAGES);
        uploadedImageTwitter = await uploadFile(formData);
      }
      if (selectedHeroImage) {
        const formData = new FormData();
        formData.append('file', selectedHeroImage);
        formData.append('type', FILE_TYPE.SEO_IMAGES);
        uploadedHeroImage = await uploadFile(formData);
      }
      const body = removeEmpty({
        ...values,
        openGraph: { ...values.openGraph, images: uploadedImage?.data },
        twitter: { ...values.twitter, images: uploadedImageTwitter?.data }
      });

      // Hero fields — sent explicitly (even when empty) so that clearing them
      // in edit mode actually persists. removeEmpty() would otherwise drop the
      // empty strings and the old value would stick around.
      body.heroTitle = (values?.heroTitle ?? '').trim();
      body.heroSubtitle = (values?.heroSubtitle ?? '').trim();
      // Hero image — new upload wins; otherwise keep whatever URL is in the
      // form (already-saved image or '' if the user cleared it).
      body.heroImage = (uploadedHeroImage?.data ?? values?.heroImage ?? '').trim();

      // FAQs — drop blank rows, send the array explicitly so removing every FAQ
      // also persists. removeEmpty() turns arrays into objects, hence the override.
      body.faqs = (Array.isArray(values?.faqs) ? values.faqs : [])
        .map((faq: any) => ({
          question: (faq?.question ?? '').trim(),
          answer: (faq?.answer ?? '').trim()
        }))
        .filter((faq: any) => faq.question && faq.answer);

      // Keywords live inside slugMetaData — re-attach so an emptied value clears.
      if (body.slugMetaData) body.slugMetaData.keywords = (values?.slugMetaData?.keywords ?? '').trim();

      // Author — sent explicitly. Empty selection => null so un-assigning an
      // author in edit mode actually persists (removeEmpty would drop '').
      body.author = values?.author ? values.author : null;

      if (values?.slugJsonSchema) body.slugJsonSchema = JSON.stringify(JSON.parse(values?.slugJsonSchema));

      if (state?._id) {
        res = await slugApiProvider.updateSlug(body, state?._id);
      } else res = await new SlugApiProvider().createSlug(body);
      if (res.data) {
        setSnack(new Snack({ open: true, color: 'success', message: 'Seo Added Successfully' }));
      }
    } catch (error) {
      console.error('Error in creatin slug', error);
      setSnack(
        new Snack({ open: true, color: 'error', message: (error as ErrorResponseSchema)?.error?.message ?? 'Something Went Wrong!' })
      );
    }
  }

  async function loadConfig() {
    const res = await getConfigDetails().catch((err) => {
      console.error('Err in getting config data==>', err);
      return undefined;
    });
    if (res?.data) {
      setConfig(res.data);
      return res.data;
    }
  }
};

export default AddSlug;
