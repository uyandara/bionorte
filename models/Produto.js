const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bionorte.db',
  logging: false
});

const Produto = sequelize.define('Produto', {
  codigo: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: DataTypes.TEXT,
  categoria: {
    type: DataTypes.ENUM(
      'Bioquímica',
      'Coagulação',
      'Hematologia',
      'Demais Equipamentos',
      'Insumos e Reagentes',
      'Serviços Técnicos'
    ),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Disponível'
  }
}, {
  tableName: 'produtos',
  timestamps: true
});

module.exports = { Produto, sequelize, Op };
