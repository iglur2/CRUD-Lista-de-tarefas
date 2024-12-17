const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Tarefas = require('./models/tarefas')(connection, require('sequelize').DataTypes);
const Objetivos = require('./models/objetivos')(connection, require('sequelize').DataTypes);

// Configurando relacionamentos
require('./database/relationships')(connection);


(async () => {
    await connection.sync(); // Cria as tabelas se não existirem
    console.log('Banco sincronizado!');
  })();
  
connection
  .authenticate()
  .then(() => {
      console.log('Conexão feita com sucesso')
  }).catch((err) => {
      console.log(err);
  })

app.set('view engine', 'ejs');
app.use(express.static('public'));

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Tarefas.findAll({
    order: [
        ['objetivoId', 'DESC']
    ],
}).then((tarefas) => {
    Objetivos.findAll().then(objetivos => {
        res.render('index', {
          tarefas: tarefas,
          objetivos: objetivos
        });
    });
}).catch((err) => {
    console.log(err);
});
});

app.get('/create', (req, res) => (
    res.render('createObj')
));

app.post('/create', async (req, res) => {
  const { objective, descObj, tasks } = req.body;
  console.log('Dados recebidos:', req.body);


  try {
    // Criar o objetivo
    const newObjective= await Objetivos.create({
      titulo: objective,
      descricao: descObj,
    });
    console.log('Novo Objetivo Criado:', newObjective);

    // Criar as tarefas associadas ao objetivo
    if (tasks && Array.isArray(tasks)) {
      const tarefas = tasks.map((task) => ({
        titulo: task,
        objetivoId: newObjective.id,
      }));
      await Tarefas.bulkCreate(tarefas);
    }

    res.status(201).redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/');
  }
});

app.get("/add/:id", (req, res) => {
  res.render("createTask"
    , {
      id: req.params.id
      }
  );
});

app.post('/add', async (req, res) => {
  const { tasks } = req.body;
  const id = req.body.objId;
  console.log('id:', id)

  if (Array.isArray(tasks)) {
    const tarefas = tasks.map((task) => ({
      titulo: task,
      objetivoId: id,
    }));

    await Tarefas.bulkCreate(tarefas);
    res.status(201).redirect('/');
  } else {
    res.status(400).redirect('/');
  }
});


app.get("/delete/task/:id", (req, res) => {
  const id = req.params.id;
  Tarefas.destroy({ where: { id: id } }).then(() => {
    res.status(200).redirect('/')
    }).catch((err) => {
      console.log(err);
      res.status(500).send("Erro ao deletar o objetivo!");
      });
});

app.get('/delete/objective/:id', (req, res) => {
  const id = req.params.id;
  Objetivos.destroy({ where: { id: id } }).then(() => {
    res.status(200).redirect('/')
    }).catch((err) => {
      console.log(err);
      res.status(500).send("Erro ao deletar o objetivo!");
      });
})

app.get("/complete/:id", (req, res) => {
  const id = req.params.id;

  Tarefas.findOne({ where: { id: id } })
    .then(tarefa => {
      if (!tarefa) {
        return res.status(404).send("Tarefa não encontrada!");
      }
      const novoStatus = !tarefa.status;
      return Tarefas.update({ status: novoStatus }, { where: { id: id } });
    })
    .then(result => {
      console.log("Linhas afetadas:", result);
      res.status(200).redirect('/');
    })
    .catch((err) => {
      console.error("Erro:", err);
      res.status(500).send("Erro ao completar o objetivo!");
    });
});

app.listen(4000,
    () => {
    console.log('Servidor rodando na porta 4000');
});