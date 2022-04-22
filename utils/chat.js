const {
  getServices,
  getStates,
  getLga,
  getListOfArtisan,
} = require("../services");
const {
  productsButtons,
  listButtons,
  changeNameButton,
  confirmNumberButton,
  artisanInfo,
  changeAddressButton,
  genderButton,
  productsButtons3,
} = require("./interactive_button");

const question_one = {
  full_name: "Kindly enter your *full name*",
  service: "Kindly click the button below to select the service you need",
  state: "Kindly click the button below to select your state",
  lga: "Kindly click the button below to select your local government",
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
  genders: ["male", "female"],
};

// format data array to return array of objects
const formatServiceArray = (data, returnKey) => {
  if (!data) throw new Error("endpoints not found");
  return data.map((entity, index) => ({
    id: `${index + 1}`,
    title: entity[returnKey],
  }));
};

const formatDataArrayToString = (data) => {
  if (!data) throw new Error("endpoints not found");
  return `${data.map((entity, index) => `\n *[${entity.id}]* ${entity.name}`)}`;
};

const formatDataArrayToStringForArtisan = (data) => {
  if (!data) throw new Error("endpoints not found");
  return `${data.map(
    (entity, index) => `\n *[${index + 1}]* ${entity.firstname}`
  )}`;
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

const welcomeReturningArtisanResponse = (value, name) => {
  if (value === "artisan") {
    return productsButtons3(
      `Welcome ${name}, kindly click the button below to select your service`,
      [
        {
          type: "reply",
          reply: { id: `${2}`, title: "Request Service Provider(Customer)" },
        },
      ]
    );
  } else {
    return productsButtons3(
      `Welcome ${name}, kindly click the button below to select your service`,
      [
        {
          type: "reply",
          reply: { id: `${1}`, title: "Request Service Provider(Artisan)" },
        },
        {
          type: "reply",
          reply: { id: `${2}`, title: "Request Service Provider(Customer)" },
        },
      ]
    );
  }
};

const fullNameResponse = () => {
  const question = question_one.full_name;
  return `\nWelcome to the registration of wesabi. we would like to ask you some questions\n${question}`;
};

// const serviceResponse = async () => {
//   const question = question_one.service;
//   const services = await getServices();
// return listButtons(question, formatServiceArray(services));
//   return `${question_one.artisan} \n${formatDataArrayToStringForArtisan(services)}
// };

const serviceResponse = async () => {
  const { data: services } = await getServices();
  return listButtons(
    "Please click the button below to select your service",
    formatServiceArray(services, "category")
  );
  // return `kindly enter the number correspond to your option service \n ${formatDataArrayToStringLga(
  //   services,
  //   "category"
  // )}`;
};

const stateResponse = async () => {
  const question = question_one.state;
  const { data: states } = await getStates();
  let reverseState = states.reverse();
  return listButtons(question, formatServiceArray(reverseState, "name"));
  // return `${question} \n${formatDataArrayToString(reverseState)}`;
};

const lgaResponse = async (state) => {
  const question = question_one.lga;
  const { data: lga } = await getLga(state);
  return {
    lg: lga,
    rests: listButtons(question, formatServiceArray(lga, "lga")),
    // rests: `${question} \n${formatDataArrayToStringLga(lga, "lga")}`,
  };
};

//  service, description, state, lga, address, email, phone, full_name, createdAt;

const artisanResponse = async (
  service,
  description,
  state,
  lga,
  address,
  email,
  mobile,
  full_name,
  createdAt
) => {
  const { data: artisans, id } = await getListOfArtisan(
    service,
    description,
    state,
    lga,
    address,
    email,
    mobile,
    full_name,
    createdAt
  );

  // const artisans = await saveCustomerToLive(
  //   service,
  //   description,
  //   state,
  //   lga,
  //   address,
  //   email,
  //   phone,
  //   full_name,
  //   createdAt
  // );

  if (Array.isArray(artisans) && artisans?.length > 0) {
    // return `${question_one.artisan} \n${formatDataArrayToStringForArtisan(
    //   artisans
    // )}`;

    return {
      booking_id: id,
      artisanArray: artisans,
      artisanList: `${
        question_one.artisan
      } \n${formatDataArrayToStringForArtisan(artisans)}`,
    };
  } else {
    return "no artisan available for now, we will get back to you";
  }
};

const changeNameResponse = async (artisan_name) => {
  return changeNameButton(`Hi ${artisan_name}`, [
    {
      type: "reply",
      reply: { id: `${1}`, title: "No" },
    },
    {
      type: "reply",
      reply: { id: `${2}`, title: "Yes" },
    },
  ]);
};
const registrationFormResponse = async (title, types) => {
  return productsButtons3(title, [
    {
      type: types,
      reply: { id: `${1}`, title: "start" },
    },
  ]);
};

const changeAddressResponse = async (artisan_name, address) => {
  return changeAddressButton(
    `Hi ${artisan_name}`,
    [
      {
        type: "reply",
        reply: { id: `${1}`, title: "Yes" },
      },
      {
        type: "reply",
        reply: { id: `${2}`, title: "No" },
      },
    ],
    address
  );
};

const genderResponse = async () => {
  return genderButton([
    {
      type: "reply",
      reply: { id: `${1}`, title: "male" },
    },
    {
      type: "reply",
      reply: { id: `${2}`, title: "female" },
    },
  ]);
};

// const submitEditResponse = async (artisan_name, address) => {
//   return submitEditButton(
//     `Hi ${artisan_name}`,
//     [
//       {
//         type: "reply",
//         reply: { id: `${1}`, title: "Yes" },
//       },
//       {
//         type: "reply",
//         reply: { id: `${2}`, title: "No" },
//       },
//     ],
//     address
//   );
// };

const confirmNumberResponse = async (artisan_name, artisan_phone) => {
  return confirmNumberButton(
    `Hi ${artisan_name}`,
    [
      {
        type: "reply",
        reply: { id: `${1}`, title: "confirm" },
      },
    ],
    artisan_phone
  );
};

const artisanInfoResponse = async (fname, lname, email, mobile) => {
  return artisanInfo(
    fname,
    [
      {
        type: "reply",
        reply: { id: `${1}`, title: "I'm interested" },
      },
      {
        type: "reply",
        reply: { id: `${2}`, title: "I'm not interested" },
      },
    ],
    lname,
    email,
    mobile
  );
};

// const mailingCustomer = async () => {
//   const mailchimp = require("mailchimp_transactional")(
//     "34e6214f5c8ce6a89fbf18be4c4ba860-us20"
//   );
//   const message = {
//     from_email: "babatundejoseph85@gmail.com",
//     subject: "Registration",
//     text: "Welcome to Creditclan,your have successfully registered!",
//     to: [
//       {
//         email: "enochtaiwotimothy@gmail.com",
//         type: "to",
//       },
//     ],
//   };
//   try {
//     const response = await mailchimp.messages.send({
//       message,
//     });
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };

const otherResponse = {
  address: question_one.address,
  id_card: question_one.id_card,
  picture: question_one.picture,
  location: question_one.location,
  task_description: question_one.task_description,
  artisan: question_one.artisan,
  initService: question_one.initService,
  genders: question_one.genders,
};

module.exports = {
  welcomeResponse,
  fullNameResponse,
  serviceResponse,
  stateResponse,
  lgaResponse,
  otherResponse,
  artisanResponse,
  changeNameResponse,
  confirmNumberResponse,
  artisanInfoResponse,
  changeAddressResponse,
  genderResponse,
  welcomeReturningArtisanResponse,
  registrationFormResponse,
  // submitEditResponse,
  // mailingCustomer,
};
