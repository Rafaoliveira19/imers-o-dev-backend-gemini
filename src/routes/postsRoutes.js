import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsControllers.js";
import cors from "cors"

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
  }

// **Configura o armazenamento do Multer para uploads de imagens**
// O Multer é utilizado para lidar com o upload de arquivos (neste caso, imagens).
// O objeto `storage` define como os arquivos serão armazenados no servidor.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // **Especifica o diretório para armazenar as imagens enviadas**
        // O caminho `'uploads/'` será o destino dos arquivos. 
        // **Importante:** Certifique-se de que o diretório 'uploads' exista e tenha as permissões corretas.
        cb(null, 'uploads/'); // Substitua por seu caminho de upload desejado
    },
    filename: function (req, file, cb) {
        // **Mantém o nome original do arquivo por simplicidade**
        // O nome original do arquivo será mantido. 
        // **Recomendação:** Para evitar conflitos de nomes, considere usar uma função para gerar nomes únicos, como combinar um timestamp com a extensão original.
        cb(null, file.originalname); // Considere usar uma estratégia de geração de nomes únicos para produção
    }
});

// **Configura o middleware do Multer para a rota de upload**
// Cria uma instância do Multer com a configuração de armazenamento definida acima.
// `upload.single('imagem')` indica que o Multer espera um único arquivo com o nome 'imagem' no corpo da requisição.
const upload = multer({ dest: "./uploads", storage })

const routes = (app) => {
    // **Permite que o servidor receba dados no formato JSON**
    // O middleware `express.json()` parseia o corpo das requisições que possuem o tipo de conteúdo `application/json`.
    app.use(express.json());
    app.use(cors(corsOptions))
    // **Rota para buscar todos os posts**
    // A rota GET '/posts' chamará a função `listarPosts` do controlador para retornar todos os posts.
    app.get("/posts", listarPosts);
    // **Rota para criar um post**
    // A rota POST '/posts' chamará a função `postarNovoPost` do controlador para criar um novo post.
    app.post("/posts", postarNovoPost)
    // **Rota para fazer upload de uma imagem**
    // A rota POST '/upload' chamará o middleware `upload.single('imagem')` para processar o arquivo enviado e, em seguida, a função `uploadImagem` do controlador.
    app.post("/upload", upload.single("imagem"), uploadImagem)

    app.put("/upload/:id", atualizarNovoPost )
}

export default routes;