import fs from "fs-extra";
import path from "path";

const tasksFilePath = path.join(__dirname, "../data/tasks.json");

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string;
}

export class TasksRepository {
  private async readTasks(): Promise<Task[]> {
    try {
      const data = await fs.readFile(tasksFilePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return []; 
    }
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
  }

  public async createTask(text: string, lang: string): Promise<Task> {
    const tasks = await this.readTasks();
    const newTask: Task = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1, // Gerar ID inteiro sequencial
      text,
      summary: null,
      lang,
    };
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  public async updateTask(id: number, summary: string): Promise<Task | null> {
    const tasks = await this.readTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.summary = summary;
      await this.saveTasks(tasks);
      return task;
    }
    return null;
  }

  public async getTaskById(id: number): Promise<Task | null> {
    const tasks = await this.readTasks();
    return tasks.find(t => t.id === id) || null;
  }

  public async removeTask(id: number): Promise<void> {
    const tasks = await this.readTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    await this.saveTasks(updatedTasks);
  }

  public async listTasks(): Promise<Task[]> {
    return await this.readTasks();
  }
}
