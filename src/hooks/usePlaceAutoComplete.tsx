import React from 'react';

export interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
export interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
export interface PlaceType {
  place_id: string;
  description: string;
  structured_formatting: StructuredFormatting;
}

const usePlaceAutoComplete = () => {
  const [value, setValue] = React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);

  const handleClearAutoComplete = () => {
    setValue(null);
    setInputValue('');
    setOptions([]);
  };

  return { value, setValue, inputValue, setInputValue, options, setOptions, handleClearAutoComplete };
};

export default usePlaceAutoComplete;
