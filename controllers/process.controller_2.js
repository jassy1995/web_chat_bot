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
        let va = await registrationFormResponse(
          "To start your request process, please click the button below",
          "customer-request-form"
        );
        response = await sendResponse(va, payload.user.id);
      }
    }
    //=============== START ARTISAN REGISTRATION ===============
    if (
      stage?.menu === "Render Service (Artisan)" &&
      payload.type === "artisan-registration-form" &&
      stage?.step === 2
    ) {
      response = await sendResponse(
        "your have successfully registered",
        payload.user.id
      );

      //   const toSave = {
      //     user_id: stage.user_id,
      //     full_name: stage?.full_name,
      //     service: stage?.service,
      //     state: stage?.state,
      //     lga: stage?.lga,
      //     address: stage?.address,
      //     email: stage?.email,
      //     gender: stage?.gender,
      //     dateOfBirth: stage?.dateOfBirth,
      //     id_card: stage?.id_card,
      //     picture: payload.image,
      //     payment_status: "pending",
      //   };
      //   console.log(toSave);
      //   await createArtisan(toSave);
      //   await saveArtisanToLive(
      //     stage?.service,
      //     stage?.full_name,
      //     stage?.email,
      //     payload?.user.id,
      //     stage?.gender,
      //     stage?.dateOfBirth,
      //     stage?.state,
      //     stage?.address
      //   );
      //   response = await sendResponse(
      //     `Congrats, your registration has been completed, below is the summary of your information  \n Name: *${stage.full_name}* \n Service: *${stage.service}* \n State: *${stage.state}* \n LGA: *${stage.lga}* \n Address: *${stage.address}* \n Gender: *${stage.gender}* \n Date Of Birth: *${stage.dateOfBirth}* \n`,
      //     payload.user.id
      //   );
      // }
      // else {
      //   let rq =
      //     "Invalid input,please check and retry or enter *restart* to start all over";
      //   response = await sendResponse(rq, payload.user.id);
      // }
    } else if (stage?.menu === "Request Service Provider(Customer)") {
      // checkExistCustomer;
      // if (payload?.text?.toString() === "1" && stage?.step === 3 && checkExistCustomer.user_id===payload.user.id) {
      //    await update(
      //      { full_name: payload.user.name, step: 4 },
      //      {
      //        where: {
      //          user_id: payload.user.id,
      //        },
      //      }
      //    );
      //    let ttt = await serviceResponse();
      //    response = await sendResponse(ttt, payload.user.id);
      // }
      if (payload?.text?.toString() === "1" && stage?.step === 3) {
        await update(
          { full_name: payload.user.name, step: 4 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let ttt = await serviceResponse();
        response = await sendResponse(ttt, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 2 &&
        payload.text.toString() === "2"
      ) {
        await update(
          { step: 3 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let fn = await fullNameResponse();
        response = await sendResponse(fn, payload.user.id);
      } else if (payload.type === "text" && stage.step === 3) {
        await update(
          { full_name: payload.text, step: 4 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let ttf = await serviceResponse();
        response = await sendResponse(ttf, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 2 &&
        payload.text.toString() === "1"
      ) {
        await update(
          { full_name: payload.user.name, step: 4 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let ress = await serviceResponse();
        response = await sendResponse(ress, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 4 &&
        service.includes(service[Number(payload.text) - 1])
      ) {
        await update(
          { service: service[Number(payload.text) - 1].category },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        if (checkExistCustomer?.user_id === payload.user.id) {
          await update(
            { step: 6 },
            {
              where: {
                user_id: payload.user.id,
              },
            }
          );
          let jh = await changeAddressResponse(
            stage.full_name,
            checkExistCustomer.address
          );
          response = await sendResponse(jh, payload.user.id);
        } else {
          await update(
            {
              step: 5,
            },
            {
              where: {
                user_id: payload.user.id,
              },
            }
          );
          response = await sendResponse(otherResponse.address, payload.user.id);
        }
      } else if (
        payload.type === "text" &&
        stage.step === 6 &&
        payload.text.toString() === "1"
      ) {
        await update(
          {
            address: checkExistCustomer?.address,
            email: checkExistCustomer.email,
            location: checkExistCustomer.location,
            state: checkExistCustomer.state,
            lga: checkExistCustomer.lga,
            step: 12,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(
          otherResponse.task_description,
          payload.user.id
        );
      } else if (
        payload.type === "text" &&
        stage.step === 6 &&
        payload.text.toString() === "2"
      ) {
        await update(
          { step: 5 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(otherResponse.address, payload.user.id);
      } else if (payload.type === "text" && stage.step === 5) {
        await update(
          { address: payload.text, step: 8 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        // response = await sendResponse(
        //   "please enter your email",
        //   payload.user.id
        // );
        let hhh = await stateResponse();
        response = await sendResponse(hhh, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage?.step === 8 &&
        states.includes(states[Number(payload.text) - 1])
      ) {
        await update(
          { state: states[Number(payload.text) - 1].name, step: 9 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let info = await lgaResponse(states[Number(payload.text) - 1].name);
        await update(
          { local_government: JSON.stringify(info.lg) },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(info.rests, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage?.step === 9 &&
        Number(payload.text) > 0 &&
        Number(payload.text) <= JSON.parse(stage.local_government).length
      ) {
        // console.log(
        //   JSON.parse(stage.local_government)[Number(payload.text) - 1].name
        // );
        // console.log(
        //   typeof JSON.parse(stage.local_government)[Number(payload.text) - 1]
        //     .name
        // );
        await update(
          {
            lga: JSON.parse(stage.local_government)[Number(payload.text) - 1]
              .lga,
            step: 10,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(
          "Enter your email address",
          payload.user.id
        );
      } else if (payload.type === "text" && stage.step === 10) {
        await update(
          { email: payload.text, step: 11 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.location, payload.user.id);
      } else if (payload.type === "location" && stage.step === 11) {
        let location = {
          long: payload.location.longitude,
          lat: payload.location.latitude,
        };
        await update(
          { location: JSON.stringify(location), step: 12 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(
          otherResponse.task_description,
          payload.user.id
        );
      } else if (payload.type === "text" && stage.step === 12) {
        await update(
          { task_description: payload.text, step: 13 },
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
        payload.type === "text" &&
        stage.step === 13 &&
        Number(payload.text) <= JSON.parse(stage.artisanArray)?.length
      ) {
        //  Number(payload.text) <= artisans.data.artisans.length &&
        //    Number(payload.text) > 0;
        // artisans.data.artisans.includes(
        //   artisans.data.artisans[Number(payload.text) - 1]
        const getAgain = await currentStage(payload.user.id);

        await update(
          {
            artisanIndex: payload.text,
            step: 14,
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
      } else if (
        payload.type == "text" &&
        stage.step == 14 &&
        payload.text.toString() == "1"
      ) {
        // const ggg = await currentStage(payload.user.id);
        // const artisans = await getListOfArtisan(
        //   stage?.service,
        //   stage?.task_description,
        //   stage?.state,
        //   stage?.lga,
        //   stage?.address,
        //   stage?.email,
        //   payload?.user.id,
        //   stage?.full_name,
        //   stage?.createdAt
        // );
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

        // const getServiceId2 = service.find(
        //   ({ category }) => category === stage?.service
        // );
        // const getStateCode2 = states.find(({ name }) => name === stage?.state);

        await updateCustomerToLive(
          JSON.parse(stage.artisanArray)[Number(stage.artisanIndex) - 1].id,
          stage.editIndex
        );

        response = await sendResponse(
          "Congrats,your request has been received",
          payload.user.id
        );
      } else if (
        payload.type === "text" &&
        stage.step === 14 &&
        payload.text.toString() === "2"
      ) {
        await update(
          { step: 13 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        let jet = `${JSON.parse(stage.artisanArray).map(
          (entity, index) => `\n *[${index + 1}]* ${entity.firstname}`
        )}`;
        //  `${question_one.artisan} \n${formatDataArrayToStringForArtisan(
        //    artisans
        //  )}`;
        // let js = await artisanResponse();
        let js = `${otherResponse.artisan} \n${jet}`;
        response = await sendResponse(js, payload.user.id);
      } else {
        let sg =
          "Invalid input,please check and retry or enter *restart* to start all over";
        response = await sendResponse(sg, payload.user.id);
      }
    } else {
      let fg =
        "Invalid input,please check and retry or enter *restart* to start all over";
      response = await sendResponse(fg, payload.user.id);
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const { State } = require("../models");
exports.Testing = async (req, res) => {
  try {
    const data = await State.create({ state_name: req.body.state });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "error occur", error });
  }
};
