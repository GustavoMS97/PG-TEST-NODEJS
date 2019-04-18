module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Address', {
      district: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      street: { allowNull: false, type: DataTypes.STRING },
      state: { allowNull: false, type: DataTypes.STRING },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Address');
  },
};
