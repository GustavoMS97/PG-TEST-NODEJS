module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    district: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty district is not allowed.' },
      },
    },
    street: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty street is not allowed.' },
      },
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty state is not allowed.' },
      },
    },
    client_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });
  return Address;
};
