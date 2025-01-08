import express, { Application } from 'express';
import tasksRoutes from './routes/tasksRoutes';
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use('/', tasksRoutes);

export default app;