import { ISlug, SlugApiProvider } from 'api/slug';
import InputField from 'components/SchoolForms/InputField';
import { useField } from 'formik';
import useDebounce from 'hooks/useDebounce';
import { useState } from 'react';

const SlugInputField = ({ disabled = false, initialSlug }: { disabled?: boolean; initialSlug?: string }) => {
  const [field, meta, helpers] = useField('slug');
  const [slug, setSlug] = useState<ISlug | null>(null);
  const slugApiProvider = new SlugApiProvider();

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      console.log('in Slug input field ', field.value, initialSlug);
      if (field.value !== initialSlug) {
        slugApiProvider
          .getSlugDetails(field.value)
          .then((res) => {
            setSlug(res.data as any);
          })
          .catch((err) => {
            console.log('Err in Slug Detail unque=>', err);
            setSlug(null);
          });
      }
    },
    [field.value],
    1000
  );

  console.log('slug==>', slug);
  return (
    <InputField
      disabled={disabled}
      name="slug"
      error={slug && field.value}
      helperText={slug && field.value && 'Slug Already Exsist'}
      fullWidth
      label="Slug"
    />
  );
};

export default SlugInputField;
