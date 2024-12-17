module.exports = (sequelize, DataTypes) => {
  const Tarefas = sequelize.define('Tarefas', {
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  });

  return Tarefas;
};
