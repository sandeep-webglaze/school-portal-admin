import { Container } from '@mui/material';
import { CreateSchool, FacilityApiProvider, IFacility } from 'api/school';
import SelectableChips from 'components/SelectableChips';
import { FormikErrors } from 'formik';
import { FC, useEffect, useState } from 'react';

interface FacilitiesFormProps {
  error: any;
  values: any[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<CreateSchool>>;
}
const FacilitiesForm: FC<FacilitiesFormProps> = ({ values, error, setFieldValue }) => {
  const facilityProvider = new FacilityApiProvider();
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  useEffect(() => {
    facilityProvider
      .getFacilityList()
      .then((res) => {
        if (res.data) setFacilities(res.data);
      })
      .catch((err) => console.error('err in facility=>', err));
  }, []);
  return (
    <Container>
      <SelectableChips
        title={'Facilities'}
        chips={facilities}
        handleClick={function (selected: string | string[]): void {
          console.log('Change Facilities==>', selected);
          setFieldValue('facilities', selected, false);
        }}
        compareKey="_id"
        listKey={'name'}
        isMultiSelect
        selected={values}
      />
    </Container>
  );
};

export default FacilitiesForm;
