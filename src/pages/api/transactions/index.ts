import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/pages/lib/mongodb";
import { Transaction } from "@/pages/models/Transaction";
import { ITransaction } from "@/pages/types/Transaction";
 
// Conecta ao banco antes de processar a requisição
// Função principal que vai lidar com as requisições da rota /api/transactions
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Conecta com o BD ANTES de lidar com os dados
  await connectToDatabase();

  // Verifica se a requisição está tentando enviar dados para serem salvos
  if (req.method === "POST") {
    try {
      const { title, value, category } = req.body; // Extrai os dados enviados do corpo da requisição

      // Validação simples para checar os campos obrigatórios
      if (!title || !value || !category) {
        return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
      }

      // Criação do objeto com os dados da transação
      const newTransaction: ITransaction = {
        title,
        value,
        category,
        dateTime: new Date().toISOString(),
      };

      // Salvar o objeto no banco de dados
      const saved = await Transaction.create(newTransaction);

      return res.status(201).json(saved);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Checa se o usuário quer apenas buscar/listar dados
  if (req.method === "GET") {
    try {
      // Busca as transações DAS MAIS RECENTES PARA AS MAIS ANTIGAS
      const transactions = await Transaction.find().sort({ date: -1 });
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Erro ao buscar transação: ", error);
      return res.status(500).json({ error: "Erro ao buscar transações" });
    }
  }

  // Método não permitido
  // A aplicação APENAS entrega dados e cria novos
  return res.setHeader("Allow", ["GET", "POST"]).status(405).end(`Método ${req.method} não permitido`);
}
