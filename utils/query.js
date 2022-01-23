const { Stage, ArtisanComplete, CustomerComplete } = require("../models");

class MyQuery {
  currentStage = async (id) => {
    try {
      return await Stage.findOne({ where: { user_id: id } });
    } catch (error) {
      console.log(error);
    }
  };

  getExistCustomer = async (id) => {
    try {
      return await CustomerComplete.findOne({ where: { user_id: id } });
    } catch (error) {
      console.log(error);
    }
  };

  getExistArtisan = async (id) => {
    try {
      return await ArtisanComplete.findOne({ where: { user_id: id } });
    } catch (error) {
      console.log(error);
    }
  };

  saveCustomerRequest = async (data) => {
    try {
      await CustomerComplete.create(data);
    } catch (error) {
      console.log(error);
    }
  };

  createArtisan = async (data) => {
    try {
      await ArtisanComplete.create(data);
    } catch (error) {
      console.log(error);
    }
  };

  create = async (data) => {
    try {
      await Stage.create(data);
    } catch (error) {
      console.log(error);
    }
  };

  update = async (data, id) => {
    try {
      await Stage.update(data, id);
    } catch (error) {
      console.log(error);
    }
  };

  destroy = async (data) => {
    try {
      await Stage.destroy(data);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new MyQuery();
