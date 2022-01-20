const { ArtisanComplete, CustomerComplete } = require("../models");

exports.getRecords = async (req, res) => {
  try {
    const artisans = await ArtisanComplete.findAll();
    const customer_request = await CustomerComplete.findAll();
    return res.json({ artisans, customer_request });
  } catch (error) {
    return res.status(500).json({ message: "error occur", error });
  }
};
