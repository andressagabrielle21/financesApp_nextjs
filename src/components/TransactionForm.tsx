import { useState } from "react";
import axios from "axios";

interface TransactionFormProps {
  onSuccess: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [category, setCategory] = useState("Receita");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //Impede que a página recarregue ao fazer o submit da página (apertar o botão)
    setError("");
    setLoading(true);

    if (!title || !value || !category) {
      setError("Todos os campos devem ser obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3001/transacoes", {
        title, 
        value: Number(value),
        category,
      });

      setTitle("");
      setValue("");
      setCategory("Receita");
      onSuccess(); // Função para avisar ao componentes pai para atualizar os dados
    } catch(error) {
      setError(`Erro ao salvar transação: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <h2 className="text-xl bold mb-5">Nova transação</h2>

      <form onSubmit={handleSubmit} className="flex flex-col content-start">
        <div>
          <label>Título</label>

          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Salário, aluguel, internet..."
          />
        </div>

        <div>
            <label>Valor</label>
            <input 
              type="text" 
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="R$ xxxx.xx"
            />
        </div>

        <div>
          <label>Categoria</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          >
          <option value="Despesa">Saída</option>
          <option value="Receita">Entrada</option>
        </select>

        {error && <p>{error}</p>}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 rounded-lg p-2">
          {loading ? "Salvando..." : "Adicionar transação"}
        </button>
      </form>
    </div>
  );
}