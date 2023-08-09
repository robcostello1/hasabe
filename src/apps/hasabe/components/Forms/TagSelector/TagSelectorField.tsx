import {
  HTMLAttributes,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Autocomplete, TextField, TextFieldProps } from "@mui/material";

import { Tag } from "../../../utils/types";

type TagSelectorFieldProps = {
  availableTags: Tag[];
  value: string | null;
  canAddTag?: boolean;
  size?: "small" | "medium";
  label?: string;
  onChange: (value: string | null) => void;
  TextFieldProps?: { variant: TextFieldProps["variant"] };
};

// TODO should prevent enter while list is shown
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

  const handleChange = useCallback(
    (_: SyntheticEvent<Element, Event>, value: string | null) => {
      onChange(value);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (_: SyntheticEvent<Element, Event>, value: string) => {
      setInput(value);
    },
    []
  );

  const handleGetOptionLable = useCallback(
    (optionId: string | null) => {
      if (canAddTag && optionId === null) {
        return `New tag: ${input}`;
      }
      return displayedTags.find(({ id }) => id === optionId)?.name || "";
    },
    [canAddTag, displayedTags, input]
  );

  const handleRenderOption = useCallback(
    (
      { onClick, ...props }: HTMLAttributes<HTMLLIElement>,
      optionId: string | null
    ) => (
      <li
        {...props}
        onClick={
          canAddTag && optionId === null
            ? (e) => {
                // TODO not working
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
    ),
    [canAddTag, input, onChange]
  );

  const handleRenderInput = useCallback(
    (params: TextFieldProps) => (
      <TextField
        {...params}
        label={label}
        InputProps={{
          ...params.InputProps,
          type: "search",
        }}
        {...TextFieldProps}
      />
    ),
    [TextFieldProps, label]
  );

  const autocompleteOptions = useMemo(
    () => displayedTags.map(({ id }) => id) || [],
    [displayedTags]
  );

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      options={autocompleteOptions}
      getOptionLabel={handleGetOptionLable}
      clearIcon={null}
      size={size}
      freeSolo
      onInputChange={handleInputChange}
      renderOption={handleRenderOption}
      renderInput={handleRenderInput}
    />
  );
};

export default TagSelectorField;
