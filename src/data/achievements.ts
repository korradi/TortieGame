export type Achievement = {
  id: string;
  title: string;
  description: string;
  condition: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'firstPet',
    title: 'First Pet',
    description: 'Pet Tortie once.',
    condition: 'Pet once',
  },
  {
    id: 'shinyFriend',
    title: 'Shiny Friend',
    description: 'Polish the shell 20 times.',
    condition: 'Polish 20 times',
  },
  {
    id: 'heatWhisperer',
    title: 'Heat Whisperer',
    description: 'Reach 95% resonance.',
    condition: 'Reach 95 resonance',
  },
  {
    id: 'portalWhisper',
    title: 'Portal Whisper',
    description: 'Trigger the first portal hum.',
    condition: 'Maintain 100 resonance for 10s',
  },
  {
    id: 'emberChef',
    title: 'Ember Chef',
    description: 'Craft 10 Thermal Cores.',
    condition: 'Craft 10 cores',
  },
];
