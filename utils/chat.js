const {
  getServices,
  getStates,
  getLga,
  getListOfArtisan,
} = require("../services");
const { productsButtons, listButtons } = require("./interactive_button");

const question_one = {
  full_name: "Kindly enter your full name",
  service: "Kindly choose the service you offer",
  state: "What state do you reside ?",
  lga: "What is your LGA?",
  address: "Enter your address",
  id_card: "Attach your ID card",
  picture: "Attach your picture",
};

const two = {
  full_name: "Kindly enter your full name",
  service: "Kindly choose the service you offer",
  address: "Enter your address",
  location: "Enter your location",
  task_description: "Describe your task(kindly make it brief)",
  artisan:
    "See attached list of verifiable artisans in your location and select one.... the artisan details goes thus",
};

// format data array to return array of objects
const formatServiceArray = (data) => {
  if (!data) throw new Error("endpoints not found");
  return data.map((entity, index) => ({
    id: `${index + 1}`,
    title: entity,
  }));
};

const formatDataArrayToString = (data) => {
  if (!data) throw new Error("endpoints not found");
  return `${data.map((entity, index) => `\n *[${entity.id}]* ${entity.name}`)}`;
};

const formatDataArrayToStringForArtisan = (data) => {
  if (!data) throw new Error("endpoints not found");
  return `${data.map((entity, index) => `\n *[${index + 1}]* ${entity.name}`)}`;
};

const formatDataArrayToStringLga = (data, returnKey) => {
  return returnKey
    ? `${data.map(
        (entity, index) => `\n *[${index + 1}]* ${entity[returnKey]}`
      )}`
    : `${data.map((entity, index) => `\n *[${index + 1}]* ${entity}`)}`;
};

const welcomeResponse = productsButtons("how do we help you today?", [
  { type: "reply", reply: { id: `${1}`, title: "Render Service (Artisan)" } },
  {
    type: "reply",
    reply: { id: `${2}`, title: "Request Service Provider(Customer)" },
  },
]);

const fullNameResponse = () => {
  const question = question_one.full_name;
  return `\nWelcome to the registration of websi. we would like to ask you some questions\n${question}`;
};

const serviceResponse = async () => {
  const question = question_one.service;
  const services = await getServices();
  return listButtons(question, formatServiceArray(services));
};

const stateResponse = async () => {
  const question = question_one.state;
  const states = await getStates();
  return `${question} \n${formatDataArrayToString(states)}`;
};

const lgaResponse = async (state_id) => {
  const question = question_one.lga;
  const { data: lga } = await getLga(state_id);
  return {
    lg: lga,
    res: `${question} \n${formatDataArrayToStringLga(lga, "name")}`,
  };
};

const artisanResponse = async () => {
  const artisans = await getListOfArtisan();
  return `${two.artisan} \n${formatDataArrayToStringForArtisan(
    artisans.data.artisans
  )}`;
};

const otherResponse = {
  address: "Enter your address",
  id_card: "Attach your ID card",
  picture: "Attach your picture",
  location: "Share your location",
  task_description: "Describe your task(kindly make it brief)",
  artisan:
    "See attached list of verifiable artisans in your location and select one.... the artisan details goes thus",
  initService: [
    "Render Service (Artisan)",
    "Request Service Provider(Customer)",
  ],
};

module.exports = {
  welcomeResponse,
  fullNameResponse,
  serviceResponse,
  stateResponse,
  lgaResponse,
  otherResponse,
  artisanResponse,
};
