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

// Supondo que isso está no mesmo app com Express + fs + JSON local
import express from "express";
import { promises as fs } from "node:fs";

const DATABASE_URL = "./database/base_dados.json";
const app = express();

app.use(express.json());

// Rota 6 - Média de progresso do curso
app.get("/cursos/:id/media-progresso", async (req, res) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    const curso = db.cursos.find(c => c.id === req.params.id);
    if (!curso) return res.status(404).json({ mensagem: "Curso não encontrado." });
    const alunos = curso.alunos;
    const progressos = db.usuarios.filter(u => alunos.includes(u.id)).map(u => u.progresso || 0);
    const media = progressos.reduce((acc, val) => acc + val, 0) / progressos.length || 0;
    res.json({ mediaProgresso: media });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao calcular a média de progresso." });
  }
});

// Rota 7 - Média de notas dos comentários
app.get("/cursos/:id/media-nota", async (req, res) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    const curso = db.cursos.find(c => c.id === req.params.id);
    if (!curso) return res.status(404).json({ mensagem: "Curso não encontrado." });
    const comentarios = curso.comentarios || [];
    const notas = comentarios.map(c => c.nota).filter(Boolean);
    const media = notas.reduce((acc, val) => acc + val, 0) / notas.length || 0;
    res.json({ mediaNota: media });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao calcular a média de notas." });
  }
});

// Rota 8 - Duração total do curso
app.get("/cursos/:id/duracao-total", async (req, res) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    const curso = db.cursos.find(c => c.id === req.params.id);
    if (!curso) return res.status(404).json({ mensagem: "Curso não encontrado." });
    const duracaoTotal = curso.aulas.reduce((acc, aula) => acc + aula.duracao, 0);
    res.json({ duracaoTotal });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao calcular duração total." });
  }
});

// Rota 9 - Qtd de cursos por instrutor
app.get("/instrutores/:id/quantidade-cursos", async (req, res) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    const count = db.cursos.filter(c => c.instrutorId === req.params.id).length;
    res.json({ quantidadeCursos: count });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao contar cursos." });
  }
});

// Rota 10 - Certificados por curso
app.get("/certificados/por-curso", async (req, res) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    const resultado = {};
    for (const cert of db.certificados) {
      resultado[cert.cursoId] = (resultado[cert.cursoId] || 0) + 1;
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao agrupar certificados." });
  }
});

// Continuação nas próximas atualizações...

app.listen(PORT, () => {
  console.log("Servido Iniciado na porta: " + PORT);
});
