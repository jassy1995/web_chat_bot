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
    const { data: service } = await getServices();
    let { data } = await getStates();
    const states = data.reverse();
    const artisanOne = await getArtisanOne(payload.user.id);
    const acct_value = await AccountDetail(stage?.full_name, payload.user.id);
    const nextV = await AccountDetail(artisanOne?.full_name, payload.user.id);
    const checkExistCustomer = await getExistCustomer(payload.user.id);
    const isArtisanExist = await getExistArtisan(payload.user.id);
    //========= START THE CHAT ===========
    if (payload.type === "text" && payload?.text?.toLowerCase() == "hi") {
      if (isArtisanExist) {
        let ex1 = await welcomeReturningArtisanResponse(
          "artisan",
          isArtisanExist.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex1, payload.user.id);
      } else if (checkExistCustomer) {
        let ex2 = await welcomeReturningArtisanResponse(
          "customer",
          checkExistCustomer.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex2, payload.user.id);
      } else {
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(welcomeResponse, payload.user.id);
      }
    }
    //================ RESTART THE CHAT==================
    if (payload.text?.toLowerCase() === "restart") {
      if (isArtisanExist) {
        let ex1 = await welcomeReturningArtisanResponse(
          "artisan",
          isArtisanExist.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex1, payload.user.id);
      } else if (checkExistCustomer) {
        let ex2 = await welcomeReturningArtisanResponse(
          "customer",
          checkExistCustomer.full_name
        );
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(ex2, payload.user.id);
      } else {
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });

        response = await sendResponse(welcomeResponse, payload.user.id);
      }
    }
    //================== MENU OPTIONS ======================
    if (
      payload.type === "text" &&
      stage?.step === 1 &&
      otherResponse.initService.includes(
        otherResponse.initService[Number(payload.text) - 1]
      )
    ) {
      await update(
        {
          menu: otherResponse.initService[Number(payload.text) - 1],
          step: 2,
        },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );

      if (
        otherResponse.initService[Number(payload.text) - 1] ===
        "Render Service (Artisan)"
      ) {
        let va = await registrationFormResponse(
          "To start registration, please click the button below",
          "artisan-registration-form"
        );

        response = await sendResponse(va, payload.user.id);
      } else {
        if (checkExistCustomer) {
          // JSON.parse(stage.artisanArray)[Number(stage.artisanIndex) - 1]
          const summary = `Name: *${
            checkExistCustomer?.full_name
          }* \n Service: *${checkExistCustomer?.service}* \n State: *${
            checkExistCustomer?.state
          }* \n LGA: *${checkExistCustomer?.lga}* \n Address: *${
            checkExistCustomer?.address
          }* \n Email: *${checkExistCustomer?.email}* \n task_description: *${
            checkExistCustomer?.task_description
          }* \n Gender: *${checkExistCustomer?.gender}* \n Artisan: *${
            JSON.parse(checkExistCustomer.artisan).firstname
          } \n`;
          const header =
            "Below is the summary of your previous information, \n \n *would you like to change it* ?";
          const button = [
            {
              type: "reply",
              reply: { id: "yes", title: "Yes" },
            },
            {
              type: "reply",
              reply: { id: "no", title: "No" },
            },
          ];
          let re = productsButtons({ header, summary }, button);
          response = await sendResponse(re, payload.user.id);
        } else {
          let va = await registrationFormResponse(
            "To start your request process, please click the button below",
            "customer-request-form"
          );
          response = await sendResponse(va, payload.user.id);
        }
      }
    }
    //=============== START ARTISAN REGISTRATION ===============
    if (stage?.menu === "Render Service (Artisan)") {
      if (payload.type === "artisan-registration-form" && stage?.step === 2) {
        payload.data["payment_status"] = "pending";
        payload.data["step"] = 3;
        console.log(payload.data);
        await update(payload.data, {
          where: {
            user_id: payload.user.id,
          },
        });

        response = await sendResponse(otherResponse.id_card, payload.user.id);
      } else if (payload.type === "image" && stage?.step === 3) {
        await update(
          { id_card: payload.image, step: 4 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.picture, payload.user.id);
      } else if (payload.type === "image" && stage?.step === 4) {
        await update(
          { picture: payload.image, step: 5 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        const summary = `Name: *${stage?.full_name}* \n Service: *${stage?.service}* \n State: *${stage?.state}* \n LGA: *${stage?.lga}* \n Address: *${stage?.address}* \n Email: *${stage?.email}* \n date_of_birth: *${stage?.date_of_birth}* \n Gender: *${stage?.gender}* \n`;
        const header = "Here is the summary of your registration detail";
        const button = [
          {
            type: "reply",
            reply: { id: "submit", title: "Submit" },
          },
          {
            type: "reply",
            reply: { id: "edit", title: "Edit" },
          },
        ];
        let re = productsButtons({ header, summary }, button);
        response = await sendResponse(re, payload.user.id);
      } else if (payload.text?.toLowerCase() === "edit" && stage?.step === 5) {
        await update(
          { step: 2 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let va = await registrationFormResponse(
          "Kindly edit your information here",
          "artisan-registration-form"
        );
        response = await sendResponse(va, payload.user.id, stage);
      } else if (
        payload.text?.toLowerCase() === "submit" &&
        stage?.step === 5
      ) {
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
          stage?.user.id,
          stage?.gender,
          stage?.date_of_birth,
          stage?.state,
          stage?.address
        );

        response = await sendResponse(
          "Congrats, your registration has been completed",
          payload.user.id
        );
      } else {
        let rq =
          "Invalid input,please check and retry or enter *restart* to start all over";
        response = await sendResponse(rq, payload.user.id);
      }
    } else if (stage?.menu === "Request Service Provider(Customer)") {
      if (payload.text?.toLowerCase() === "yes" && stage.step === 2) {
        let va = await registrationFormResponse(
          "Kindly edit your information here",
          "customer-request-form"
        );
        response = await sendResponse(va, payload.user.id, checkExistCustomer);
      } else if (payload.text?.toLowerCase() === "no" && stage.step === 2) {
        checkExistCustomer["step"] = 3;
        await update(checkExistCustomer, {
          where: {
            user_id: payload.user.id,
          },
        });
        response = await sendResponse(otherResponse.location, payload.user.id);
      } else if (
        payload.type === "customer-request-form" &&
        stage?.step === 2
      ) {
        payload.data["step"] = 3;
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
          { location: JSON.stringify(location), step: 4 },
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
          stage.email,
          payload.user.id,
          stage?.full_name,
          stage?.createdAt
        );
        await update(
          { artisanArray: JSON.stringify(artisanArray), editIndex: booking_id },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(artisanList, payload.user.id);
      } else if (
        stage.step === 4 &&
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
          "Congrats,your request has been received",
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
          "Invalid input,please check and retry or enter *restart* to start all over";
        response = await sendResponse(sg, payload.user.id);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
