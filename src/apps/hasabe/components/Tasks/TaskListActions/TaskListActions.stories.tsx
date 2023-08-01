import { Meta, StoryFn } from "@storybook/react";

import TaskListActions from './TaskListActions';

export default {
  title: "TaskListActions",
  component: TaskListActions,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof TaskListActions>;

const Template: StoryFn<typeof TaskListActions> = (args) => {
  return <TaskListActions {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
