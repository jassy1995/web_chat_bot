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

//store service data into database
// exports.savedServiceRecords = async (req, res) => {
//   let services = [
//     { service_name: "Carpenter" },
//     { service_name: "Plumber" },
//     { service_name: "AC Repairs" },
//     { service_name: "Furniture" },
//     { service_name: "washing machine repair" },
//     { service_name: "Generator service and repair" },
//     { service_name: "Electrical Service" },
//     { service_name: "Satellite/dstv service" },
//     { service_name: "Refrigerator repair" },
//     { service_name: "Aluminium fabrication" },
//     { service_name: "Metal fabrication(welding)" },
//     { service_name: "Masonyry" },
//     { service_name: "Gardening" },
//     { service_name: "Cleaning" },
//     { service_name: "Laundary services" },
//     { service_name: "Fumigation" },
//     { service_name: "Painting" },
//     { service_name: "Tiling" },
//     { service_name: "Waiter" },
//     { service_name: "Driver" },
//     { service_name: "Cook" },
//     { service_name: "Security" },
//     { service_name: "Administrative officer" },
//     { service_name: "Barber" },
//     { service_name: "Dispatch rider" },
//   ];
//   try {
//     let response;
//     services.forEach(async (service, index) => {
//       const { service_name } = service;
//       const dataTOSave = { service_name };
//       response = await Service.create(dataTOSave);
//     });

//     return res.json(response);
//   } catch (error) {
//     return res.status(500).json({ message: "error occur", error });
//   }
// };

const { Stage, ArtisanComplete, CustomerComplete } = require("../models");

const {
  productsButtons,
  productsButtons2,
} = require("../utils/interactive_button");
const account = require("accounting");
const {
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
  // mailingCustomer,
} = require("../utils/chat");

const {
  getServices,
  getStates,
  getLga,
  AccountDetail,
  confirmPayment,
  getListOfArtisan,
  sendResponse,
  smsCustomer,
  saveArtisanToLive,
  updateCustomerToLive,
} = require("../services");

const {
  currentStage,
  create,
  update,
  destroy,
  createArtisan,
  getExistArtisan,
  saveCustomerRequest,
  getExistCustomer,
  getAllExistCustomer,
  updateArtisan,
  getArtisanOne,
  destroyArtisan,
} = require("../utils/query");

