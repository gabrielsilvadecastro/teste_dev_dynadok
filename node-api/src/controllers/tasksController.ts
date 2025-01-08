import { Request, Response } from "express";
import axios from "axios";
import { TasksRepository } from "../repositories/tasksRepository";
import dotenv from "dotenv";

// Instância do repositório de tarefas
const tasksRepository = new TasksRepository();

// Idiomas suportados
const supportedLanguages = ["pt", "en", "es"];

// POST: Cria uma tarefa, traduz e solicita resumo ao serviço Python
export const createTask = async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;
    if (!text || !lang) {
      return res.status(400).json({ error: 'Campos "text" e "lang" são obrigatórios.' });
    }

    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    // Cria a tarefa
    const task = await tasksRepository.createTask(text, lang);

    // Solicita resumo ao serviço Python
    const pythonServiceUrl = `${process.env.PYTHON_LLM_URL}/summarize`; // URL do serviço Python
    const response = await axios.post(pythonServiceUrl, {
      text,
      lang,
    });

    const summary = response.data.summary; // Supondo que o Python retorne o resumo no campo "summary"

    // Atualiza a tarefa com o resumo
    await tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: await tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
};

// GET: Obtém uma tarefa pelo ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await tasksRepository.getTaskById(Number(id));
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    return res.json(task);
  } catch (error) {
    console.error("Erro ao obter tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao obter a tarefa." });
  }
};

// DELETE: Remove uma tarefa pelo ID
export const removeTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await tasksRepository.removeTask(Number(id));
    return res.status(200).json({ message: "Tarefa removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao remover a tarefa." });
  }
};


// GET: Lista todas as tarefas
export const listTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await tasksRepository.listTasks();
    return res.json(tasks);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao listar as tarefas." });
  }
};