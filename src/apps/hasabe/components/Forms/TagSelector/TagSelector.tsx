import { Controller, useFormContext } from "react-hook-form-mui";

import { Tag } from "../../../utils/types";
import TagSelectorField from "./TagSelectorField";

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
          <TagSelectorField tags={tags} value={value} onChange={onChange} />
        );
      }}
    />
  );
};

export default TagSelector;