exports.RegistrationProcess2 = async (req, res) => {
  const { payload } = req.body;
  let response;
  let num = "0";

  try {
    const stage = await currentStage(payload.user.id);
    // const { data: service } = await getServices();
    // let { data } = await getStates();
    // const states = data.reverse();
    // const artisanOne = await getArtisanOne(payload.user.id);
    // const acct_value = await AccountDetail(stage?.full_name, payload.user.id);
    // const nextV = await AccountDetail(artisanOne?.full_name, payload.user.id);
    const checkExistCustomer = await getExistCustomer(payload.user.id);
    const isArtisanExist = await getExistArtisan(payload.user.id);
    //========= START THE CHAT ===========
    if (payload.type === "text" && payload?.text?.toLowerCase() === "hi") {
      if (isArtisanExist?.full_name && !checkExistCustomer?.full_name) {
        let ex1 = await welcomeReturningArtisanResponse(
          "artisanonly",
          isArtisanExist.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex1, payload.user.id);
      } else if (!isArtisanExist?.full_name && checkExistCustomer?.full_name) {
        let ex1 = await welcomeReturningArtisanResponse(
          "customeronly",
          checkExistCustomer?.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex1, payload.user.id);
      } else if (isArtisanExist?.full_name && checkExistCustomer?.full_name) {
        let ex2 = await welcomeReturningArtisanResponse(
          "artisanandcustomer",
          checkExistCustomer?.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex2, payload.user.id);
      } else {
        let ex2 = await welcomeReturningArtisanResponse("none");
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex2, payload.user.id);
      }
    }
    //================ RESTART THE CHAT==================
    else if (payload.text?.toLowerCase() === "restart") {
      if (isArtisanExist?.full_name && !checkExistCustomer?.full_name) {
        let ex1 = await welcomeReturningArtisanResponse(
          "artisanonly",
          isArtisanExist.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex1, payload.user.id);
      } else if (!isArtisanExist?.full_name && checkExistCustomer?.full_name) {
        let ex1 = await welcomeReturningArtisanResponse(
          "customeronly",
          checkExistCustomer?.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex1, payload.user.id);
      } else if (isArtisanExist?.full_name && checkExistCustomer?.full_name) {
        let ex2 = await welcomeReturningArtisanResponse(
          "artisanandcustomer",
          checkExistCustomer?.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex2, payload.user.id);
      } else {
        let ex2 = await welcomeReturningArtisanResponse("none");
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex2, payload.user.id);
      }
    }
    //=============== START ARTISAN REGISTRATION ===============
    else if (
      (payload.type === "artisan-registration-form" ||
        payload.type === "artisan-edit-form") &&
      (stage?.step === 1 || stage?.step === 4)
    ) {
      payload.data["menu"] = "Render Service (Artisan)";
      payload.data["payment_status"] = "pending";
      payload.data["step"] = 2;
      await update(payload.data, {
        where: {
          user_id: payload.user.id,
        },
      });

      response = await sendResponse(otherResponse.id_card, payload.user.id);
    } else if (payload.type === "image" && stage?.step === 2) {
      await update(
        { id_card: payload.image, step: 3 },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );

      response = await sendResponse(otherResponse.picture, payload.user.id);
    } else if (payload.type === "image" && stage?.step === 3) {
      await update(
        { picture: payload.image, step: 4 },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );

      const summary = `Name: *${stage?.full_name}* \n Service: *${stage?.service}* \n State: *${stage?.state}* \n LGA: *${stage?.lga}* \n Address: *${stage?.address}* \n Email: *${stage?.email}* \n dateOfBirth: *${stage?.date_of_birth}*  \n`;
      const header = "Here is the summary of your registration detail";

      const button = [
        {
          type: "reply",
          reply: { id: "submit", title: "Submit" },
        },
        {
          type: "artisan-edit-form",
          reply: { id: "edit", title: "Edit" },
          data: {
            full_name: stage.full_name,
            service: stage?.service,
            state: stage?.state,
            lga: stage?.lga,
            address: stage?.address,
            email: stage?.email,
            gender: stage?.gender,
            date_of_birth: stage?.date_of_birth,
          },
        },
      ];
      let re = productsButtons({ header, summary }, button);
      response = await sendResponse(re, payload.user.id);
    } else if (payload.text?.toLowerCase() === "submit" && stage?.step === 4) {
      const toSave = {
        user_id: stage.user_id,
        full_name: stage?.full_name,
        service: stage?.service,
        state: stage?.state,
        lga: stage?.lga,
        address: stage?.address,
        email: stage?.email,
        gender: stage?.gender,
        date_of_birth: stage?.date_of_birth,
        id_card: stage?.id_card,
        picture: stage.picture,
        payment_status: stage.payment_status,
      };
      await createArtisan(toSave);
      await saveArtisanToLive(
        stage?.service,
        stage?.full_name,
        stage?.email,
        payload?.user.id,
        stage?.gender,
        stage?.date_of_birth,
        stage?.state,
        stage?.address
      );

      response = await sendResponse(
        "Congrats, your registration has been completed",
        payload.user.id
      );
    } else if (payload.type === "customer-request-form" && stage.step === 1) {
      console.log(payload.type === "customer-request-form" && stage.step === 1);
      console.log(payload.type);
      console.log(stage.step);
      payload.data["menu"] = "Request Service Provider(Customer)";
      payload.data["step"] = 3;
      await update(payload.data, {
        where: {
          user_id: payload.user.id,
        },
      });

      response = await sendResponse(otherResponse.location, payload.user.id);
    } else if (
      payload.text?.toLowerCase() === "existcustomer" &&
      stage?.step === 1
    ) {
      await update(
        { step: 2 },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );

      const dataToSend = {
        full_name: checkExistCustomer.full_name,
        service: checkExistCustomer.service,
        state: checkExistCustomer.state,
        lga: checkExistCustomer.lga,
        email: checkExistCustomer.email,
        address: checkExistCustomer.address,
        task_description: checkExistCustomer.task_description,
      };

      const summary = `Name: *${checkExistCustomer?.full_name}* \n Service: *${checkExistCustomer?.service}* \n State: *${checkExistCustomer?.state}* \n LGA: *${checkExistCustomer?.lga}* \n Address: *${checkExistCustomer?.address}* \n Email: *${checkExistCustomer?.email}* \n task_description: *${checkExistCustomer?.task_description}* \n \n`;

      const header =
        "Below is your previous application information,\n \n would you like to change it ?";
      const button = [
        {
          type: "customer-edit-form",
          reply: { id: "yes", title: "Yes" },
          data: dataToSend,
        },
        {
          type: "reply",
          reply: { id: "no", title: "No" },
        },
      ];
      let re = productsButtons({ header, summary }, button);
      response = await sendResponse(re, payload.user.id);
    } else if (payload.text?.toLowerCase() === "no" && stage.step === 2) {
      const reSave = {
        full_name: checkExistCustomer.full_name,
        service: checkExistCustomer.service,
        state: checkExistCustomer.state,
        lga: checkExistCustomer.lga,
        email: checkExistCustomer.email,
        address: checkExistCustomer.address,
        task_description: checkExistCustomer.task_description,
        step: 3,
      };
      await update(reSave, {
        where: {
          user_id: payload.user.id,
        },
      });
      response = await sendResponse(otherResponse.location, payload.user.id);
    } else if (payload.type === "customer-edit-form" && stage?.step === 2) {
      payload.data["step"] = 3;
      console.log(payload.data);
      await update(payload.data, {
        where: {
          user_id: payload.user.id,
        },
      });

      response = await sendResponse(otherResponse.location, payload.user.id);
    } else if (payload.type === "location" && stage?.step === 3) {
      let location = {
        long: payload.location.longitude,
        lat: payload.location.latitude,
      };

      await update(
        { location: JSON.stringify(location) },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );
      let { booking_id, artisanList, artisanArray } = await artisanResponse(
        stage?.service,
        stage?.task_description,
        stage?.state,
        stage?.lga,
        stage?.address,
        stage?.email,
        payload.user.id,
        stage?.full_name,
        stage?.createdAt
      );
      if (!artisanList) {
        await update(
          { step: 2 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        const header = `Sorry our service has not extended to *${stage?.state}* , kindly click the button below to change your state.`;
        const summary = "we recommend you picking Lagos state";
        const button = [
          {
            type: "customer-edit-form",
            reply: { id: "yes", title: "update your selection" },
            data: {
              full_name: stage.full_name,
              service: stage.service,
              state: stage.state,
              lga: stage.lga,
              email: stage.email,
              address: stage.address,
              task_description: stage.task_description,
            },
          },
        ];
        let re = productsButtons({ header, summary }, button);
        response = await sendResponse(re, payload.user.id);
      } else {
        await update(
          {
            artisanArray: JSON.stringify(artisanArray),
            editIndex: booking_id,
            step: 4,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        console.log(payload.user.id);
        response = await sendResponse(artisanList, payload.user.id);
      }
    } else if (
      stage?.step === 4 &&
      Number(payload.text) <= JSON.parse(stage.artisanArray)?.length
    ) {
      const getAgain = await currentStage(payload.user.id);
      await update(
        {
          artisanIndex: payload.text,
          step: 5,
        },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );
      let art = await artisanInfoResponse(
        JSON.parse(getAgain.artisanArray)[Number(payload.text) - 1].firstname,
        JSON.parse(getAgain.artisanArray)[Number(payload.text) - 1].lastname,
        JSON.parse(getAgain.artisanArray)[Number(payload.text) - 1].email,
        JSON.parse(getAgain.artisanArray)[Number(payload.text) - 1].mobile
      );
      response = await sendResponse(art, payload.user.id);
    } else if (stage.step == 5 && payload.text.toString() == "1") {
      await update(
        {
          artisan: JSON.stringify(
            JSON.parse(stage.artisanArray)[Number(stage.artisanIndex) - 1]
          ),
        },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );

      const requestToSave = {
        user_id: stage.user_id,
        full_name: stage.full_name,
        service: stage.service,
        address: stage.address,
        state: stage.state,
        lga: stage.lga,
        email: stage.email,
        location: stage.location,
        task_description: stage.task_description,
        artisan: JSON.stringify(
          JSON.parse(stage.artisanArray)[Number(stage.artisanIndex) - 1]
        ),
      };

      await saveCustomerRequest(requestToSave);
      let msmg =
        "wesabi will confirm availability of selected worker and the worker will reach out to you as soon as possible";
      await smsCustomer(msmg, payload.user.id);
      // await mailingCustomer()
      const existCustomer = await getAllExistCustomer(payload.user.id);
      if (existCustomer.length === 1)
        await smsCustomer(
          "Welcome to wesabi, accessing reliable and verified service professionals just got better",
          payload.user.id
        );

      await updateCustomerToLive(
        JSON.parse(stage.artisanArray)[Number(stage.artisanIndex) - 1].id,
        stage.editIndex
      );

      response = await sendResponse(
        "Congrats,your request has been received. Wesabi will confirm availability of selected worker and the worker will reach out to you as soon as possible ",
        payload.user.id
      );
    } else if (stage.step === 5 && payload.text.toString() === "2") {
      await update(
        { step: 4 },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );

      let jet = `${JSON.parse(stage.artisanArray).map(
        (entity, index) => `\n *[${index + 1}]* ${entity.firstname}`
      )}`;
      let js = `${otherResponse.artisan} \n${jet}`;
      response = await sendResponse(js, payload.user.id);
    } else {
      let sg =
        "Invalid input...,please check and retry or enter *restart* to start all over";
      response = await sendResponse(sg, payload.user.id);
    }
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
};
