module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Clients', {
      _id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Clients');
  },
};
