// src/theme/index.ts

export type Theme = {
  bg: string;
  text: string;
  card: string;
  primary: string;
  danger: string;
  success: string;
};

export const lightTheme: Theme = {
  bg: '#f4f4f4',
  text: '#222',
  card: '#fff',
  primary: '#0077cc',
  danger: '#B00020',
  success: '#2d6a4f',
};

export const darkTheme: Theme = {
  bg: '#121212',
  text: '#e0e0e0',
  card: '#1f1f1f',
  primary: '#4da3ff',
  danger: '#cf6679',
  success: '#52b788',
};
