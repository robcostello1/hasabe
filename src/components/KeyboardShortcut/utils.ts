export const getIcon = (key: "up" | "down" | string) => {
  switch (key) {
    case "up":
      return "\u2191";
    case "down":
      return "\u2193";
  }
  return key;
};
