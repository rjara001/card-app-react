
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
const parseCsvBySeparator = (rows: string, separator: string) :IWord[]=> {
  return rows.trim().split('\n').map((row) => {
    const [name, value, cycles, isKnowed, reveled] = row.split(separator);
    return {
      Name: name
      , Value: value
      , Cycles: cycles === undefined ? 0 : parseInt(cycles)
      , IsKnowed: isKnowed === "1"
      , Reveled: reveled === "1"
    } as IWord;
  });
}

const parseCsv = (csv: string) : IWord[] => {
  const rows = decodeURIComponent(escape(atob(csv)));
  return parseCsvBySeparator(rows, '\t');
};


const jsonToCsvRaw = (data: IWord[]) => {
  return data.map((item) => `${item.Name}\t${item.Value}\t${item.Cycles}\t${item.IsKnowed === true ? 1 : 0}\t${item.Reveled === true ? 1 : 0}`).join('\n');
}

const jsonToCsv = (data: IWord[]) => {
  const rows = jsonToCsvRaw(data);
  return btoa(unescape(encodeURIComponent(rows)));
};

export {
  parseCsv
  , jsonToCsv
  , jsonToCsvRaw
  , parseCsvBySeparator
}