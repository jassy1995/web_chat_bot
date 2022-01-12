const axios = require("axios");
const instance = axios.create({
  baseURL: "https://mobile.creditclan.com/api/artisan/",
});
require("dotenv").config();
const { API_KEY } = process.env;
const config = {
  headers: { "x-api-key": API_KEY },
};
// annoying wrapper to avoid annoying data key
// const getServices = async () => (await instance.get("/services", config)).data;
// const searchUser = async (data) =>
//   (await instance.post("/phone/search", data, config)).data;

// const registerUser = async (data) =>
//   (await instance.post("/register", data, config)).data;
// const getStates = async () => (await instance.get("/states", config)).data;
// const getLgas = async (query) =>
//   (await instance.get(`/states/lgas/${query}`, config)).data;

// const sendResponse = async (message, phone) => {
//   try {
//     const json = {
//       phone: phone.replace(/^0/, "234"),
//       message: message?.payload
//         ? {
//             ...message?.payload,
//           }
//         : message,
//     };
//     let result = await axios.post(
//       "https://bnpl-chatbot-server.herokuapp.com/direct",
//       json
//     );
//     return result.data;
//   } catch (e) {
//     console.log(e?.response?.body ?? e);
//   }
// };
let service = ["Carpenter", "Plumber", "AC Repairs"];
const mystates = [
  {
    id: "1",
    name: "Abia ",
  },
  {
    id: "2",
    name: "Adamawa ",
  },
  {
    id: "3",
    name: "Akwa Ibom ",
  },
  {
    id: "4",
    name: "Anambra ",
  },
  {
    id: "5",
    name: "Bauchi ",
  },
  {
    id: "6",
    name: "Bayelsa ",
  },
  {
    id: "7",
    name: "Benue ",
  },
  {
    id: "8",
    name: "Borno ",
  },
  {
    id: "9",
    name: "Cross River ",
  },
  {
    id: "10",
    name: "Delta ",
  },
  {
    id: "11",
    name: "Ebonyi ",
  },
  {
    id: "12",
    name: "Edo ",
  },
  {
    id: "13",
    name: "Ekiti ",
  },
  {
    id: "14",
    name: "Enugu ",
  },
  {
    id: "15",
    name: "FCT",
  },
  {
    id: "16",
    name: "Gombe ",
  },
  {
    id: "17",
    name: "Imo ",
  },
  {
    id: "18",
    name: "Jigawa ",
  },
  {
    id: "19",
    name: "Kaduna ",
  },
  {
    id: "20",
    name: "Kano ",
  },
  {
    id: "21",
    name: "Katsina ",
  },
  {
    id: "22",
    name: "Kebbi ",
  },
  {
    id: "23",
    name: "Kogi ",
  },
  {
    id: "24",
    name: "Kwara ",
  },
  {
    id: "25",
    name: "Lagos ",
  },
  {
    id: "26",
    name: "Nasarawa ",
  },
  {
    id: "27",
    name: "Niger ",
  },
  {
    id: "28",
    name: "Ogun ",
  },
  {
    id: "29",
    name: "Ondo ",
  },
  {
    id: "30",
    name: "Osun ",
  },
  {
    id: "31",
    name: "Oyo ",
  },
  {
    id: "32",
    name: "Plateau ",
  },
  {
    id: "33",
    name: "Rivers ",
  },
  {
    id: "34",
    name: "Sokoto ",
  },
  {
    id: "35",
    name: "Taraba ",
  },
  {
    id: "36",
    name: "Yobe ",
  },
  {
    id: "37",
    name: "Zamfara ",
  },
];

const { Service, State } = require("../models");

const AccountDetail = async (full_name, id) => {
  return (
    await axios.post("https://wema.creditclan.com/generate/account", {
      merchant_name: full_name,
      amount: 500,
      narration: "PES 2022",
      phone: id,
    })
  ).data;
};

const confirmPayment = async (reference_id) => {
  return await axios.post(
    "https://wema.creditclan.com/api/v3/wema/verify_transaction",
    {
      transaction_reference: reference_id,
    }
  );
};

const getServices = async () => {
  return service;
};
const getStates = async () => mystates;
// const getLga = async () => await Lga.findAll();
const getLga = async (stateId) =>
  (
    await axios.get(
      `https://mobile.creditclan.com/webapi/v1/states/${stateId}/lgas`,
      config
    )
  ).data;

const getListOfArtisan = async () => {
  return await axios.post("https://kuda-mock.herokuapp.com/artisans");
};

const sendResponse = async (message, phone) => {
  try {
    const json = {
      phone: phone.replace(/^0/, "234"),
      message: message?.payload
        ? {
            ...message?.payload,
          }
        : message,
    };
    let result = await axios.post(
      "https://bnpl-chatbot-server.herokuapp.com/direct",
      json
    );
    return result.data;
  } catch (e) {
    console.log(e?.response?.body ?? e);
  }
};

module.exports = {
  getServices,
  // searchUser,
  // registerUser,
  AccountDetail,
  confirmPayment,
  getListOfArtisan,
  getStates,
  getLga,
  sendResponse,
};
