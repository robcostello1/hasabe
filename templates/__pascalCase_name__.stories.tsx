import React from 'react';

import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {{pascalCase name}} from './{{pascalCase name}}';

export default {
  title: "{{pascalCase name}}",
  component: {{pascalCase name}},
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof {{pascalCase name}}>;

const Template: ComponentStory<typeof {{pascalCase name}}> = (args) => {
  return (
    <Canvas
      camera={
        {
          position: [3, 4, 5],
        }
      }
    >
      <Stats />

      <OrbitControls />

      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 3, 5]} />

      <{{pascalCase name}} {...args} />
    </Canvas>
  );
};

export const Default = Template.bind({});

Default.args = {
};