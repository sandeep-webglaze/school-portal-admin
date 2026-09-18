import * as Yup from 'yup';

const validationSchema = [
  Yup.object().shape({
    name: Yup.string().required('School Name is Required'),
    chairman: Yup.string().required('Chairman is Required'),
    establishmentYear: Yup.string().required('Establishment Year is Required'),
    medium: Yup.string().required('Medium is Required'),
    classification: Yup.string().required('Classification is Required'),
    type: Yup.array().required('type is Required'),
    city: Yup.string().required('city is Required'),
    minFees: Yup.number().required('minFees is Required'),
    maxFees: Yup.number().required('maxFees is Required'),
    admissionStart: Yup.string().required('Admission Start is Required'),
    admissionEnd: Yup.string().required('Admission End is Required'),
    classFrom: Yup.string().required('Class From is Required'),
    classTo: Yup.string().required('Class To is Required'),
    contactNumber: Yup.string().required('Contact Number is Required'),
    mail: Yup.string().required('Email is Required'),
    website: Yup.string().required('Website is Required'),
    about: Yup.string().required('About is Required'),
    schoolBoards: Yup.array().required('School Boards is Required'),
    isfeatured: Yup.boolean(),
    slug: Yup.string().required('Slug is Required')
  }),
  Yup.object().shape({
    images: Yup.array().min(1, 'At least 1 image is Required').required('image is required')
  }),
  Yup.object().shape({
    facilities: Yup.array().min(1, 'At least 1 facilities is Required').required('facilities is required')
  })
];

export { validationSchema };
