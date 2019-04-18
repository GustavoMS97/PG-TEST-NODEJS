module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty name is not allowed.' },
      },
    },
    CEP: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty cep is not allowed.' },
      },
    },
    CPF: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty cpf is not allowed.' },
      },
    },
    date_sent: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
  return Client;
};
