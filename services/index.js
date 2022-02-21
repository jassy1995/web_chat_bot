const axios = require("axios");
const { update } = require("../utils/query");
const instance = axios.create({
  baseURL: "https://mobile.creditclan.com/api/artisan/",
});
require("dotenv").config();
const { API_KEY } = process.env;
const config = {
  headers: { "x-api-key": API_KEY },
};

const smsCustomer = async (msg, phone) => {
  let data = {
    api_key: "TL7EaJz8XWbr6dnRQihBtdopQ1vdcv3l5ezaw0AGk9RTTt3fdn7SuNbF3UlwWm",
    channel: "generic",
    from: "Wesabi",
    sms: msg,
    type: "plain",
    to: phone,
  };
  try {
    const response = await axios.post("https://termii.com/api/sms/send", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
  // var data = JSON.stringify({
  //   api_key: "TL7EaJz8XWbr6dnRQihBtdopQ1vdcv3l5ezaw0AGk9RTTt3fdn7SuNbF3UlwWm",
  //   channel: "whatsapp",
  //   from: "Wesabi",
  //   sms: "welcome to wesabi platform",
  //   type: "plain",
  //   to: phone,
  // });

  // var config = {
  //   method: "post",
  //   url: "https://termii.com/api/sms/send",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: data,
  // };

  // axios(config)
  //   .then(function (response) {
  //     return response.data;
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
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
// let service = [
//   "Carpenter",
//   "Plumber",
//   "AC Repairs",
//   "Furniture",
//   "washing machine repair",
//   "Generator service and repair",
//   "Electrical Service",
//   "Satellite/dstv service",
//   "Refrigerator repair",
//   "Aluminium fabrication",
//   "Metal fabrication(welding)",
//   "Masonyry",
//   "Gardening",
//   "Cleaning",
//   "Laundary services",
//   "Fumigation",
//   "Painting",
//   "Tiling",
//   "Waiter",
//   "Driver",
//   "Cook",
//   "Security",
//   "Administrative officer",
//   "Barber",
//   "Dispatch rider",
//   "others",
// ];
// const mystates = [
//   {
//     id: "1",
//     name: "Abia ",
//   },
//   {
//     id: "2",
//     name: "Adamawa ",
//   },
//   {
//     id: "3",
//     name: "Akwa Ibom ",
//   },
//   {
//     id: "4",
//     name: "Anambra ",
//   },
//   {
//     id: "5",
//     name: "Bauchi ",
//   },
//   {
//     id: "6",
//     name: "Bayelsa ",
//   },
//   {
//     id: "7",
//     name: "Benue ",
//   },
//   {
//     id: "8",
//     name: "Borno ",
//   },
//   {
//     id: "9",
//     name: "Cross River ",
//   },
//   {
//     id: "10",
//     name: "Delta ",
//   },
//   {
//     id: "11",
//     name: "Ebonyi ",
//   },
//   {
//     id: "12",
//     name: "Edo ",
//   },
//   {
//     id: "13",
//     name: "Ekiti ",
//   },
//   {
//     id: "14",
//     name: "Enugu ",
//   },
//   {
//     id: "15",
//     name: "FCT",
//   },
//   {
//     id: "16",
//     name: "Gombe ",
//   },
//   {
//     id: "17",
//     name: "Imo ",
//   },
//   {
//     id: "18",
//     name: "Jigawa ",
//   },
//   {
//     id: "19",
//     name: "Kaduna ",
//   },
//   {
//     id: "20",
//     name: "Kano ",
//   },
//   {
//     id: "21",
//     name: "Katsina ",
//   },
//   {
//     id: "22",
//     name: "Kebbi ",
//   },
//   {
//     id: "23",
//     name: "Kogi ",
//   },
//   {
//     id: "24",
//     name: "Kwara ",
//   },
//   {
//     id: "25",
//     name: "Lagos ",
//   },
//   {
//     id: "26",
//     name: "Nasarawa ",
//   },
//   {
//     id: "27",
//     name: "Niger ",
//   },
//   {
//     id: "28",
//     name: "Ogun ",
//   },
//   {
//     id: "29",
//     name: "Ondo ",
//   },
//   {
//     id: "30",
//     name: "Osun ",
//   },
//   {
//     id: "31",
//     name: "Oyo ",
//   },
//   {
//     id: "32",
//     name: "Plateau ",
//   },
//   {
//     id: "33",
//     name: "Rivers ",
//   },
//   {
//     id: "34",
//     name: "Sokoto ",
//   },
//   {
//     id: "35",
//     name: "Taraba ",
//   },
//   {
//     id: "36",
//     name: "Yobe ",
//   },
//   {
//     id: "37",
//     name: "Zamfara ",
//   },
// ];

const { Service, Stage } = require("../models");

// {
//     "user":"0",
//     "category": 40,
//     "description": "Good",
//     "state": "Lagos",
//     "lga": "Amac",
//     "location": "1, Address Street, Lagos",
//     "email": "email@wesabi.com",
//     "mobile": "07033000000",
//     "lastname": "Wesabi",
//     "firstname": "Sanni",
//     "channel":"chatbot",
//     "date":"2022-02-13 09:00:00"
// }

// Send a PUT request to https://api.wesabi.com/v3/bookings/{booking_id}

// And pass the artisan id as payload:

// {
// artisan:109,
// }

const updateCustomerToLive = async (artisan_id, user_id) => {
  let data = JSON.stringify({ artisan: artisan_id });
  const findBooking = await Stage.findOne({ where: { user_id } });
  const booking_id = findBooking?.editIndex;
  let config = {
    method: "put",
    url: `https://api.wesabi.com/v3/bookings/${booking_id}`,
    headers: {
      Authorization:
        "Bearer 039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561",
      "Content-Type": "application/json",
    },
    data: data,
  };
  let response = await axios(config);
  console.log(JSON.stringify(response.data));
};

const saveArtisanToLive = (
  category,
  full_name,
  email,
  mobile,
  gender,
  birthday,
  state_name,
  address
) => {
  let data = JSON.stringify({
    category: category,
    firstname: full_name?.split(" ")[0],
    lastname: full_name?.split(" ")[1],
    email,
    mobile: mobile?.replace(/^(234)|^(\+234)/, "0"),
    gender,
    birthday,
    state: state_name,
    address,
    channel: "chatbot",
    experience: "2",
  });
  let config = {
    method: "post",
    url: "https://api.wesabi.com/v3/artisans",
    headers: {
      Authorization:
        "Bearer 039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561",
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

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

const getServices = async () =>
  // service
  (
    await axios.get(
      "https://api.wesabi.com/v3/categories?key=039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561"
    )
  ).data;

const getStates = async () =>
  (
    await axios.get(
      "https://api.wesabi.com/v3/states/country/160/?key=039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561"
    )
  ).data;
// mystates;
// const getLga = async () => await Lga.findAll();
const getLga = async (state) =>
  (
    await axios.get(
      `https://api.wesabi.com/v3/lgas/state/${state}/?key=039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561`
    )
  ).data;
// (
//   await axios.get(
//     `https://mobile.creditclan.com/webapi/v1/states/${stateId}/lgas`,
//     config
//   )
// ).data;

const getListOfArtisan = async (
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
  // return await axios.post("https://kuda-mock.herokuapp.com/artisans");
  let data = JSON.stringify({
    user: "0",
    category: service,
    description,
    state,
    lga,
    location: address,
    email,
    mobile: mobile?.replace(/^(234)|^(\+234)/, "0"),
    firstname: full_name?.split(" ")[0],
    lastname: full_name?.split(" ")[1],
    channel: "chatbot",
    date: createdAt,
  });
  let config = {
    method: "post",
    url: "https://api.wesabi.com/v3/bookings",
    headers: {
      Authorization:
        "Bearer 039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561",
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    let response = await axios(config);
    await update(
      {
        editIndex: response.data.data.id,
      },
      {
        where: {
          user_id: mobile,
        },
      }
    );
    const checker = await Stage.findOne({ where: { user_id: mobile } });
    if (JSON.parse(checker.artisanArray).length === 0) {
      await update(
        {
          artisanArray: JSON.stringify(response.data.data.artisans),
        },
        {
          where: {
            user_id: mobile,
          },
        }
      );
    }
    return response.data.data.artisans;
  } catch (error) {
    console.log(error);
  }
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
  smsCustomer,
  saveArtisanToLive,
  updateCustomerToLive,
};
