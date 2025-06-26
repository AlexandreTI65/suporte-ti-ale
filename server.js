const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alexandredouglastidouglas@gmail.com',
    pass: 'SUA_SENHA_DE_16_DIGITOS'
  }
});

app.post('/enviar-chamado', (req, res) => {
  const { Nome, Setor, Ramal, 'Tipo de chamado': tipoChamado, Título, Prioridade, Descrição } = req.body;

  const mailOptions = {
    from: `"Chamados T.I." <alexandredouglastidouglas@gmail.com>`,
    to: 'ti@pyramiddiamantados.com.br',
    subject: '🆕 Novo Chamado T.I. - Pyramid',
    html: `
      <h2>Novo Chamado T.I. - Pyramid</h2>
      <p><strong>Nome:</strong> ${Nome}</p>
      <p><strong>Setor:</strong> ${Setor}</p>
      <p><strong>Ramal / Telefone:</strong> ${Ramal || 'Não informado'}</p>
      <p><strong>Tipo de chamado:</strong> ${tipoChamado}</p>
      <p><strong>Título:</strong> ${Título}</p>
      <p><strong>Prioridade:</strong> ${Prioridade}</p>
      <p><strong>Descrição:</strong><br>${(Descrição || '').replace(/\n/g, '<br>')}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).json({ message: 'Erro ao enviar e-mail' });
    }
    res.json({ message: 'Chamado enviado com sucesso!' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});