'use client';

import axios from "axios";
import { useEffect, useState } from "react";

type Transaction = {
  _id: string;
  title: string;
  value: number;
  category: 'Despesa' | 'Receita';
  createdAt: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Array com transações
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Para executar a chamada GET assim que carregar a página
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/transactions');
        setTransactions(res.data);
      } catch (error) {
        setError(`Erro ao listar transações: ${error}`)
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if(loading) return <p>Carregando transações...</p>;
  if(error) return <p>{error}</p>

  return (
    <div>
      <h2>Transações</h2>

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
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.value}</td>
              <td>{item.category}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}