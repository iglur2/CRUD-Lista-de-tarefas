const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('tarefas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

//Teste
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco:', error);
  }
})();

module.exports = sequelize;
