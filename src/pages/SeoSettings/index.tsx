import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getConfigDetails, saveConfig } from 'api/config';
import { SlugApiProvider } from 'api/slug';
import { ErrorResponseSchema } from 'api/types';
import { uploadFile } from 'api/uploader';
import SeoForm from 'components/SeoForm';
import Editor from 'components/TextEditor/Editor';
import { FILE_TYPE } from 'constants/enums';
import { Snack } from 'contexts/SnackBarContext';
import { Form, Formik } from 'formik';
import { getInitialMetaData, removeEmpty } from 'helpers';
import useSnackBarContext from 'hooks/useSnackBar';
import { CardComponent } from 'pages/setting';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const SeoSettings = () => {
  const { setSnack } = useSnackBarContext();
  const [selectedImgFacebook, setSelectedImage] = useState<File | null>(null);
  const [selectedImgTwitter, setSelectedImgTwiiter] = useState<File | null>(null);
  const { state } = useLocation();
  const slugApi = new SlugApiProvider();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.slug) {
      slugApi
        .getSlugDetails(state?.slug)
        .then((res) => {
          if (res.data)
            setSlugData({
              slugMetaData: getInitialMetaData(res.data.slugMetaData as any),
              slugJsonSchema: res.data.slugJsonSchema ?? '',
              slugId: res.data._id,
              slugContent: res.data.slugContent ?? ''
            });
        })
        .catch((err) => {
          console.error(`Error in getting slug details=> ${err}`);
        });
      return;
    } else loadConfig();
  }, []);

  const [slugData, setSlugData] = useState({
    slugMetaData: getInitialMetaData(),
    slugJsonSchema: '',
    slugContent: '',
    slugId: ''
  });

  const validationSchema = Yup.object().shape({
    slugJsonSchema: Yup.string().required('Schema Is Required'),
    slugMetaData: Yup.object().shape({
      title: Yup.string().required('title Is Required'),
      description: Yup.string().required('description Is Required'),
      robots: Yup.object().shape({
        index: Yup.boolean(),
        follow: Yup.boolean(),
        noarchive: Yup.boolean(),
        nocache: Yup.boolean(),
        notranslate: Yup.boolean(),
        nosnippet: Yup.boolean(),
        noimageindex: Yup.boolean(),
        'max-video-preview': Yup.string().required('Max video Preview Is Required'),
        'max-image-preview': Yup.string().required('Max Image Preview Is Required'),
        'max-snippet': Yup.number().required('Max Snippet Is Required')
      }),
      openGraph: Yup.object().shape({
        title: Yup.string().required('title Is Required'),
        description: Yup.string().required('description Is Required')
      }),
      twitter: Yup.object().shape({
        card: Yup.string().required('Card Is Required'),
        title: Yup.string().required('title Is Required'),
        description: Yup.string().required('description Is Required')
      })
    })
  });

  const goToPreviousPath = () => {
    navigate(-1);
  };
  return (
    <Formik
      initialValues={slugData}
      validationSchema={state?.slug ? Yup.object().shape({}) : validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
      onSubmit={state?.slug ? postData : handleSave}
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
            <Typography variant="h3">{state?.slug ? `${state?.slug} Seo Settings` : 'Global Seo Settings'}</Typography>
            <Box>
              {state?.slug && (
                <Button onClick={goToPreviousPath} startIcon={<ArrowLeftOutlined />} sx={{ mx: 2 }} variant="outlined">
                  Back to {state?.from}
                </Button>
              )}
              <Button type="submit" variant="contained">
                Save Settings
              </Button>
            </Box>
          </Stack>
          <SeoForm {...{ values, setFieldValue, selectedImgFacebook, setSelectedImage, selectedImgTwitter, setSelectedImgTwiiter }} />
          <CardComponent
            title="Slug Content"
            subheader=""
            avatar={<SettingOutlined />}
            content={<Editor value={values?.slugContent} setValue={(value: string) => setFieldValue('slugContent', value, false)} />}
          />
        </Form>
      )}
    </Formik>
  );

  async function uploadImages() {
    let uploadedImage;
    let uploadedImageTwitter;
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
      return { uploadedImage, uploadedImageTwitter };
    } catch (error) {
      console.error('Error inUploading Images', error);
      return;
    }
  }

  async function postData(values: any) {
    const slugApiProvider = new SlugApiProvider();

    let res;
    try {
      const images = await uploadImages();
      const body = removeEmpty({
        ...values,
        slugMetaData: {
          ...values.slugMetaData,
          openGraph: { ...values.slugMetaData.openGraph, images: images?.uploadedImage?.data },
          twitter: { ...values.slugMetaData.twitter, images: images?.uploadedImageTwitter?.data }
        }
      });

      if (values?.slugJsonSchema) body.slugJsonSchema = JSON.stringify(JSON.parse(values?.slugJsonSchema));

      res = await slugApiProvider.updateSlug(body, slugData.slugId);
      if (res.data) {
        setSnack(new Snack({ open: true, color: 'success', message: 'Seo Updated Successfully' }));
      }
    } catch (error) {
      console.error('Error in creatin slug', error);
      setSnack(
        new Snack({ open: true, color: 'error', message: (error as ErrorResponseSchema)?.error?.message ?? 'Something Went Wrong!' })
      );
    }
  }

  async function handleSave(values: { slugMetaData: any; slugJsonSchema?: string }) {
    if (values) {
      const images = await uploadImages();
      const body = removeEmpty({
        defaultSlugMetaData: {
          ...values.slugMetaData,
          openGraph: { ...values.slugMetaData.openGraph, images: images?.uploadedImage?.data },
          twitter: { ...values.slugMetaData.twitter, images: images?.uploadedImageTwitter?.data }
        },
        defaultSlugJsonSchema: values.slugJsonSchema
      });
      console.log('body==>', body);
      saveConfig(body)
        .then((res) => {
          if (res.data) setSnack(new Snack({ message: 'Settings Changed Successfuly', color: 'success', open: true }));
        })
        .catch((err: ErrorResponseSchema) => {
          console.error('err in updating config', err);
          setSnack(new Snack({ message: err?.error?.message ?? 'Serrver Error', color: 'error', open: true }));
        });
    }
  }

  async function loadConfig() {
    const res = await getConfigDetails().catch((err) => {
      console.error('Err in getting config data==>', err);
      return undefined;
    });
    if (res?.data) {
      setSlugData({
        slugMetaData: getInitialMetaData(res.data.defaultSlugMetaData as any),
        slugJsonSchema: res.data.defaultSlugJsonSchema ?? '',
        slugId: '',
        slugContent: ''
      });
      return res.data;
    }
  }
};

export default SeoSettings;
