import { Meta, StoryFn } from "@storybook/react";

import TaskFilters from './TaskFilters';

export default {
  title: "TaskFilters",
  component: TaskFilters,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof TaskFilters>;

const Template: StoryFn<typeof TaskFilters> = (args) => {
  return <TaskFilters {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
