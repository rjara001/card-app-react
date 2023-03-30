
// type CsvRow = {
//   name: string;
//   value: string;
// };

import { IWord } from "../interfaces/IWord";

// const parseCsv = (csv: string): CsvRow[] => {
//   const rows = csv.trim().split('\n');
//   return rows.map((row) => {
//     const [name, value] = row.split('\t');
//     return { name, value };
//   });
// };

// export const CsvToJson = (csv:string) => {
//  return parseCsv(csv);
// }
const parseCsvBySeparator = (rows:string, separator:string) => {
  return rows.trim().split('\n').map((row) => {
    const [name, value] = row.split(separator);
    return { Name: name, Value: value } as IWord;
  });
}

const parseCsv = (csv: string) => {
  const rows = decodeURIComponent(escape(atob(csv)));
  return parseCsvBySeparator(rows, '\t');
};

const jsonToCsv = (data: IWord[]) => {
  const rows = data.map((item) => `${item.Name}\t${item.Value}`).join('\n');
  return btoa(unescape(encodeURIComponent(rows)));
};

export {
  parseCsv
  , jsonToCsv
  , parseCsvBySeparator
}