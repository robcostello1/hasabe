import { Meta, StoryFn } from '@storybook/react';

import AddTask from './AddTask';

export default {
  title: "AddTask",
  component: AddTask,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof AddTask>;

const Template: StoryFn<typeof AddTask> = (args) => {
  return <AddTask {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  availableTags: [
    { id: "1", name: "tag1" },
    { id: "2", name: "tag2" },
  ],
};
