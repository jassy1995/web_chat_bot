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
  mailingCustomer,
} = require("../utils/chat");

const {
  getServices,
  getStates,
  getLga,
  AccountDetail,
  confirmPayment,
  getListOfArtisan,
  sendResponse,
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
} = require("../utils/query");

exports.RegistrationProcess = async (req, res) => {
  const { payload } = req.body;
  let response;
  let num = "0";

  try {
    const stage = await currentStage(num.concat(payload.user.id?.slice(3)));
    const service = await getServices();
    const states = await getStates();
    const artisans = await getListOfArtisan();
    const acct_value = await AccountDetail(
      stage?.full_name,
      num.concat(payload.user.id?.slice(3))
    );
    // console.log(acct_value);

    if (
      payload.type === "text" &&
      (payload?.text?.toLowerCase() == "hi" ||
        payload.text.toLowerCase() == "restart")
    ) {
      await destroy({
        where: { user_id: num.concat(payload.user.id?.slice(3)) },
      });
      await create({ user_id: num.concat(payload.user.id?.slice(3)), step: 1 });
      response = await sendResponse(
        welcomeResponse,
        num.concat(payload.user.id?.slice(3))
      );
    } else if (
      payload?.type === "text" &&
      payload?.text?.toLowerCase() == "hi" &&
      stage?.step === 10
    ) {
      await update(
        {
          step: 11,
        },
        {
          where: {
            user_id: num.concat(payload.user.id?.slice(3)),
          },
        }
      );
      const summary = `Here is the summary of your previous stage Name: *${stage.full_name}*, Service: *${stage.service}*, State: *${stage.state}*,LGA: *${stage.lga}*, Address: *${stage.address}* . would you like to continue or restart the registration`;
      const header = `Welcome,${stage.full_name} you are almost complete your registration`;
      const button = [
        {
          type: "reply",
          reply: { id: `${1}`, title: "Yes,Continue" },
        },
        {
          type: "reply",
          reply: { id: `${2}`, title: "No,Restart" },
        },
      ];
      let re = productsButtons({ header, summary }, button);
      response = await sendResponse(re, num.concat(payload.user.id?.slice(3)));
    } else if (
      payload?.type === "text" &&
      payload?.text?.toString() === "1" &&
      stage?.step === 11
    ) {
      // const acct_value = await AccountDetail(
      //   stage.full_name,
      //   payload?.user?.id
      // );
      // console.log(acct_value);
      await update(
        {
          step: 10,
        },
        {
          where: {
            user_id: num.concat(payload.user.id?.slice(3)),
          },
        }
      );
      const summary = `To complete your registration, kindly make a payment of *${account.formatMoney(
        Number(acct_value.data?.amount),
        "₦"
      )}* into  *${acct_value.data?.account_number}* *${
        acct_value.data?.bank_name
      }*. After payment, click the button below to confirm your payment`;

      const button = [
        {
          type: "reply",
          reply: { id: `${1}`, title: "Confirm payment" },
        },
      ];
      let re = productsButtons2({ summary }, button);
      response = await sendResponse(re, num.concat(payload.user.id?.slice(3)));
    } else if (
      payload?.type === "text" &&
      payload?.text?.toString() === "2" &&
      stage?.step === 11
    ) {
      await destroy({
        where: { user_id: num.concat(payload.user.id?.slice(3)) },
      });
      await create({ user_id: num.concat(payload.user.id?.slice(3)), step: 1 });
      response = await sendResponse(
        welcomeResponse,
        num.concat(payload.user.id?.slice(3))
      );
    } else if (
      payload.type === "text" &&
      stage?.step === 1 &&
      otherResponse.initService.includes(
        otherResponse.initService[Number(payload.text) - 1]
      )
    ) {
      // const existCustomer = await getExistCustomer(num.concat(payload.user.id?.slice(3)));
      await update(
        {
          menu: otherResponse.initService[Number(payload.text) - 1],
        },
        {
          where: {
            user_id: num.concat(num.concat(payload.user.id?.slice(3))),
          },
        }
      );
      const existCustomer = await getExistCustomer(
        num.concat(payload.user.id?.slice(3))
      );
      const refetchC = await currentStage(
        num.concat(payload.user.id?.slice(3)).toString()
      );
      console.log(
        existCustomer?.user_id === num.concat(payload.user.id?.slice(3))
      );
      console.log(refetchC?.menu === "Request Service Provider(Customer)");
      console.log(refetchC);

      if (
        existCustomer?.user_id === num.concat(payload.user.id?.slice(3)) &&
        payload.text === "2"
      ) {
        await update(
          {
            step: 3,
          },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let pss = await confirmNumberResponse(
          payload.user.name,
          num.concat(payload.user.id?.slice(3))
        );
        response = await sendResponse(
          pss,
          num.concat(payload.user.id?.slice(3))
        );
      } else {
        await update(
          {
            menu: otherResponse.initService[Number(payload.text) - 1],
            step: 2,
          },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let tt = await changeNameResponse(payload.user.name);
        response = await sendResponse(
          tt,
          num.concat(payload.user.id?.slice(3))
        );
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
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let fn = await fullNameResponse();
        response = await sendResponse(
          fn,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "text" && stage.step === 3) {
        await update(
          { full_name: payload.text, step: 4 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let tt = await serviceResponse();
        response = await sendResponse(
          tt,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage.step === 2 &&
        payload.text.toString() === "1"
      ) {
        await update(
          { full_name: payload.user.name, step: 4 },

          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let rfs = await serviceResponse();
        response = await sendResponse(
          rfs,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage.step === 4 &&
        service.includes(service[Number(payload.text) - 1])
      ) {
        await update(
          { service: service[Number(payload.text) - 1], step: 5 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let rRe = await stateResponse();
        response = await sendResponse(
          rRe,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage?.step === 5 &&
        states.includes(states[Number(payload.text) - 1])
      ) {
        await update(
          { state: states[Number(payload.text) - 1].name, step: 6 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let info = await lgaResponse(states[Number(payload.text) - 1].id);
        await update(
          { local_government: info.lg },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        response = await sendResponse(
          info.rests,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage?.step === 6 &&
        payload.text > 0 &&
        payload.text <= JSON.parse(stage.local_government).length
      ) {
        await update(
          {
            lga: JSON.parse(stage.local_government)[Number(payload.text) - 1]
              .name,
            step: 7,
          },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        response = await sendResponse(
          otherResponse.address,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "text" && stage.step === 7) {
        await update(
          { address: payload.text, step: 8 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        response = await sendResponse(
          otherResponse.id_card,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "image" && stage?.step === 8) {
        await update(
          { id_card: payload.user.image, step: 9 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );

        response = await sendResponse(
          otherResponse.picture,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "image" && stage?.step === 9) {
        // const acct_value = await AccountDetail(
        //   stage.full_name,
        //   payload?.user?.id
        // );
        // console.log(acct_value);
        await update(
          {
            picture: payload.user.image,
            local_government: acct_value?.data,
            step: 10,
          },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        // console.log(acct_value.data);
        const summary = `Name: ${stage.full_name}, Service: ${
          stage.service
        }, State: ${stage.state}, LGA: ${stage.lga}, Address: ${
          stage.address
        } .To complete your registration, kindly make a payment of *${account.formatMoney(
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
        let re = productsButtons({ header, summary }, button);
        response = await sendResponse(
          re,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.text.toString() === "1" &&
        payload.type === "text" &&
        stage?.step === 10
      ) {
        const payment = await confirmPayment(
          JSON.parse(stage.local_government)?.flw_ref
        );
        if (payment.data.status) {
          const toSave = {
            user_id: stage.user_id,
            menu: stage.menu,
            full_name: stage.full_name,
            service: stage.service,
            state: stage.state,
            lga: stage.lga,
            address: stage.address,
            id_card: stage.id_card,
            picture: stage.picture,
          };
          await createArtisan(toSave);
          let resp = "Congratulation, your registration has been completed";
          response = await sendResponse(
            resp,
            num.concat(payload.user.id?.slice(3))
          );
        } else {
          const newData = await currentStage(
            num.concat(payload.user.id?.slice(3))
          );
          const summary2 = `kindly make a payment of *${account.formatMoney(
            Number(JSON.parse(newData.local_government).amount),
            "₦"
          )}* into *${JSON.parse(newData.local_government).account_number}* *${
            JSON.parse(newData.local_government).bank_name
          }*. After payment, click the button below to confirm your payment`;
          const header = "Hay,your payment has not been received.";
          const button2 = [
            {
              type: "reply",
              reply: { id: `${1}`, title: "Confirm payment" },
            },
          ];
          let rr = productsButtons({ header, summary: summary2 }, button2);
          response = await sendResponse(
            rr,
            num.concat(payload.user.id?.slice(3))
          );
        }
      } else {
        let rq =
          "Invalid input,please check and retry or enter *restart* to start all over";
        response = await sendResponse(
          rq,
          num.concat(payload.user.id?.slice(3))
        );
      }
    } else if (stage?.menu === "Request Service Provider(Customer)") {
      if (payload?.text?.toString() === "1" && stage?.step === 3) {
        await update(
          { step: 4 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let ttt = await serviceResponse();
        response = await sendResponse(
          ttt,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage.step === 2 &&
        payload.text.toString() === "2"
      ) {
        await update(
          { step: 3 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let fn = await fullNameResponse();
        response = await sendResponse(
          fn,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "text" && stage.step === 3) {
        console.log(stage.step);
        await update(
          { full_name: payload.text, step: 4 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let tt = await serviceResponse();
        response = await sendResponse(
          tt,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage.step === 2 &&
        payload.text.toString() === "1"
      ) {
        await update(
          { full_name: payload.user.name, step: 4 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let ress = await serviceResponse();
        response = await sendResponse(
          ress,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage.step === 4 &&
        service.includes(service[Number(payload.text) - 1])
      ) {
        await update(
          { service: service[Number(payload.text) - 1], step: 5 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );

        response = await sendResponse(
          otherResponse.address,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "text" && stage.step === 5) {
        await update(
          { address: payload.text, step: 6 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );

        response = await sendResponse(
          otherResponse.location,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "location" && stage.step === 6) {
        let location = {
          long: payload.location.longitude,
          lat: payload.location.latitude,
        };
        await update(
          { local_government: location, step: 7 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        response = await sendResponse(
          otherResponse.task_description,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (payload.type === "text" && stage.step === 7) {
        await update(
          { task_description: payload.text, step: 8 },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        let js = await artisanResponse();
        response = await sendResponse(
          js,
          num.concat(payload.user.id?.slice(3))
        );
      } else if (
        payload.type === "text" &&
        stage.step === 8 &&
        artisans.data.artisans.includes(
          artisans.data.artisans[Number(payload.text) - 1]
        )
      ) {
        await update(
          { artisan: artisans.data.artisans[Number(payload.text) - 1].name },
          {
            where: {
              user_id: num.concat(payload.user.id?.slice(3)),
            },
          }
        );
        const ggg = await currentStage(num.concat(payload.user.id?.slice(3)));
        const requestToSave = {
          user_id: stage.user_id,
          menu: stage.menu,
          full_name: stage.full_name,
          service: stage.service,
          address: stage.address,
          location: stage.local_government.location,
          task_description: stage.task_description,
          artisan: ggg.artisan,
        };

        await saveCustomerRequest(requestToSave);
        // await mailingCustomer();
        response = await sendResponse(
          "Congrats,your request has been received",
          num.concat(payload.user.id?.slice(3))
        );
      } else {
        let sg =
          "Invalid input,please check and retry or enter *restart* to start all over";
        response = await sendResponse(
          sg,
          num.concat(payload.user.id?.slice(3))
        );
      }
    } else {
      let fg =
        "Invalid input,please check and retry or enter *restart* to start all over";
      response = await sendResponse(fg, num.concat(payload.user.id?.slice(3)));
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
