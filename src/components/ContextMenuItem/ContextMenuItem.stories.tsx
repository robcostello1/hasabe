import { Meta, StoryFn } from "@storybook/react";

import ContextMenuItem from './ContextMenuItem';

export default {
  title: "ContextMenuItem",
  component: ContextMenuItem,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof ContextMenuItem>;

const Template: StoryFn<typeof ContextMenuItem> = (args) => {
  return <ContextMenuItem {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
