const State = (sequelize, DataTypes) =>
  sequelize.define(
    "state",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      state_name: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );

module.exports = State;
