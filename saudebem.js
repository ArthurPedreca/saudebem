// Requisitando os módulos
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// Configurando o Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

// Configurando o banco de dados
mongoose.connect('mongodb://127.0.0.1:27017/saudebem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Estamos conectados ao MongoDB!');
});

// Criando a model do projeto para Produtos
const produtoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  descricao: { type: String },
  lab: { type: String },
  validade: { type: Number },
  estoque: { type: String },
});

const Produto = mongoose.model('Produto', produtoSchema);

// Criando a model do projeto para Usuários
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  senha: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Configuração dos roteamentos
// Cadastrar Produto
app.post('/cadastrarproduto', async (req, res) => {
  const { id, descricao, lab, validade, estoque } = req.body;

  // Criando uma nova instância do Produto com os dados recebidos
  const produto = new Produto({
    id,
    descricao,
    lab,
    validade,
    estoque,
  });

  try {
    // Tenta salvar o novo produto no banco de dados
    await produto.save();
    // Se bem-sucedido, envia uma resposta de status 201 (Criado)
    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    // Se houver erro, envia uma resposta de erro
    res.status(500).json({ message: 'Erro ao cadastrar produto', error: error.message });
  }
});

// Cadastrar Usuário
app.post('/cadastrarusuario', async (req, res) => {
  const { nome, senha } = req.body;

  const usuario = new Usuario({
    nome,
    senha,
  });

  try {
    // Tenta salvar o novo usuário no banco de dados
    await usuario.save();
    // Se bem-sucedido, envia uma resposta de status 201 (Criado)
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    // Se houver erro, envia uma resposta de erro
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
