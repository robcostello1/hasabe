import { Meta, StoryFn } from '@storybook/react';

import TagSelectorField from './TagSelectorField';

export default {
  title: "Form/TagSelectorField",
  component: TagSelectorField,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof TagSelectorField>;

const Template: StoryFn<typeof TagSelectorField> = (args) => {
  return <TagSelectorField {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  availableTags: [
    { id: "1", name: "tag1" },
    { id: "2", name: "tag2" },
  ],
};
