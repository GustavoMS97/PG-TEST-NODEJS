module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Users', {
      _id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      CEP: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      CPF: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      date_sent: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Users');
  },
};
