import { Meta, StoryFn } from "@storybook/react";

import UserActions from './UserActions';

export default {
  title: "UserActions",
  component: UserActions,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof UserActions>;

const Template: StoryFn<typeof UserActions> = (args) => {
  return <UserActions {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
