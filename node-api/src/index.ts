import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();
import app from "./app";

const PORT = process.env.PORT || 3000; 

app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`Node API rodando na porta ${PORT}`);
});
