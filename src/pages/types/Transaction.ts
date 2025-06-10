export interface ITransaction {
  _id?: string;
  title: string;
  value: number;
  category: "Receita" | "Despesa";
  dateTime?: string;
}
