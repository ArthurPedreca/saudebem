const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Conectar-se ao banco de dados MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/saudebem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB'));

db.once('open', function () {
  console.log('Conectado ao MongoDB');
});

const produtoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    descricao: { type: String },
    lab: { type: String },
    validade: { type: Number },
    estoque: { type: String },
  });

const Produto = mongoose.model('Produto', produtoSchema);

// Configurar o Express para usar arquivos estáticos
app.use(express.static(__dirname));


app.get('/', (req, res) => {
  // Rota para a página HTML do formulárioZS
  res.sendFile(__dirname + '/index.html');
});

app.post('/cadastrarprodutoentrega', (req, res) => {
  // Rota para lidar com o envio do formulário
  let formData = '';

  req.on('data', (chunk) => {
    formData += chunk;
  });

  req.on('end', () => {
    const parsedData = new URLSearchParams(formData);

    const novoUsuario = new Produto({
        id: parsedData.get('produtoId'),
        descricao: parsedData.get('descricao'),
        lab: parsedData.get('laboratorio'),
        validade: parsedData.get('dataValidade'),
        estoque: parsedData.get('quantidadeEstoque'),
    });

    novoUsuario
      .save()
      .then(() => {
        console.log('Usuário salvo com sucesso no banco de dados.');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Usuário salvo com sucesso.');
      })
      .catch((err) => {
        console.error('Erro ao salvar o usuário:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao salvar o usuário.');
      });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}/`);
});