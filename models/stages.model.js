const Stage = (sequelize, DataTypes, Sequelize) =>
  sequelize.define("stage", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    menu: {
      type: DataTypes.STRING,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    service: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    lga: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    id_card: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.TEXT,
    },
    task_description: {
      type: DataTypes.STRING,
    },
    artisan: {
      type: DataTypes.STRING,
    },
    local_government: {
      type: DataTypes.JSON,
    },

    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    artisanIndex: {
      type: DataTypes.STRING,
    },
    editIndex: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
    },
  });

module.exports = Stage;
