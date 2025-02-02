export const parseRelevanceScores = (strArray: string) => {
  return JSON.parse(strArray.replace('{', '[').replace('}', ']')).map((item: any) => parseFloat(item))
}

export const parseStringArray = (strArray: string) => {
  return JSON.parse(strArray.replace('{', '[').replace('}', ']'))
}

export const getRelevanceColor = (value: number, min = -1, max = 1) => {
  value = Math.max(min, Math.min(max, value));
  const normalized = (value - min) / (max - min) * 2 - 1;
  let red, green, blue;
  if (normalized > 0) {
    // Positive relevance
    red = 120 + Math.round(120 * normalized);
    green = 120 - Math.round(50 * normalized);
    blue = 120 - Math.round(10 * normalized);
  } else {
    // Negative relevance
    red = 120 + Math.round(100 * normalized);
    green = 120 + Math.round(10 * normalized);
    blue = 120 - Math.round(120 * normalized);
  }
  return `rgb(${red}, ${green}, ${blue})`;
}
