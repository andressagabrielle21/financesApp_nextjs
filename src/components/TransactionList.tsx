'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {format} from "date-fns";


type Transaction = {
  id: string;
  title: string;
  value: number;
  category: 'Despesa' | 'Receita';
  date: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Array com transações
  // const [sum, setSum] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let sum = 0;
  transactions.forEach((item) => {
    if (item.category == "Despesa") {
      sum += item.value;
    }
  });

  // Para executar a chamada GET assim que carregar a página
  useEffect(() => { 
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:3001/transacoes');
        setTransactions(res.data);
      } catch (error) {
        setError(`Erro ao listar transações: ${error}`)
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  console.log(transactions.map(item => item.id));

  const handleDelete = async (id: string) => {
      try {
        await axios.delete(`http://localhost:3001/transacoes/${id}`);
        setTransactions(transactions.filter(item => item.id !== id))
      } catch (error) {
        setError(`Erro ao deletar transação: ${error}`);
        console.log(`http://localhost:3001/transacoes/${id}`);
      } finally {
        setLoading(false);
      }
  }

  // const editTransaction = async (id: string) => {
  //   try {
  //     await axios.put(`http://localhost:3001/transacoes/${id}`);
  //     setTransactions
  //   }
  // }

  if(loading) return <p>Carregando transações...</p>;
  if(error) return <p>{error}</p>

  return (
    <div className="rounded flex flex-col mx-6 gap-5 my-8">
      <h2 className="text-3xl font-bold flex justify-center">Transações</h2>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.value}</td>
              <td>{item.category}</td>
              {/* <td>{format(item.date, 'dd/MM/yyyy')}</td> */}
              <td>{item.date}</td>

              <td><FaRegEdit/></td>
              <td onClick={() => handleDelete(item.id)}> <MdDeleteOutline /> </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center">
        <h2 className="text-2xl">SOMA DAS TRANSAÇÕES: <span className="text-amber-500 font-bold"> R$ {sum} </span></h2>
      </div>
    </div>
  )
}