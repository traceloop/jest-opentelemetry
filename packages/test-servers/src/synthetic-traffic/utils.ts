export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const randNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
