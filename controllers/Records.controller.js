const { ArtisanComplete, CustomerComplete, Service } = require("../models");

exports.getRecords = async (req, res) => {
  try {
    const artisans = await ArtisanComplete.findAll();
    const customer_request = await CustomerComplete.findAll();
    return res.json({ artisans, customer_request });
  } catch (error) {
    return res.status(500).json({ message: "error occur", error });
  }
};

//store service data into database
exports.savedServiceRecords = async (req, res) => {
  let services = [
    { service_name: "Carpenter" },
    { service_name: "Plumber" },
    { service_name: "AC Repairs" },
    { service_name: "Furniture" },
    { service_name: "washing machine repair" },
    { service_name: "Generator service and repair" },
    { service_name: "Electrical Service" },
    { service_name: "Satellite/dstv service" },
    { service_name: "Refrigerator repair" },
    { service_name: "Aluminium fabrication" },
    { service_name: "Metal fabrication(welding)" },
    { service_name: "Masonyry" },
    { service_name: "Gardening" },
    { service_name: "Cleaning" },
    { service_name: "Laundary services" },
    { service_name: "Fumigation" },
    { service_name: "Painting" },
    { service_name: "Tiling" },
    { service_name: "Waiter" },
    { service_name: "Driver" },
    { service_name: "Cook" },
    { service_name: "Security" },
    { service_name: "Administrative officer" },
    { service_name: "Barber" },
    { service_name: "Dispatch rider" },
  ];
  try {
    services.forEach(async (service, index) => {
      const { service_name } = service;
      const dataTOSave = { service_name };
      await Service.create(dataTOSave);
    });

    return res.json("done");
  } catch (error) {
    return res.status(500).json({ message: "error occur", error });
  }
};
