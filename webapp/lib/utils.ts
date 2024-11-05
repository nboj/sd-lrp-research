export const parseRelevanceScores = (strArray: string) => {
  return strArray.slice(1, -1).split(',').map(item => parseFloat(item.replaceAll('"', '')))
}

export const parseStringArray = (strArray: string) => {
  return strArray.slice(1, -1).split(',').map(item => item.replaceAll('"', ''))
}
