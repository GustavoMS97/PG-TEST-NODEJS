module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Address', {
      district: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      street: { allowNull: false, type: DataTypes.STRING },
      state: { allowNull: false, type: DataTypes.STRING },
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
    return queryInterface.dropTable('Address');
  },
};
