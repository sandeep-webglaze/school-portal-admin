import { SettingOutlined } from '@ant-design/icons';
import { Alert, Box, FormControlLabel, Grid, Switch, Tab, Tabs, Typography } from '@mui/material';
import { CardComponent } from 'pages/setting';
import React, { FC, Fragment, useMemo, useState } from 'react';
import InputField from './SchoolForms/InputField';
import SeoTextField from './Seo/SeoTextField';
import SerpPreview from './Seo/SerpPreview';
import UserAvatar from './UserAvatar';

interface SeoFormProps {
  values: any;
  metaDataKey?: string;
  schemaKey?: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<any>;
  state?: any;
  selectedImgFacebook: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  selectedImgTwitter: File | null;
  setSelectedImgTwiiter: React.Dispatch<React.SetStateAction<File | null>>;
  metaDataAction?: React.ReactNode;
  schemaAction?: React.ReactNode;
}
const SeoForm: FC<SeoFormProps> = ({
  values,
  setFieldValue,
  state,
  selectedImgFacebook,
  setSelectedImage,
  selectedImgTwitter,
  setSelectedImgTwiiter,
  metaDataKey = 'slugMetaData',
  schemaKey = 'slugJsonSchema',
  metaDataAction,
  schemaAction
}) => {
  const [value, setValue] = useState(0);

  const handleChangeSwitch = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    setFieldValue(`${metaDataKey}.${e.target.name}`, e.target.checked, false);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Live SERP preview reads the same Formik values that drive the inputs.
  // Whatever the writer types updates here in real time so they can see how
  // Google will render the result before publishing.
  const previewTitle: string = values?.[metaDataKey]?.title ?? '';
  const previewDescription: string = values?.[metaDataKey]?.description ?? '';
  const previewSlug: string = values?.slug ?? '';

  // Lightweight client-side JSON-LD validator. The schema field is a plain
  // textarea, so writers used to paste malformed JSON and only discover the
  // bug after publishing. This catches it pre-save.
  const rawSchema: string = (values?.[schemaKey] ?? '') as string;
  const schemaValidation = useMemo(() => {
    if (!rawSchema || !rawSchema.trim()) {
      return { status: 'empty' as const, message: '' };
    }
    try {
      JSON.parse(rawSchema);
      return { status: 'valid' as const, message: 'Valid JSON-LD — will be embedded on the page.' };
    } catch (err) {
      return {
        status: 'invalid' as const,
        message: `Invalid JSON: ${(err as Error).message}. Fix this before saving — broken JSON-LD will be rejected by Google.`
      };
    }
  }, [rawSchema]);

  return (
    <Fragment>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <SerpPreview title={previewTitle} description={previewDescription} slug={previewSlug} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CardComponent
            title="Slug MetaData"
            subheader=""
            action={metaDataAction}
            avatar={<SettingOutlined />}
            content={
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SeoTextField
                    name={`${metaDataKey}.title`}
                    label="Meta Title"
                    recommendedMin={50}
                    recommendedMax={60}
                    tip="Front-load the primary keyword. Example: Best British Schools in Dubai 2026-27 | Education Portal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <SeoTextField
                    name={`${metaDataKey}.description`}
                    label="Meta Description"
                    multiline
                    rows={4}
                    recommendedMin={140}
                    recommendedMax={160}
                    tip="Include the primary keyword in the first 120 chars. End with a CTA or USP."
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputField
                    name={`${metaDataKey}.keywords`}
                    label="Meta Keywords"
                    fullWidth
                    multiline
                    rows={2}
                    helperText="Comma-separated keywords for this page (e.g. boarding schools in kolkata, best boarding schools in kolkata). Leave blank to auto-generate from the slug."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label="Facebook" {...a11yProps(0)} />
                      <Tab label="Twitter" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <CustomTabPanel value={value} index={0}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <SeoTextField
                          name={`${metaDataKey}.openGraph.title`}
                          label="OG Title"
                          recommendedMin={40}
                          recommendedMax={60}
                          tip="Used by Facebook, WhatsApp, LinkedIn shares. Can be more catchy than the SEO title."
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SeoTextField
                          name={`${metaDataKey}.openGraph.description`}
                          label="OG Description"
                          recommendedMin={120}
                          recommendedMax={160}
                          tip="Shown under the OG image on social shares."
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <UserAvatar
                          selectedImage={selectedImgFacebook ?? state?.slugMetaData?.openGraph.images}
                          imageChange={({ target }) => setSelectedImage(target.files?.item(0) as File)}
                        />
                        <Typography gutterBottom variant="h6" mt={1}>
                          Open Graph Image
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Recommended: 1200 × 630 px, under 1 MB, JPG or PNG.
                        </Typography>
                      </Grid>
                    </Grid>
                  </CustomTabPanel>
                </Grid>

                <Grid item xs={12}>
                  <CustomTabPanel value={value} index={1}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <SeoTextField
                          name={`${metaDataKey}.twitter.title`}
                          label="Twitter Title"
                          recommendedMin={40}
                          recommendedMax={60}
                          tip="Shown when the page is shared on X / Twitter."
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <SeoTextField
                          name={`${metaDataKey}.twitter.description`}
                          label="Twitter Description"
                          recommendedMin={120}
                          recommendedMax={200}
                          tip="Twitter allows slightly longer descriptions than Google SERPs."
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputField name={`${metaDataKey}.twitter.card`} label="Twitter Card" fullWidth />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <UserAvatar
                          selectedImage={selectedImgTwitter ?? state?.slugMetaData?.twitter.images}
                          imageChange={({ target }) => setSelectedImgTwiiter(target.files?.item(0) as File)}
                        />
                        <Typography gutterBottom variant="h6" mt={1}>
                          Twitter Image
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Recommended: 1200 × 675 px (16:9), under 1 MB.
                        </Typography>
                      </Grid>
                    </Grid>
                  </CustomTabPanel>
                </Grid>
              </Grid>
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardComponent
            title="Robots"
            subheader=""
            action={schemaAction}
            avatar={<SettingOutlined />}
            content={
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.index}
                        name="robots.index"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="Index"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.follow}
                        name="robots.follow"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="follow"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.noarchive}
                        name="robots.noarchive"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="noarchive"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.nosnippet}
                        name="robots.nosnippet"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="nosnippet"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.nocache}
                        name="robots.nocache"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="nocache"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.notranslate}
                        name="robots.notranslate"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="notranslate"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values[metaDataKey].robots.noimageindex}
                        name="robots.noimageindex"
                        onChange={(e) => handleChangeSwitch(e, setFieldValue)}
                      />
                    }
                    label="noimageindex"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <InputField name={`${metaDataKey}.robots.max-video-preview`} label="Max Video Preview" fullWidth />
                </Grid>

                <Grid item xs={12} md={4}>
                  <InputField name={`${metaDataKey}.robots.max-image-preview`} label="Max Image Preview" fullWidth />
                </Grid>

                <Grid item xs={12} md={4}>
                  <InputField name={`${metaDataKey}.robots.max-snippet`} type="number" label="Max Snippet" fullWidth />
                </Grid>
              </Grid>
            }
          />
          <CardComponent
            title="Slug Json Schema"
            subheader=""
            action={schemaAction}
            avatar={<SettingOutlined />}
            content={
              <Box>
                <InputField multiline rows={12} name={schemaKey} label="Schema" fullWidth />
                {schemaValidation.status === 'valid' && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {schemaValidation.message}
                  </Alert>
                )}
                {schemaValidation.status === 'invalid' && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {schemaValidation.message}
                  </Alert>
                )}
                {schemaValidation.status === 'empty' && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    Optional. Paste a valid JSON-LD object (e.g. FAQPage, ItemList, BreadcrumbList) to add
                    page-specific structured data. Site-wide schemas (Organization, LocalBusiness, WebSite)
                    are already injected from the Next.js layout — don&apos;t duplicate them here.
                  </Typography>
                )}
              </Box>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Fragment>{children}</Fragment>}
    </div>
  );
}

export default SeoForm;
