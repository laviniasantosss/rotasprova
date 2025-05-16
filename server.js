import express from "express";
import cors from "cors";
import { promises as fs } from "node:fs";

const PORT = 3333;
const DATABASE_URL = "./database/base_dados.json";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());

//# 🧠 Consultas e Filtragens
app.get("/instrutores", async (request, response) => {
    try {
        const data = await fs.readFile(DATABASE_URL, "utf-8");
        const db = JSON.parse(data);
        const instrutores = db.usuarios.filter(user => user.tipo === "instrutor");
        response.status(200).json(instrutores);
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "Erro ao buscar instrutores." });
    }
});


app.get("/cursos/com-muitos-comentarios-min=3", async (request, response) => {
    try {
        const data = await fs.readFile(DATABASE_URL, "utf-8");
        const db = JSON.parse(data);
        const cursos = db.cursos.filter(curso => curso.comentarios.length > 3);
        response.status(200).json(cursos);
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "Erro ao buscar cursos." });
    }
})
app.get("/usuarios/:id/cursos", async (request, response) => {
    const { id } = request.params;
    try {
        const data = await fs.readFile(DATABASE_URL, "utf-8");
        const db = JSON.parse(data);
        const usuario = db.usuarios.find(user => user.id === id);
        if (!usuario) {
            return response.status(404).json({ mensagem: "Usuário não encontrado." });
        }
        const cursos = db.cursos.filter(curso => curso.alunos.includes(id));
        response.status(200).json(cursos);
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "Erro ao buscar cursos do usuário." });
    }
})
app.get("/usuarios/com-progresso-acima-min=80", async (request, response) => {
    try {
        const data = await fs.readFile(DATABASE_URL, "utf-8");
        const db = JSON.parse(data);
        const usuarios = db.usuarios.filter(user => user.progresso > 80);
        response.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "Erro ao buscar usuários." });
    }
})
app.get("/usuarios/:id/comentarios", async (request, response) => {
    const { id } = request.params;
    try {
        const data = await fs.readFile(DATABASE_URL, "utf-8");
        const db = JSON.parse(data);
        const usuario = db.usuarios.find(user => user.id === id);
        if (!usuario) {
            return response.status(404).json({ mensagem: "Usuário não encontrado." });
        }
        const comentarios = db.comentarios.filter(comentario => comentario.usuarioId === id);
        response.status(200).json(comentarios);
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "Erro ao buscar comentários do usuário." });
    }
})


app.listen(PORT, () => {
  console.log("Servido Iniciado na porta: " + PORT);
});
