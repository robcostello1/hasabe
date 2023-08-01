import { Meta, StoryFn } from "@storybook/react";

import {{pascalCase name}} from './{{pascalCase name}}';

export default {
  title: "{{pascalCase name}}",
  component: {{pascalCase name}},
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof {{pascalCase name}}>;

const Template: StoryFn<typeof {{pascalCase name}}> = (args) => {
  return <{{pascalCase name}} {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
