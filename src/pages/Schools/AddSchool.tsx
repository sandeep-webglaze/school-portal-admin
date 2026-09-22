import { GroupOutlined, SettingFilled } from '@ant-design/icons';
import { Box, Button, Divider, Stack, Step, StepIconProps, StepLabel, Stepper, Typography, styled } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { CreateSchool, createSchool, getSchoolDetailById } from 'api/school';
import { ErrorResponseSchema } from 'api/types';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FacilitiesForm from 'components/SchoolForms/FacilitiesForm';
import SchoolDetailForm from 'components/SchoolForms/SchoolDetailForm';
import SchoolImagesForm from 'components/SchoolForms/SchoolImagesForm';
import { initialValues } from 'components/SchoolForms/initialValues';
import { validationSchema } from 'components/SchoolForms/validation';
import { Snack } from 'contexts/SnackBarContext';
import { Form, Formik, FormikProps } from 'formik';
import useSnackBarContext from 'hooks/useSnackBar';
import useUserContext from 'hooks/useUser';
import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';

const steps = ['School Details', 'School Images', 'Facilities'];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'radial-gradient(circle at -1% 57.5%, #3b6fd4 0%, #1e4fa3 90%);'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'radial-gradient(circle at -1% 57.5%, #3b6fd4 0%, #1e4fa3 90%);'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}));

function _renderStepContent(step: number, formik: FormikProps<CreateSchool>) {
  switch (step) {
    case 0:
      return <SchoolDetailForm formik={formik} />;
    case 1:
      return <SchoolImagesForm error={formik.errors.images} images={formik.values.images} setFieldValue={formik.setFieldValue} />;
    case 2:
      return <FacilitiesForm values={formik.values.facilities} setFieldValue={formik.setFieldValue} error={formik.errors.facilities} />;
    default:
      return <div>Not Found</div>;
  }
}

const AddSchool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentValidationSchema, setCurrValidationSchema] = useState(validationSchema[currentStep]);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { setSnack } = useSnackBarContext();
  const { state } = useLocation();
  const [initalSchoolValues, setInitialSchoolValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const isLastStep = currentStep === steps.length - 1;

  const handleStepChange = () => {
    setCurrentStep((curr) => curr + 1);
  };

  const handleStepBack = () => {
    setCurrentStep((curr) => curr - 1);
  };

  useEffect(() => {
    if (state?._id) {
      setLoading(true);
      getSchoolDetailById(state?._id)
        .then((res) => {
          if (res.data) {
            const { city, classification, schoolBoards, type, slug, facilities, ...rest } = res.data;
            setInitialSchoolValues({
              ...rest,
              city: city._id,
              classification: classification._id,
              schoolBoards: schoolBoards.map((board) => board._id),
              type: type?.map((type) => type._id) ?? [],
              slug: slug.slug,
              prevSlug: slug.slug,
              facilities: facilities.map((facility) => facility._id)
            } as any);
          }
        })
        .catch((err) => console.error('Err in School m Detail=>', err))
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <Loader />;
  else
    return (
      <Fragment>
        <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
          <Typography variant="h3">{(initalSchoolValues as any)?._id ? 'Edit School' : 'Add School'}</Typography>
          {(initalSchoolValues as any)?._id && (
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.EDIT_SEO, { state: { slug: (initalSchoolValues as any).prevSlug, from: 'School' } })}
            >
              Seo Settings
            </Button>
          )}
        </Stack>
        <MainCard content={true}>
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Stepper alternativeLabel activeStep={currentStep} connector={<ColorlibConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
          <Formik
            initialValues={initalSchoolValues}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={_handleSubmit}
            validationSchema={currentValidationSchema}
          >
            {(formik) => (
              <Form>
                {_renderStepContent(currentStep, formik)}
                <Divider />
                <Box my={1}>
                  <Button variant="outlined" disabled={currentStep === 0} onClick={handleStepBack}>
                    Previous
                  </Button>
                  <Button variant="contained" type="submit" sx={{ float: 'right' }}>
                    {isLastStep ? 'Submit School' : 'Next'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </MainCard>
      </Fragment>
    );

  function _handleSubmit(values: CreateSchool, actions: any) {
    if (isLastStep) {
      _submitForm(values);
      console.log('vaqlues==>', values);
    } else {
      handleStepChange();
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _submitForm(values: CreateSchool) {
    createSchool(values, state?._id)
      .then((res) => {
        setSnack(new Snack({ message: 'School Listed Successfully', color: 'success', open: true }));
        navigate(ROUTES.SCHOOL.SCHOOL_LIST);
      })
      .catch((err: ErrorResponseSchema) => {
        console.error('err in listing School', err);
        setSnack(new Snack({ message: err?.error?.message ?? 'Serrver Error', color: 'error', open: true }));
      });
  }
};

export default AddSchool;

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'radial-gradient(circle at -1% 57.5%, #3b6fd4 0%, #1e4fa3 90%);',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(ownerState.completed && {
    backgroundImage: 'radial-gradient(circle at -1% 57.5%, #3b6fd4 0%, #1e4fa3 90%);'
  })
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingFilled />,
    2: <GroupOutlined />,
    3: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="15" height="15">
        <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
      </svg>
    ),
    4: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="15" height="15">
        <path d="M18.998 1C19.5503 1 19.998 1.44772 19.998 2V22C19.998 22.5523 19.5503 23 18.998 23H4.99805C4.44576 23 3.99805 22.5523 3.99805 22V2C3.99805 1.44772 4.44576 1 4.99805 1H18.998ZM17.998 12H5.99805V21H17.998V12ZM9.99805 14V18H7.99805V14H9.99805ZM17.998 3H5.99805V10H17.998V3ZM9.99805 5V8H7.99805V5H9.99805Z"></path>
      </svg>
    )
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
