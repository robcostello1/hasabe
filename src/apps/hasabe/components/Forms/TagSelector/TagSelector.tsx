import { Controller, useFormContext } from "react-hook-form-mui";

import { Autocomplete, TextField } from "@mui/material";

import { Tag } from "../../../utils/types";

type TagSelectorProps = {
  tags: Tag[];
};

const TagSelector = ({ tags }: TagSelectorProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field: { onChange, value } }) => {
        return (
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
      }}
    />
  );
};

export default TagSelector;
