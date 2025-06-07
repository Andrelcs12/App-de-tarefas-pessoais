"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CircleUserRound, Search, Plus, Ellipsis } from "lucide-react";
import TaskForm from "./components/form";

export default function Home() {
  const [form, setForm] = useState(false);
  const [tarefas, setTarefas] = useState([]);
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);


  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) {
      const lista = JSON.parse(tarefasSalvas);
      setTarefas(lista);
      setTarefasConcluidas(lista.filter((t) => t.status === "concluída"));
    }
  }, []);

  // Salva no localStorage sempre que as tarefas mudarem
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);


  const [busca, setBusca] = useState("");
  const date = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtragem, setFiltragem] = useState("");

  const tarefasFiltradas = tarefas
    .filter((tarefa) => {
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
        const peso = { alta: 3, média: 2, baixa: 1 };
        return peso[b.prioridade] - peso[a.prioridade];
      }
      if (filtragem === "prioridade-invertida") {
        const peso = { alta: 3, média: 2, baixa: 1 };
        return peso[a.prioridade] - peso[b.prioridade];
      }
      return 0;
    });

  const handleCheck = (index) => {
    const novas = tarefas.map((t, i) => (i === index ? { ...t, status: "concluída" } : t));
    setTarefas(novas);
    setTarefasConcluidas(novas.filter((t) => t.status === "concluída"));
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
    <div className="p-4 w-full min-h-screen bg-slate-800 text-white flex justify-center">
      <div className="w-full max-w-screen-xl">
       
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Bem-vindo ao gerenciador de tarefas</h1>
          <CircleUserRound size={28} />
        </div>
        <div className="mt-1 text-sm text-slate-300">{date}</div>

        
        <div className="w-full flex mt-4 rounded-md overflow-hidden border border-slate-700 bg-slate-700">
          <input
            type="text"
            placeholder="Buscar tarefa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-slate-400"
          />
          <button className="bg-slate-900 cursor-pointer hover:bg-slate-800 px-3 flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>

        
        <div className="w-full flex justify-between bg-slate-900 mt-5 p-4 rounded-md gap-2">
          <h2 className="text-base font-semibold w-full">Tarefas do dia</h2>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs bg-slate-600 px-3 py-1 rounded-full">
              {tarefas.length > 0
                ? `${Math.round((tarefas.filter((t) => t.status === "concluída").length / tarefas.length) * 100)}%`
                : "0%"}
            </span>
          </div>
        </div>

        
        <TaskForm form={form} setForm={setForm} tarefas={tarefas} setTarefas={setTarefas} />

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          <button className="flex justify-between cursor-pointer items-center gap-2 font-bold border border-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md text-sm"
            onClick={() => setForm(!form)}>
            Adicionar Tarefa
            <Plus />
          </button>
          <select
            value={filtragem}
            onChange={(e) => setFiltragem(e.target.value)}
            className="bg-slate-800 border border-slate-600 cursor-pointer hover:bg-slate-700 px-4 py-2 rounded-md text-sm outline-none w-full ">
            <option value="" >Ordenar por...</option>
            <option value="data">Menos recentes</option>
            <option value="data-invertida">Mais recentes</option>
            <option value="prioridade">Alta prioridade</option>
            <option value="prioridade-invertida">Baixa prioridade</option>
          </select>
        </div>

       
        <div className="mt-4">
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-slate-800 border border-slate-600 cursor-pointer hover:bg-slate-700 px-4 py-2 rounded-md text-sm outline-none w-full sm:w-2/5">
            <option value="todos">Todos</option>
            <option value="estudos">Estudos</option>
            <option value="pessoal">Pessoal</option>
            <option value="trabalho">Trabalho</option>
          </select>
        </div>

    
        <h1 className="text-md mt-6 font-bold">Tarefas pendentes:</h1>
        <div>
          {tarefasFiltradas.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma tarefa pendente.</p>
          ) : (
            tarefasFiltradas.map((tarefa, index) => (
              <div key={index} className="mt-4 p-4 bg-slate-700 rounded-md flex items-start md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className={`h-2 w-10 rounded-full mb-2 ${
                      tarefa.prioridade === "alta"
                        ? "bg-red-600"
                        : tarefa.prioridade === "média"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`} />
                  <h3 className="font-medium text-sm md:text-2xl">{tarefa.titulo}</h3>
                  <p className="text-xs text-slate-300 md:text-xl">{tarefa.descricao}</p>
                  <p className="text-xs text-slate-400 mt-1 capitalize font-semibold">Categoria: {tarefa.categoria}</p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">
                    Data Limite:{" "} 
                    {new Date(tarefa.dataLimite).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2" ref={ellipseRef}>
                  <p className="text-xs text-slate-400 mt-1 md:text-xl font-semibold">Status: {tarefa.status ?? "pendente"}</p>

                  <div className="flex gap-4 items-center">
                    {ellipse && (
                    <div className="  bg-slate-800 p-2 rounded-md mt-2 right-16  z-10 hover:bg-slate-600 ">
                      <button onClick={() => handleDelete(index)} className="text-red-500   cursor-pointer">
                        Excluir
                      </button>
                    </div>
                  )}
                  <button onClick={() => setEllipse(!ellipse)} className="cursor-pointer">
                    <Ellipsis size={24} />
                  </button>
                  </div>

                  
                  
                  <button onClick={() => handleCheck(index)} className="h-5 w-5 cursor-pointer border-2 rounded-sm border-white hover:bg-green-700"/>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold">Tarefas Concluídas</h2>
          {tarefasConcluidas.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma tarefa concluída.</p>
          ) : (
            tarefasConcluidas.map((tarefa, index) => (
              <div key={index} className="mt-4 p-4 bg-slate-700 rounded-md flex items-start md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div
                    className={`h-2 w-10 rounded-full mb-2 ${
                      tarefa.prioridade === "alta"
                        ? "bg-red-600"
                        : tarefa.prioridade === "média"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`} />
                  <h3 className="font-medium text-sm line-through md:text-xl">{tarefa.titulo}</h3>
                  <p className=" text-slate-300 line-through ">{tarefa.descricao}</p>
                  <p className=" text-slate-400 mt-1 capitalize md:text-xl text-xs font-semibold">Categoria: {tarefa.categoria}</p>
                  <p className=" text-slate-400 mt-1 md:text-xl text-xs font-semibold">
                    Data Limite:{" "}
                    {new Date(tarefa.dataLimite).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className=" text-slate-400 mt-1 font-semibold">Status: concluída</p>
                  <button
                    onClick={() => {
                      const novas = tarefas.map((t) =>
                        t === tarefa ? { ...t, status: "pendente" } : t);
                      setTarefas(novas);
                      setTarefasConcluidas(novas.filter((t) => t.status === "concluída"));
                    }} className=" bg-slate-600 font-semibold px-2 py-1 cursor-pointer text-xs md:text-xl rounded hover:bg-slate-500">
                    Voltar para pendente
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
