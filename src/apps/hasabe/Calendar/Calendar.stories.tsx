import { Meta, StoryFn } from "@storybook/react";

import Calendar from "./Calendar";

export default {
  title: "Calendar",
  component: Calendar,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof Calendar>;

const Template: StoryFn<typeof Calendar> = (args) => {
  return <Calendar {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  avaiableTags: [
    {
      id: "1",
      name: "Tag 1",
    },
    {
      id: "2",
      name: "Tag 2",
    },
  ],
};
