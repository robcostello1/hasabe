import { useMemo, useState } from 'react';

import { Autocomplete, TextField, TextFieldProps } from '@mui/material';

import { Tag } from '../../../utils/types';

type TagSelectorFieldProps = {
  availableTags: Tag[];
  value: string | null;
  canAddTag?: boolean;
  size?: "small" | "medium";
  label?: string;
  onChange: (value: string | null) => void;
  TextFieldProps?: { variant: TextFieldProps["variant"] };
};

const TagSelectorField = ({
  availableTags,
  value,
  TextFieldProps,
  size,
  canAddTag = true,
  label = "Tags",
  onChange,
}: TagSelectorFieldProps) => {
  const [input, setInput] = useState("");

  const displayedTags = useMemo(
    () =>
      input && canAddTag
        ? [...availableTags, { id: null, name: input }]
        : availableTags,
    [availableTags, input, canAddTag]
  );

  return (
    <Autocomplete
      value={value}
      onChange={(_, value) => {
        onChange(value);
      }}
      options={displayedTags.map(({ id }) => id) || []}
      getOptionLabel={(optionId) => {
        if (canAddTag && optionId === null) {
          return `New tag: ${input}`;
        }
        return displayedTags.find(({ id }) => id === optionId)?.name || "";
      }}
      clearIcon={null}
      size={size}
      freeSolo
      // TODO: add new tags
      onInputChange={(_, value) => {
        setInput(value);
      }}
      renderOption={({ onClick, ...props }, optionId) => (
        <li
          {...props}
          onClick={
            canAddTag && optionId === null
              ? (e) => {
                  onChange(input);
                  onClick?.(e);
                }
              : onClick
          }
        >
          {
            // @ts-expect-error
            props.key
          }
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
          {...TextFieldProps}
        />
      )}
    />
  );
};

export default TagSelectorField;
