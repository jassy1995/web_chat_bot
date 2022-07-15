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

// const { Service, Stage } = require("../models");

const updateCustomerToLive = async (artisan) => {
  console.log(artisan)
  let data = JSON.stringify(artisan);

  let config = {
    method: "post",
    url: `https://wesabi.com/api/bookings/generate_request`,
    headers: {
      Authorization:
        "Bearer 039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561",
      "Content-Type": "application/json",
    },
    data: data,
  };
  let response = await axios(config);
  console.log(response.data);
};

const saveArtisanToLive = (
  category,
  full_name,
  email,
  mobile,
  gender,
  birthday,
  state_name,
  address,
  image,
  id_card
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
    image,
    id_card,
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
  try {
    return (
      await axios.post("https://wema.creditclan.com/generate/account", {
        merchant_name: full_name,
        amount: 500,
        narration: "PES 2022",
        phone: id,
      })
    ).data;
  } catch (error) {
    console.log(error);
  }
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

const getListOfArtisan = async (service) => {
  let data = JSON.stringify({
    service: service,
  });
  let config = {
    method: "post",
    url: "https://wesabi.com/api/bookings/getArtisans",
    data: data,
  };
  try {
    let response = await axios(config);

    return { data: response.data.message };
  } catch (error) {
    console.log(error?.message ? error.message : error);
  }
};
// const getListOfArtisan = async (service) => {
//   let data = JSON.stringify({
//     user: "0",
//     category: service,
//     description,
//     state,
//     lga,
//     location: address,
//     email,
//     mobile: mobile?.replace(/^(234)|^(\+234)/, "0"),
//     firstname: full_name?.split(" ")[0],
//     lastname: full_name?.split(" ")[1],
//     channel: "chatbot",
//     date: createdAt,
//   });
//   let config = {
//     method: "post",
//     url: "https://api.wesabi.com/v3/bookings",
//     headers: {
//       Authorization:
//         "Bearer 039498d32l0p98b2a9wd3d8kf124eziyz1yyv69r3489328lb4389145l561",
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };
//   try {
//     let response = await axios(config);

//     return { data: response.data.data.artisans, id: response.data.data.id };
//   } catch (error) {
//     console.log(error?.message ? error.message : error);
//   }
// };

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
    // console.log(e?.response?e.message);
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
