"use client"
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CircleUserRound, Search, Plus, Ellipsis, Filter } from "lucide-react";
import TaskForm from "./components/form";

export default function Home() {
  const [form, setForm] = useState(false);
  const [tarefas, setTarefas] = useState([]); 
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);
  const [busca, setBusca] = useState("");
  const date = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });


   const [filtroCategoria, setFiltroCategoria] = useState("todos");
   const [filtragem, setFiltragem] = useState("");

   const tarefasFiltradas = tarefas.filter((tarefa) => {
    const buscaMatch = tarefa.titulo.toLowerCase().includes(busca.toLowerCase());
    const filtraStatus = tarefa.status !== "concluída";
    const filtraCategoria = filtroCategoria === "todos" ? true : tarefa.categoria === filtroCategoria;
    return buscaMatch && filtraStatus && filtraCategoria;
  })
    .sort((a, b) => {
        if (filtragem === "data") {
          return new Date(b.dataLimite) - new Date(a.dataLimite); 
        }

        if (filtragem === "data-invertida") {
          return new Date(a.dataLimite) - new Date(b.dataLimite); 
        }

        if (filtragem === "prioridade") {
          const prioridadePeso = { alta: 3, média: 2, baixa: 1 };
          return prioridadePeso[b.prioridade] - prioridadePeso[a.prioridade]; 
        }

        if (filtragem === "prioridade-invertida") {
          const prioridadePeso = { alta: 3, média: 2, baixa: 1 };
          return prioridadePeso[a.prioridade] - prioridadePeso[b.prioridade];
        }

        return 0;
  });

  const handleCheck = (index) => {
    const novasTarefas = tarefas.map((tarefa, i) =>
      i === index ? { ...tarefa, status: "concluída" } : tarefa
    );

    setTarefas(novasTarefas);

    const concluidas = novasTarefas.filter((t) => t.status === "concluída");
    setTarefasConcluidas(concluidas);
  };

    const [ellipse, setEllipse] = useState(false);
    const ellipseRef = useRef(null); 

    const handleDelete = (index) => {
    
      setTarefas((prev) => prev.filter((_, i) => i !== index));
      setEllipse(false);
    
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ellipseRef.current && !ellipseRef.current.contains(event.target)) {
        setEllipse(false);
      }
    }

    if (ellipse) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ellipse]);

  return (
    <div className="p-4 w-full min-h-screen bg-slate-800 text-white">
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Olá, André</h1>
        <CircleUserRound size={28} />
      </div>

      <div className="mt-1 text-sm text-slate-300">{date}</div>

      <div className="w-full flex mt-4 rounded-md overflow-hidden border border-slate-700 bg-slate-700">
        <input type="text" placeholder="Buscar tarefa..." value={busca} onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-slate-400"/>
        <button className="bg-slate-900 px-3 flex items-center justify-center cursor-pointer hover:bg-slate-800">
          <Search size={18} />
        </button>
      </div>

      <div className="w-full flex items-center justify-between bg-slate-900 mt-5 p-4 rounded-md">
        <h2 className="text-base font-semibold">Tarefas do dia</h2>
        <span className="text-xs bg-slate-600 px-3 py-1 rounded-full">
          {tarefas.length > 0 ? `${Math.round((tarefas.filter(t => t.status === "concluída").length / tarefas.length) * 100)}%` : "0%"}
        </span>
        <button onClick={() => setForm(!form)}>
          <Plus size={20} className="cursor-pointer" />
        </button>
      </div>

      <TaskForm form={form} setForm={setForm} setTarefas={setTarefas} /> 

      <div className="flex justify-between mt-4 gap-2">
        <button className="items-center font-bold flex gap-2 border border-slate-600 cursor-pointer hover:bg-slate-700 px-4 py-2 rounded-md text-sm"
          onClick={() => setForm(!form)}>
          Adicionar Tarefa
          <Plus />
        </button>
        <div className=" items-center border border-slate-600 rounded-md px-4 py-2 font-bold flex w-2/5 text-white bg-slate-800">
          <select
            value={filtragem}
            onChange={(e) => setFiltragem(e.target.value)}
            className="bg-slate-800 w-full outline-none cursor-pointer">
            <option value="">Ordenar por...</option>
            <option value="data">Menos recentes</option>
            <option value="data-invertida">Mais recentes</option>
            <option value="prioridade">Alta prioridade </option>
            <option value="prioridade-invertida">Baixa prioridade</option>
          </select>
        </div>
        
      </div>

      <div className="mt-4 items-center border border-slate-600 rounded-md px-4 py-2 font-bold flex w-2/5 text-white bg-slate-800">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
          className="bg-slate-800 w-full outline-none cursor-pointer ">
          <option value="todos">Todos</option>
          <option value="estudos">Estudos</option>
          <option value="pessoal">Pessoal</option>
          <option value="trabalho">Trabalho</option>
        </select>
      </div>

      <h1 className="text-md mt-1 font-bold">Tarefas pendentes:</h1>
      <div>
        {tarefasFiltradas.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma tarefa pendente.</p>) : (
          tarefasFiltradas.map((tarefa, index) => (
            <div key={index} className="mt-4 p-4 bg-slate-700 rounded-md flex items-start justify-between">
              <div>
                <div
                  className={`h-2 w-10 rounded-full ${
                    tarefa.prioridade === "alta"
                      ? "bg-red-600"
                      : tarefa.prioridade === "média"
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  } mb-2`}
                ></div>
                <h3 className="font-medium text-sm">{tarefa.titulo}</h3>
                <p className="text-xs text-slate-300">{tarefa.descricao}</p>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  Categoria: {tarefa.categoria}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Data Limite:{" "}
                  {new Date(tarefa.dataLimite).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-slate-400 mt-1">
                  Status: {tarefa.status ?? "pendente"}
                </p>
                <div className="flex flex-col items-end gap-2" ref={ellipseRef}>
                  <button onClick={() => setEllipse(!ellipse)}>
                    <Ellipsis size={28} />
                  </button>
                  {ellipse && (
                    <div className="absolute bg-slate-800 p-2 rounded-md mt-2 right-16">
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleCheck(index)}
                  className="h-5 w-5 border-2 rounded-sm border-white hover:bg-green-700 cursor-pointer"
                ></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold mt-6">Tarefas Concluídas</h2>
        {tarefasConcluidas.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma tarefa concluída.</p>
        ) : (
          tarefasConcluidas.map((tarefa, index) => (
            <div key={index} className="mt-4 p-4 bg-slate-700 rounded-md flex items-start justify-between">
              <div>
                <div className={`h-2 w-10 rounded-full mb-2 ${  tarefa.prioridade === "alta"
                      ? "bg-red-600"
                      : tarefa.prioridade === "média"
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  } `}></div>
                <h3 className="font-medium text-sm line-through">{tarefa.titulo}</h3>
                <p className="text-xs text-slate-300 line-through">{tarefa.descricao}</p>
                <p className="text-xs text-slate-400 mt-1 capitalize">Categoria: {tarefa.categoria}</p>
                <p className="text-xs text-slate-400 mt-1">Data Limite:{" "}
                  {new Date(tarefa.dataLimite).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-slate-400 mt-1">Status: concluída</p>
                <button
                  onClick={() => {
                    const novasTarefas = tarefas.map((t) =>
                      t === tarefa ? { ...t, status: "pendente" } : t
                    );
                    setTarefas(novasTarefas);
                    const novasConcluidas = novasTarefas.filter(
                      (t) => t.status === "concluída"
                    );
                    setTarefasConcluidas(novasConcluidas);
                  }}
                  className="text-xs bg-slate-600 px-2 py-1 rounded hover:bg-slate-500"
                >
                  Voltar para pendente
                </button>
              </div>
            </div>
          ))
          
  )}
</div>

    </div>
  );
}
