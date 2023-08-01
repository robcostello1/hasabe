import { Meta, StoryFn } from "@storybook/react";

import TagList from "./TagList";

export default {
  title: "TagList",
  component: TagList,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof TagList>;

const Template: StoryFn<typeof TagList> = (args) => {
  return <TagList {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  active: ["1"],
  tags: [
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
