module.exports = (sequelize) => {
  const Objetivos = sequelize.models.Objetivos;
  const Tarefas = sequelize.models.Tarefas;

  Objetivos.hasMany(Tarefas, {
    foreignKey: 'objetivoId', // Chave estrangeira na tabela Tarefas
    as: 'tarefas',
  });

  Tarefas.belongsTo(Objetivos, {
    foreignKey: 'objetivoId',
    as: 'objetivo',
  });
};
