export const GenerateHEXColor = () => {
  const randomColor =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  return randomColor;
};

export const colorUtils = {
  Generate: GenerateHEXColor,
};
