
type CsvRow = {
  name: string;
  value: string;
};

const parseCsv = (csv: string): CsvRow[] => {
  const rows = csv.trim().split('\n');
  return rows.map((row) => {
    const [name, value] = row.split('\t');
    return { name, value };
  });
};

export const CsvToJson = (csv:string) => {
 return parseCsv(csv);
}