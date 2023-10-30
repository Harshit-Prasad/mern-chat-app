export function getBgcolor() {
  const colors = [
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "green",
    "lime",
    "olive",
    "navy",
    "blue",
    "teal",
  ];
  const index = Math.round(Math.random() * 9);

  return colors[index];
}
