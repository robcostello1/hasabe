import { Meta, StoryFn } from "@storybook/react";

import ScheduleUi from "./ScheduleUi";

export default {
  title: "ScheduleUi",
  component: ScheduleUi,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof ScheduleUi>;

const Template: StoryFn<typeof ScheduleUi> = (args) => {
  return <ScheduleUi {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  availableTags: [
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
