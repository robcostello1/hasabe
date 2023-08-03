import { FormContainer } from 'react-hook-form-mui';

import { Meta, StoryFn } from '@storybook/react';

import TagSelector from './TagSelector';

export default {
  title: "Form/TagSelector",
  component: TagSelector,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof TagSelector>;

const Template: StoryFn<typeof TagSelector> = (args) => {
  return (
    <FormContainer defaultValues={{}}>
      <TagSelector {...args} />
    </FormContainer>
  );
};

export const Default = Template.bind({});

Default.args = {
  availableTags: [
    { id: "1", name: "tag1" },
    { id: "2", name: "tag2" },
  ],
};
