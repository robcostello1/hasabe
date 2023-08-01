import { Autocomplete, TextField, TextFieldProps } from "@mui/material";

import { Tag } from "../../../utils/types";

type TagSelectorFieldProps = {
  tags: Tag[];
  value: string | null;
  size?: "small" | "medium";
  label?: string;
  onChange: (value: string | null) => void;
  TextFieldProps?: { variant: TextFieldProps["variant"] };
};

const TagSelectorField = ({
  tags,
  value,
  TextFieldProps,
  size,
  label = "Tags",
  onChange,
}: TagSelectorFieldProps) => (
  <Autocomplete
    value={value}
    onChange={(_, value) => onChange(value)}
    options={tags.map(({ id }) => id) || []}
    getOptionLabel={(optionId) =>
      tags.find(({ id }) => id === optionId)?.name || ""
    }
    clearIcon={null}
    size={size}
    // TODO: add new tags
    // onInputChange={(_, value) => {
    //   console.log("new tag", value);
    // }}
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

export default TagSelectorField;
