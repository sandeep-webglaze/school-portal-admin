import { SettingOutlined } from '@ant-design/icons';
import { Box, Button, Card, CardContent, CardHeader, Tab, Tabs, Typography } from '@mui/material';
import { IConfig, getConfigDetails, saveConfig } from 'api/config';
import { ErrorResponseSchema } from 'api/types';
import InputField from 'components/SchoolForms/InputField';
import CustomTabPanel from 'components/Tabs/TabPannel';
import Editor from 'components/TextEditor/Editor';
import { Snack } from 'contexts/SnackBarContext';
import { Form, Formik } from 'formik';
import useSnackBarContext from 'hooks/useSnackBar';
import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';

enum CATEGORIES {
  CONTACT_US = 'contactUs',
  SOCIAL_MEDIA = 'socialMedia',
  PRIVACY_POLICY = 'privacyPolicy',
  TERMS_AND_CONDITIONS = 'termsAndCondition',
  ABOUT_US = 'aboutUs'
}

export const CardComponent = ({ title, avatar, subheader, content, isDeleteButton = false, action = <></> }: any) => {
  return (
    <Card
      sx={{
        marginBottom: '40px',
        background: isDeleteButton ? '#F22A2A' : '#fff',
        color: isDeleteButton ? '#fff' : '#000'
      }}
    >
      <CardHeader sx={{ fontSize: '17px', fontWeight: 'bold' }} avatar={avatar} title={title} subheader={subheader} action={action} />
      <CardContent>{content}</CardContent>
    </Card>
  );
};

