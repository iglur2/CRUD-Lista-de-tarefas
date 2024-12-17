module.exports = (sequelize, DataTypes) => {
    const Objetivos = sequelize.define('Objetivos', {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }
    });
  
    return Objetivos;
  };
  