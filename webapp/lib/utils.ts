export const strToArray = (strArray: string) => {
  return strArray.slice(1, -1).split(',').map(item => parseFloat(item.replace('"', '')))
}
