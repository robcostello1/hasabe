import { Autocomplete, TextField, TextFieldProps } from "@mui/material";

import { Tag } from "../../../utils/types";

type TagSelectorFieldProps = {
  tags: Tag[];
  value: string | null;
  onChange: (value: string | null) => void;
  TextFieldProps?: { variant: TextFieldProps["variant"] };
};

const TagSelectorField = ({ tags, value, onChange }: TagSelectorFieldProps) => (
  <Autocomplete
    value={value}
    onChange={(_, value) => onChange(value)}
    options={tags.map(({ id }) => id) || []}
    getOptionLabel={(optionId) =>
      tags.find(({ id }) => id === optionId)?.name || ""
    }
    // TODO: add new tags
    // onInputChange={(_, value) => {
    //   console.log("new tag", value);
    // }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Tags"
        InputProps={{
          ...params.InputProps,
          type: "search",
        }}
      />
    )}
  />
);

export default TagSelectorField;
