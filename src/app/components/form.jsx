import { useState } from "react";
import { X } from "lucide-react";

export default function TaskForm({ form, setForm, tarefas, setTarefas }) {
  if (!form) return null;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("baixa");
  const [categoria, setCategoria] = useState("estudos");
  const [dataLimite, setDataLimite] = useState("");

  const [validacao, setValidacao] = useState(false);

  const handleSubmit = (e) => {

    e.preventDefault();

    
    const novaTarefa = {
      titulo,
      descricao,
      prioridade,
      categoria,
      dataLimite,
      status: "pendente",
    };

    if (!titulo || !descricao || !dataLimite || !prioridade || !categoria) {
    setValidacao(true);
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setTarefas((tarefasAnteriores) => [...tarefasAnteriores, novaTarefa]);

    
    setTitulo("");
    setDescricao("");
    setPrioridade("baixa");
    setCategoria("estudos");
    setDataLimite("");

    
    setValidacao(false);
    setForm(false);
    

  };

  return (
    <div className="fixed inset-0 z-50 flex  justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-700 rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nova Tarefa</h2>
          <button onClick={() => setForm(false)}>
            <X size={20} className="cursor-pointer hover:text-red-600 transition-colors" />
          </button>
        </div>

        <form className="flex flex-col gap-4 text-sm" onSubmit={handleSubmit}>
         
          <div className="flex flex-col gap-1">
            <label htmlFor="titulo" className="text-slate-300">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              type="text"
              id="titulo"
              
              placeholder="Ex: Estudar Cálculo"
              className="bg-slate-800 px-3 py-2 rounded-md outline-none placeholder:text-slate-400"
            />
          </div>

          
          <div className="flex flex-col gap-1">
            <label htmlFor="descricao" className="text-slate-300">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              
              placeholder="Detalhes da tarefa..."
              rows={3}
              className="bg-slate-800 px-3 py-2 rounded-md outline-none resize-none placeholder:text-slate-400"
            />
          </div>

          
          <div className="flex flex-col gap-1">
            <label htmlFor="prioridade" className="text-slate-300">Prioridade</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              id="prioridade"
              className="bg-slate-800  p-3 rounded-md outline-none cursor-pointer"
              
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          
          <div className="flex flex-col gap-1">
            <label htmlFor="categoria" className="text-slate-300">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              id="categoria"
              className="bg-slate-800 cursor-pointer p-3 rounded-md outline-none"
              
            >
              <option value="estudos">Estudos</option>
              <option value="pessoal">Pessoal</option>
              <option value="trabalho">Trabalho</option>
            </select>
          </div>

         
          <div className="flex flex-col gap-1">
            <label htmlFor="dataLimite" className="text-slate-300">Data Limite</label>
            <input
                type="date"
                id="dataLimite"
                value={dataLimite}
                onChange={(e) => setDataLimite(e.target.value)}
                className="bg-slate-800 cursor-pointer p-3 rounded-md outline-none"
                min={new Date().toISOString().split("T")[0]} // data mínima

            />
          </div>
          
          {validacao && (
            <p className="text-slate-300 text-sm mt-2">
              Por favor, preencha todos os campos.
            </p>
          )}
          
          <button
            type="submit"
            className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md font-medium"
          >
            Salvar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
}
