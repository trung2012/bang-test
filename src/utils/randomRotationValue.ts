export const randomRotationValue = () => {
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  return plusOrMinus * Math.round(Math.random() * 4);
};
