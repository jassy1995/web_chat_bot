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

exports.RegistrationProcess = async (req, res) => {
  const { payload } = req.body;
  let response;

  try {
    const stage = await currentStage(payload.user.id);
    const service = await getServices();
    const states = await getStates();
    const artisans = await getListOfArtisan();
    const artisanOne = await getArtisanOne(payload.user.id);
    const acct_value = await AccountDetail(stage?.full_name, payload.user.id);
    const nextV = await AccountDetail(artisanOne?.full_name, payload.user.id);
    console.log(nextV);

    if (payload.type === "text" && payload?.text?.toLowerCase() == "hi") {
      if (
        artisanOne?.user_id === payload.user.id || //&&
        artisanOne.payment_status === "paid"
      ) {
        response = await sendResponse(
          `*${payload.user.id}* has already been registered with us, please use another number`,
          payload.user.id
        );
      }

      // else if (
      //   artisanOne?.user_id === payload.user.id &&
      //   artisanOne.payment_status === "pending"
      // ) {
      //   await update(
      //     {
      //       step: 11,
      //     },
      //     {
      //       where: {
      //         user_id: payload.user.id,
      //       },
      //     }
      //   );
      //   const summary = `Here is the summary of your previous stage Name: *${artisanOne.full_name}*, Service: *${artisanOne.service}*, State: *${artisanOne.state}*,LGA: *${artisanOne.lga}*, Address: *${artisanOne.address}* . would you like to continue or restart the registration`;
      //   const header = `Welcome,${artisanOne.full_name} you are almost complete your registration`;
      //   const button = [
      //     {
      //       type: "reply",
      //       reply: { id: `${1}`, title: "Yes,Continue" },
      //     },
      //     {
      //       type: "reply",
      //       reply: { id: `${2}`, title: "No,Restart" },
      //     },
      //   ];
      //   let re = productsButtons({ header, summary }, button);
      //   response = await sendResponse(re, payload.user.id);
      // }
      else {
        await destroy({
          where: { user_id: payload.user.id },
        });
        await create({ user_id: payload.user.id, step: 1 });
        response = await sendResponse(welcomeResponse, payload.user.id);
      }
    }

    // else if (
    //   payload?.type === "text" &&
    //   payload?.text?.toString() === "1" &&
    //   stage?.step === 11
    // ) {
    //   const prev_acct = await AccountDetail(
    //     artisanOne?.full_name,
    //     payload.user.id
    //   );
    //   await update(
    //     {
    //       step: 12,
    //     },
    //     {
    //       where: {
    //         user_id: payload.user.id,
    //       },
    //     }
    //   );
    //   const summary = `To complete your registration, kindly make a payment of *${account.formatMoney(
    //     Number(prev_acct.data?.amount),
    //     "₦"
    //   )}* into  *${prev_acct.data?.account_number}* *${
    //     prev_acct.data?.bank_name
    //   }*. After payment, click the button below to confirm your payment`;

    //   const button = [
    //     {
    //       type: "reply",
    //       reply: { id: `${1}`, title: "Confirm payment" },
    //     },
    //   ];
    //   let re = productsButtons2({ summary }, button);
    //   response = await sendResponse(re, payload.user.id);
    // }
    // else if (
    //   payload?.type === "text" &&
    //   payload?.text?.toString() === "1" &&
    //   stage?.step === 12
    // ) {
    //   const confirmPay = await confirmPayment(nextV.data?.flw_ref);
    //   if (confirmPay?.data?.status) {
    //     await updateArtisan(
    //       {
    //         payment_status: "paid",
    //       },
    //       {
    //         where: {
    //           user_id: payload.user.id,
    //         },
    //       }
    //     );

    //     let resp = "Congratulation, your payment  has been received";
    //     response = await sendResponse(resp, payload.user.id);
    //   }

    //   else {
    //     const summary2 = `kindly make a payment of *${account.formatMoney(
    //       Number(nextV?.data?.amount),
    //       "₦"
    //     )}* into *${nextV?.data?.account_number}* *${
    //       nextV?.data?.bank_name
    //     }* .After payment, click the button below to confirm your payment`;
    //     const header = "Hay,your payment has not been received.";
    //     const button2 = [
    //       {
    //         type: "reply",
    //         reply: { id: `${1}`, title: "Confirm payment" },
    //       },
    //     ];
    //     let rr = productsButtons({ header, summary: summary2 }, button2);
    //     response = await sendResponse(rr, payload.user.id);
    //   }
    // }
    // else if (
    //   payload?.type === "text" &&
    //   payload?.text?.toString() === "2" &&
    //   stage?.step === 11
    // ) {
    //   await destroyArtisan({
    //     where: { user_id: payload.user.id },
    //   });
    //   await destroy({
    //     where: { user_id: payload.user.id },
    //   });
    //   await create({ user_id: payload.user.id, step: 1 });
    //   response = await sendResponse(welcomeResponse, payload.user.id);
    // }
    else if (payload.text?.toLowerCase() === "restart") {
      await destroy({
        where: { user_id: payload.user.id },
      });
      await create({ user_id: payload.user.id, step: 1 });
      response = await sendResponse(welcomeResponse, payload.user.id);
    } else if (
      payload.type === "text" &&
      stage?.step === 1 &&
      otherResponse.initService.includes(
        otherResponse.initService[Number(payload.text) - 1]
      )
    ) {
      await update(
        {
          menu: otherResponse.initService[Number(payload.text) - 1],
        },
        {
          where: {
            user_id: payload.user.id,
          },
        }
      );
      const existCustomer = await getExistCustomer(payload.user.id);
      const refetchC = await currentStage(payload.user.id);
      if (
        existCustomer?.user_id === payload.user.id &&
        refetchC.menu === "Request Service Provider(Customer)"
      ) {
        await update(
          {
            step: 3,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        let pss = await confirmNumberResponse(
          payload.user.name,
          payload.user.id
        );
        response = await sendResponse(pss, payload.user.id);
      } else {
        await update(
          {
            step: 2,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        let tt = await changeNameResponse(payload.user.name);
        response = await sendResponse(tt, payload.user.id);
      }
    } else if (stage?.menu === "Render Service (Artisan)") {
      if (
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
        let tts = await serviceResponse();
        response = await sendResponse(tts, payload.user.id);
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
        let rfs = await serviceResponse();
        response = await sendResponse(rfs, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 4 &&
        service.includes(service[Number(payload.text) - 1])
      ) {
        await update(
          { service: service[Number(payload.text) - 1], step: 5 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let rRe = await stateResponse();
        response = await sendResponse(rRe, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage?.step === 5 &&
        states.includes(states[Number(payload.text) - 1])
      ) {
        await update(
          { state: states[Number(payload.text) - 1].name, step: 6 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let info = await lgaResponse(states[Number(payload.text) - 1].id);
        await update(
          { local_government: info.lg },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(info.rests, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage?.step === 6 &&
        payload.text > 0 &&
        payload.text <= JSON.parse(stage.local_government)
      ) {
        await update(
          {
            lga: JSON.parse(stage.local_government)[Number(payload.text) - 1]
              .name,
            step: 7,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(otherResponse.address, payload.user.id);
      } else if (payload.type === "text" && stage.step === 7) {
        await update(
          { address: payload.text, step: 8 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(otherResponse.id_card, payload.user.id);
      } else if (payload.type === "image" && stage?.step === 8) {
        await update(
          { id_card: payload.image, step: 9 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.picture, payload.user.id);
      } else if (payload.type === "image" && stage?.step === 9) {
        await update(
          {
            picture: payload.image,
            local_government: acct_value?.data,
            step: 10,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        const summary = `Name: ${stage.full_name}, Service: ${
          stage.service
        }, State: ${stage.state}, LGA: ${stage.lga}, Address: ${
          stage.address
        } .Congrats!, your detail has been submitted,to complete your registration, kindly make a payment of *${account.formatMoney(
          Number(acct_value.data?.amount),
          "₦"
        )}* into  *${acct_value.data?.account_number}* *${
          acct_value.data?.bank_name
        }*. After payment, click the button below to confirm your payment`;
        const header = "Here is the summary of your registration";
        const button = [
          {
            type: "reply",
            reply: { id: `${1}`, title: "Confirm payment" },
          },
        ];
        const toSave = {
          user_id: stage.user_id,
          full_name: stage?.full_name,
          service: stage?.service,
          state: stage?.state,
          lga: stage?.lga,
          address: stage?.address,
          id_card: stage?.id_card,
          picture: payload.image,
          payment_status: "pending",
        };

        await createArtisan(toSave);
        let re = productsButtons({ header, summary }, button);
        response = await sendResponse(re, payload.user.id);
      } else if (
        payload.text.toString() === "1" &&
        payload.type === "text" &&
        stage?.step === 10
      ) {
        const payment = await confirmPayment(
          JSON.parse(stage.local_government)?.flw_ref
        );
        if (payment?.data?.status) {
          await updateArtisan(
            {
              payment_status: "paid",
            },
            {
              where: {
                user_id: payload.user.id,
              },
            }
          );

          let resp = "Congratulation, your payment  has been received";
          response = await sendResponse(resp, payload.user.id);
        } else {
          const newData = await currentStage(payload.user.id);
          const summary2 = `kindly make a payment of *${account.formatMoney(
            Number(JSON.parse(newData?.local_government)?.amount),
            "₦"
          )}* into *${
            JSON.parse(newData?.local_government)?.account_number
          }* *${
            JSON.parse(newData?.local_government)?.bank_name
          }* .After payment, click the button below to confirm your payment`;
          const header = "Hay,your payment has not been received.";
          const button2 = [
            {
              type: "reply",
              reply: { id: `${1}`, title: "Confirm payment" },
            },
          ];
          let rr = productsButtons({ header, summary: summary2 }, button2);
          response = await sendResponse(rr, payload.user.id);
        }
      } else {
        let rq =
          "Invalid input,please check and retry or enter *restart* to start all over";
        response = await sendResponse(rq, payload.user.id);
      }
    } else if (stage?.menu === "Request Service Provider(Customer)") {
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
        // console.log(stage.step);
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
          { service: service[Number(payload.text) - 1], step: 5 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.address, payload.user.id);
      } else if (payload.type === "text" && stage.step === 5) {
        await update(
          { address: payload.text, step: 6 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(
          "please enter your email",
          payload.user.id
        );
      } else if (payload.type === "text" && stage.step === 6) {
        await update(
          { email: payload.text, step: 7 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.location, payload.user.id);
      } else if (payload.type === "location" && stage.step === 7) {
        let location = {
          long: payload.location.longitude,
          lat: payload.location.latitude,
        };
        await update(
          { local_government: location, step: 8 },
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
      } else if (payload.type === "text" && stage.step === 8) {
        await update(
          { task_description: payload.text, step: 9 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let js = await artisanResponse();
        response = await sendResponse(js, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 9 &&
        artisans.data.artisans.includes(
          artisans.data.artisans[Number(payload.text) - 1]
        )
      ) {
        await update(
          { artisanIndex: payload.text, step: 10 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let art = await artisanInfoResponse(
          artisans.data.artisans[Number(payload.text) - 1].name,
          artisans.data.artisans[Number(payload.text) - 1].phone,
          artisans.data.artisans[Number(payload.text) - 1].account_number,
          artisans.data.artisans[Number(payload.text) - 1].bank
        );
        response = await sendResponse(art, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 10 &&
        payload.text.toString() === "1"
      ) {
        const ggg = await currentStage(payload.user.id);
        await update(
          {
            artisan: artisans.data.artisans[Number(ggg.artisanIndex) - 1].name,
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
          email: stage.email,
          location: JSON.parse(stage.local_government),
          task_description: stage.task_description,
          artisan: artisans.data.artisans[Number(ggg.artisanIndex) - 1].name,
        };
        await saveCustomerRequest(requestToSave);
        // await mailingCustomer()
        const existCustomer = await getAllExistCustomer(payload.user.id);
        if (existCustomer.length === 1) await smsCustomer(payload.user.id);

        response = await sendResponse(
          "Congrats,your request has been received",
          payload.user.id
        );
      } else if (
        payload.type === "text" &&
        stage.step === 10 &&
        payload.text.toString() === "2"
      ) {
        await update(
          { step: 9 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let js = await artisanResponse();
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
