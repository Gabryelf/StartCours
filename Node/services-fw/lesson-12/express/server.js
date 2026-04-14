import express from "express";

// Импортируем роутеры
import apiRoutes from "./routes/api.js";
import pageRoutes from "./routes/pages.js";


const app = express();
const port = 3000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Подключаем роутеры
app.use("/api", apiRoutes);
app.use("/", pageRoutes);      

app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});