const Setting = () => {
  const [selectedImgFacebook, setSelectedImage] = useState<File | null>(null);
  const [selectedImgTwitter, setSelectedImgTwiiter] = useState<File | null>(null);
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const [config, setConfig] = useState<IConfig>();
  const initialValues = {
    contactUs: config?.contactUs ?? {
      phoneNumber: '',
      mail: '',
      address: ''
    },
    socialMedia: config?.socialMedia ?? {
      facebook: '',
      intstagram: '',
      tweeter: '',
      linkedIn: '',
      youtube: '',
      pinterest: ''
    },
    robots: config?.robots ?? '',
    privacyPolicy: config?.privacyPolicy ?? '',
    termsAndConditions: config?.termsAndConditions ?? '',
    refundPolicy: config?.refundPolicy ?? '',
    defaultSlugJsonSchema: config?.defaultSlugJsonSchema ?? '',
    defaultSlugMetaData: config?.defaultSlugMetaData ?? {
      title: '',
      description: '',
      robots: {
        index: false,
        follow: false,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
        nocache: false,
        notranslate: false,
        indexifembedded: false,
        nositelinkssearchbox: false,
        unavailable_after: '',
        'max-video-preview': '',
        'max-image-preview': '',
        'max-snippet': 0
      },
      openGraph: {
        locale: 'en_us',
        type: 'website',
        title: '',
        description: '',
        url: '',
        images: ''
      },
      twitter: {
        card: 'summary_large_image',
        title: '',
        description: '',
        site: '',
        images: ''
      }
    }
  };
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    getConfigDetails()
      .then((res) => {
        if (res.data) setConfig(res.data);
      })
      .catch((err) => console.error('Err in getting config data==>', err));
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <CardComponent
            title="General Details"
            subheader=""
            avatar={<SettingOutlined />}
            category={CATEGORIES.CONTACT_US}
            content={
              <Fragment>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: -2 }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Basic Details" />
                    <Tab label="Social Media Links" />
                  </Tabs>
                </Box>
                <CustomTabPanel index={0} value={value}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <InputField type="text" name="contactUs.phoneNumber" label="Phone Number" fullWidth />
                    <InputField type="text" name="contactUs.mail" label="Email" fullWidth />
                    <InputField type="text" name="contactUs.address" label="Address" fullWidth />
                  </Box>
                </CustomTabPanel>
                <CustomTabPanel index={1} value={value}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <InputField type="text" name="socialMedia.facebook" label="Facebook" fullWidth />
                    <InputField type="text" name="socialMedia.intstagram" label="Intstagram" fullWidth />
                    <InputField type="text" name="socialMedia.tweeter" label="Twitter" fullWidth />
                    <InputField type="text" name="socialMedia.linkedIn" label="LinkedIn" fullWidth />
                    <InputField type="text" name="socialMedia.youtube" label="Youtube" fullWidth />
                    <InputField type="text" name="socialMedia.pinterest" label="Pinterest" fullWidth />
                  </Box>
                </CustomTabPanel>
              </Fragment>
            }
          />

          <CardComponent
            title="Robots"
            subheader=""
            avatar={<SettingOutlined />}
            category={CATEGORIES.PRIVACY_POLICY}
            content={<InputField multiline rows={4} maxRows={8} name={`robots`} label="Robots" fullWidth />}
          />

          <CardComponent
            title="Privacy Policy & Terms"
            subheader=""
            avatar={<SettingOutlined />}
            category={CATEGORIES.PRIVACY_POLICY}
            content={
              <Fragment>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: -2 }}>
                  <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab label="Privacy Policy" />
                    <Tab label="Terms and Conditions" />
                    <Tab label="Refund Policy" />
                  </Tabs>
                </Box>
                <CustomTabPanel index={0} value={tabValue}>
                  <Editor value={values?.privacyPolicy} setValue={(value: string) => setFieldValue('privacyPolicy', value, false)} />
                  {errors.privacyPolicy && <Typography color="error">{errors.privacyPolicy}</Typography>}
                </CustomTabPanel>
                <CustomTabPanel index={1} value={tabValue}>
                  <Editor
                    value={values?.termsAndConditions}
                    setValue={(value: string) => setFieldValue('termsAndConditions', value, false)}
                  />
                  {errors.termsAndConditions && <Typography color="error">{errors.termsAndConditions}</Typography>}
                </CustomTabPanel>
                <CustomTabPanel index={2} value={tabValue}>
                  <Editor value={values?.refundPolicy} setValue={(value: string) => setFieldValue('refundPolicy', value, false)} />
                  {errors.refundPolicy && <Typography color="error">{errors.refundPolicy}</Typography>}
                </CustomTabPanel>
              </Fragment>
            }
          />

          {/* <SeoForm
            metaDataKey="defaultSlugMetaData"
            schemaKey="defaultSlugJsonSchema"
            {...{ values, setFieldValue, selectedImgFacebook, setSelectedImage, selectedImgTwitter, setSelectedImgTwiiter }}
          /> */}
          <Button type="submit" fullWidth variant="contained">
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );

  async function handleSave(values: IConfig) {
    if (values) {
      saveConfig(values)
        .then((res) => {
          if (res.data) setSnack(new Snack({ message: 'Settings Changed Successfuly', color: 'success', open: true }));
        })
        .catch((err: ErrorResponseSchema) => {
          console.error('err in updating config', err);
          setSnack(new Snack({ message: err?.error?.message ?? 'Serrver Error', color: 'error', open: true }));
        });
    }
  }
};

export default Setting;

const validationSchema = Yup.object().shape({
  contactUs: Yup.object().shape({
    phoneNumber: Yup.string().required('Phone Number Is Required'),
    mail: Yup.string().required('Email Is Required'),
    address: Yup.string().required('Address Is Required')
  }),
  socialMedia: Yup.object().shape({
    facebook: Yup.string().required('facebook Is Required'),
    intstagram: Yup.string().required('intstagram Is Required'),
    tweeter: Yup.string().required('twitter Is Required'),
    linkedIn: Yup.string().required('Linked In Is Required'),
    youtube: Yup.string().required('youtube Is Required')
  }),
  privacyPolicy: Yup.string().required('Privacy Policy  Is Required'),
  termsAndConditions: Yup.string().required('Terms And Conditions Is Required')
});
