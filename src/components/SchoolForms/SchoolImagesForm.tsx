import { Typography } from '@mui/material';
import { CreateSchool } from 'api/school';
import ImageUploader from 'components/ImageUploader';
import { FormikErrors } from 'formik';
import { FC, Fragment } from 'react';

interface PropertyImgFormProps {
  error: any;
  images: any[];
  removeImageUrls?: string[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<CreateSchool>>;
}
const PropertyImgForm: FC<PropertyImgFormProps> = ({ error, images, setFieldValue, removeImageUrls = [] }) => {
  console.log('Error in images step=>', error);
  return (
    <Fragment>
      <ImageUploader
        selectedfile={images}
        handleChangeFiles={(newFiles: any[]) => setFieldValue('images', newFiles, false)}
        handleRemoveFIles={(url: string) => setFieldValue('removeImageUrls', [...removeImageUrls, url], false)}
      />
      {error && <Typography color="error">{error}</Typography>}
    </Fragment>
  );
};

export default PropertyImgForm;
