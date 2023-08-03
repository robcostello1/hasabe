import { Controller, useFormContext } from 'react-hook-form-mui';

import { Tag } from '../../../utils/types';
import TagSelectorField from './TagSelectorField';

type TagSelectorProps = {
  availableTags: Tag[];
};

const TagSelector = ({ availableTags }: TagSelectorProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field: { onChange, value } }) => {
        return (
          <TagSelectorField
            availableTags={availableTags}
            value={value}
            onChange={onChange}
          />
        );
      }}
    />
  );
};

export default TagSelector;
