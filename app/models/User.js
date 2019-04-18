module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    _id: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty id is not allowed.' },
      },
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty name is not allowed.' },
      },
    },
    file_name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Empty file_name is not allowed.' },
      },
    },
    date_sent: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
  });
  return User;
};
