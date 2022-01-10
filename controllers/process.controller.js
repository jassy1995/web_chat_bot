const { productsButtons } = require("../utils/interactive_button");
const account = require("accounting");
const {
  welcomeResponse,
  fullNameResponse,
  serviceResponse,
  stateResponse,
  lgaResponse,
  otherResponse,
  artisanResponse,
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
} = require("../utils/query");

exports.RegistrationProcess = async (req, res) => {
  // const {
  //   payload: {
  //     type,
  //     text: message,
  //     user: { id, name, image },
  //   },
  // } = req.body;
  const { payload } = req.body;
  let response;
  let result;

  try {
    const stage = await currentStage(payload.user.id);
    const service = await getServices();
    const states = await getStates();
    const artisans = await getListOfArtisan();
    const acct_value = await AccountDetail(stage.full_name, payload?.user?.id);
    const payment = await confirmPayment(
      JSON.parse(stage.local_government)?.flw_ref
    );

    if (
      (payload.text.toLowerCase() == "hi" ||
        payload.text.toLowerCase() == "restart") &&
      payload.type === "text"
    ) {
      await destroy({ where: { user_id: payload.user.id } });
      await create({ user_id: payload.user.id, step: 1 });
      response = await sendResponse(welcomeResponse, payload.user.id);
    } else if (
      stage.step === 1 &&
      payload.type === "text" &&
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
      let fn = await fullNameResponse();
      response = await sendResponse(fn, payload.user.id);
    } else if (stage.menu === "Render Service (Artisan)") {
      if (payload.type === "text" && stage.step === 2) {
        await update(
          { full_name: payload.text, step: 3 },
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
        stage.step === 3 &&
        service.includes(service[Number(payload.text) - 1])
      ) {
        await update(
          { service: service[Number(payload.text) - 1], step: 4 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        let rRe = await stateResponse();
        response = await sendResponse(rRe, payload.user.id);
      } else if (
        stage?.step === 4 &&
        states.includes(states[Number(payload.text) - 1])
      ) {
        await update(
          { state: states[Number(payload.text) - 1].name, step: 5 },
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
        response = await sendResponse(info.res, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage?.step === 5 &&
        JSON.parse(stage.local_government).includes(
          JSON.parse(stage.local_government)[Number(payload.text) - 1]
        )
      ) {
        await update(
          {
            lga: JSON.parse(stage.local_government)[Number(payload.text) - 1]
              .name,
            step: 6,
          },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(otherResponse.address, payload.user.id);
      } else if (payload.type === "text" && stage.step === 6) {
        await update(
          { address: payload.text, step: 7 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        response = await sendResponse(otherResponse.id_card, payload.user.id);
        // info.res;
      } else if (payload.type === "image" && stage?.step === 7) {
        await update(
          { id_card: payload.user.image, step: 8 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.picture, payload.user.id);
      } else if (payload.type === "image" && stage?.step === 8) {
        await update(
          { picture: payload.user.image, step: 8 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        await update(
          { local_government: acct_value.data },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        const summary = `*Name* ${stage.full_name} *Service* ${
          stage.service
        } *State* ${stage.state} *Lga* ${stage.lga} *Address&* ${
          stage.address
        }.To complete your registration, kindly make a payment of ${account.formatMoney(
          Number(acct_value.data.amount),
          "₦"
        )} into * ${
          acct_value.data.account_number + " " + acct_value.data.bank_name
        }* . After payment, click the button below to confirm your payment`;
        const header = "Here is the summary of your registration";
        const button = [
          {
            type: "reply",
            reply: { id: `${1}`, title: "Confirm payment" },
          },
        ];
        let re = productsButtons({ header, summary }, button);
        response = await sendResponse(re, payload.user.id);
      } else if (
        payload.text.toString() === "1" &&
        payload.type === "text" &&
        stage?.step === 8
      ) {
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
          response = await sendResponse(resp, payload.user.id);
        } else {
          const summary2 = `kindly make a payment of ${account.formatMoney(
            Number(JSON.parse(stage.local_government).amount),
            "₦"
          )} into * ${
            JSON.parse(stage.local_government).account_number +
            " " +
            JSON.parse(stage.local_government).bank_name
          }  *.After payment, click the button below to confirm your payment`;
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
        response =
          "Invalid input,please check and retry or enter *restart* to start all over";
      }
    } else if (stage.menu === "Request Service Provider(Customer)") {
      if (payload.type === "text" && stage.step === 2) {
        await update(
          { full_name: payload.text, step: 3 },
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
        stage.step === 3 &&
        service.includes(service[Number(payload.text) - 1])
      ) {
        await update(
          { service: service[Number(payload.text) - 1], step: 4 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.address, payload.user.id);
      } else if (payload.type === "text" && stage.step === 4) {
        await update(
          { address: payload.text, step: 5 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );

        response = await sendResponse(otherResponse.location, payload.user.id);
      } else if (payload.type === "location" && stage.step === 5) {
        await update(
          { location: payload.user.image, step: 6 },
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
      } else if (payload.type === "text" && stage.step === 6) {
        await update(
          { task_description: payload.text, step: 7 },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        // states.includes(states[Number(payload.text) - 1]
        response = await artisanResponse();
        // response = await sendResponse(otherResponse.artisan, payload.user.id);
      } else if (
        payload.type === "text" &&
        stage.step === 7 &&
        artisans.data.artisans.includes(
          artisans.data.artisans[Number(payload.text) - 1]
        )
      ) {
        await update(
          { artisan: artisans.data.artisans[Number(payload.text) - 1].name },
          {
            where: {
              user_id: payload.user.id,
            },
          }
        );
        const ggg = await currentStage(payload.user.id);
        const requestToSave = {
          user_id: stage.user_id,
          menu: stage.menu,
          full_name: stage.full_name,
          service: stage.service,
          address: stage.address,
          location: stage.location,
          task_description: stage.task_description,
          artisan: ggg.artisan,
        };
        await saveCustomerRequest(requestToSave);
        response = "Congrat,your request has been received";
      } else {
        response =
          "Invalid input,please check and retry or enter *restart* to start all over";
      }
    } else {
      response =
        "Invalid input,please check and retry or enter *restart* to start all over";
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
  //   // {

  //   // const {
  //   //   payload: {
  //   //     type,
  //   //     text: text,
  //   //     user: { id, name, image },
  //   //   },
  //   // } = req.body;
  //   let response;
  //   // console.log(user);

  //   try {
  //     const stage = await currentStage(payload.user.id);
  //     const service = await getServices();
  //     const states = await getStates();
  //     console.log(stage);

  //     //initialize stage
  //     if (
  //       (payload.text.toLowerCase() == "hi" ||
  //         payload.text.toLowerCase() == "restart") &&
  //       payload.type === "text"
  //     ) {
  //       await destroy({ where: { user_id: payload.user.id } });
  //       await create({ user_id: payload.user.id, step: 1 });
  //       response = welcomeResponse;
  //     } else if (stage?.step === 1 && payload.type === "text") {
  //       await update(
  //         { menu: otherResponse.initService[Number(text) - 1], step: 2 },
  //         {
  //           where: {
  //             user_id: id,
  //           },
  //         }
  //       );
  //       response = await fullNameResponse();
  //     } else if (stage?.menu === "Render Service (Artisan)") {
  //       if (
  //         typeof payload.text === "string" &&
  //         stage?.step === 2 &&
  //         payload.type === "text"
  //       ) {
  //         await update(
  //           { full_name: payload.text, step: 3 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         response = await serviceResponse();
  //       } else if (
  //         payload.type === "text" &&
  //         stage?.step === 3 &&
  //         service.includes(service[Number(text) - 1])
  //       ) {
  //         await update(
  //           { service: service[Number(text) - 1], step: 4 },
  //           {
  //             where: {
  //               user_id: payload.user.id,
  //             },
  //           }
  //         );
  //         response = await stateResponse();
  //       } else if (
  //         stage?.step === 4 &&
  //         states.includes(states[Number(text) - 1])
  //       ) {
  //         await update(
  //           { state: states[Number(payload.text) - 1].name, step: 5 },
  //           {
  //             where: {
  //               user_id: payload.user.id,
  //             },
  //           }
  //         );
  //         let info = await lgaResponse(states[Number(payload.text) - 1].id);
  //         response = info.res;
  //         await update(
  //           { local_government: info.lg },
  //           {
  //             where: {
  //               user_id: payload.user.id,
  //             },
  //           }
  //         );
  //       } else if (
  //         type === "text" &&
  //         stage?.step === 5 &&
  //         stage.local_government.includes(
  //           stage.local_government[Number(payload.text) - 1]
  //         )
  //       ) {
  //         await update(
  //           {
  //             lga: stage.local_government[Number(payload.text) - 1].name,
  //             step: 6,
  //           },
  //           {
  //             where: {
  //               user_id: payload.user.id,
  //             },
  //           }
  //         );
  //         response = otherResponse.address;
  //       } else if (type === "text" && stage.step === 6) {
  //         await update(
  //           { address: payload.text, step: 7 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         response = otherResponse.id_card;
  //       } else if (payload.type === "image" && stage?.step === 7) {
  //         await update(
  //           { id_card: payload.user.image, step: 8 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );

  //         response = otherResponse.picture;
  //       } else if (payload.type === "image" && stage?.step === 8) {
  //         await update(
  //           { picture: payload.user.image, step: 9 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );

  //         // await createArtisan(toSave);
  //         // let acct_no = await Math.floor(Math.random() * 899999 + 1000000000);
  //         const { data } = await AccountDetail(stage.full_name, payload.user.id);
  //         // console.log(stage.full_name, id);
  //         // const us = await currentStage(id);
  //         await update(
  //           { local_government: data },
  //           {
  //             where: {
  //               user_id: payload.user.id,
  //             },
  //           }
  //         );
  //         const summary =
  //           stage.menu === "Render Service (Artisan)" &&
  //           `\n *Name* ${stage.full_name} *Service* ${stage.service} *State* ${
  //             stage.state
  //           } *Lga* ${stage.lga} *Address&* ${
  //             stage.address
  //           }. \n \n To complete your registration, kindly make a payment of ${account.formatMoney(
  //             Number(data.data.amount),
  //             "₦"
  //           )} into * ${
  //             data.data.account_number + " " + data.data.bank_name
  //           }  *.  \n After payment, click the button below to confirm your payment`;
  //         const header = "Here is the summary of your registration";
  //         const button = [
  //           {
  //             type: "reply",
  //             reply: { id: `${1}`, title: "Confirm payment" },
  //           },
  //         ];
  //         response = productsButtons({ header, summary }, button);
  //         // await destroy({ where: { user_id: id } });
  //       } else if (
  //         payload.text.toString() === "1" &&
  //         payload.type === "text" &&
  //         stage?.step === 9
  //       ) {
  //         const newAn = await currentStage(id);
  //         const payment = await confirmPayment(
  //           newAn.local_government.data.flw_ref
  //         );
  //         if (payment.status) {
  //           const newArtisan = await currentStage(id);
  //           const {
  //             user_id,
  //             menu,
  //             full_name,
  //             service,
  //             state,
  //             lga,
  //             address,
  //             id_card,
  //             picture,
  //           } = newArtisan;
  //           const toSave = {
  //             user_id,
  //             menu,
  //             full_name,
  //             service,
  //             state,
  //             lga,
  //             address,
  //             id_card,
  //             picture,
  //           };

  //           await createArtisan(toSave);
  //           response = "Congratulation, your registration has been completed";
  //         } else {
  //           const {
  //             local_government: { data: amount, account_number, bank_name },
  //           } = await currentStage(id);
  //           const summary =
  //             stage.menu === "Render Service (Artisan)" &&
  //             `\n *Name* ${stage.full_name} *Service* ${stage.service} *State* ${
  //               stage.state
  //             } *Lga* ${stage.lga} *Address&* ${
  //               stage.address
  //             }. \n \n To complete your registration, kindly make a payment of ${account.formatMoney(
  //               Number(amount),
  //               "₦"
  //             )} into * ${
  //               account_number + " " + bank_name
  //             }  *.  \n After payment, click the button below to confirm your payment`;
  //           const header = "Here is the summary of your registration";
  //           const button = [
  //             {
  //               type: "reply",
  //               reply: { id: `${1}`, title: "Confirm payment" },
  //             },
  //           ];
  //           response = productsButtons({ header, summary }, button);
  //         }
  //       }
  //     } else if (stage.menu === "Request Service Provider(Customer)") {
  //       if (typeof text === "string" && stage?.step === 2 && type === "text") {
  //         await update(
  //           { full_name: text, step: 4 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         response = await serviceResponse();
  //       }

  //       if (
  //         type === "text" &&
  //         stage?.menu === "Request Service Provider(Customer)" &&
  //         stage?.step === 4
  //       ) {
  //         await update(
  //           { step: 5 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         response = otherResponse.address;
  //       } else if (
  //         type === "text" &&
  //         stage?.menu === "Request Service Provider(Customer)" &&
  //         stage?.step === 5
  //       ) {
  //         await update(
  //           { address: text, step: 6 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         response = otherResponse.location;
  //       } else if (
  //         type === "location" &&
  //         stage?.menu === "Request Service Provider(Customer)" &&
  //         stage?.step === 6
  //       ) {
  //         await update(
  //           { location: image, step: 7 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         response = otherResponse.task_description;
  //       } else if (
  //         type === "text" &&
  //         stage?.menu === "Request Service Provider(Customer)" &&
  //         stage?.step === 7
  //       ) {
  //         await update(
  //           { task_description: text, step: 8 },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         let { artisans } = await getListOfArtisan();
  //         await update(
  //           { local_government: artisans },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );

  //         response = await artisanResponse();
  //       } else if (
  //         type === "text" &&
  //         stage?.menu === "Request Service Provider(Customer)" &&
  //         stage?.step === 8
  //       ) {
  //         const newCusto = await currentStage(id);
  //         await update(
  //           {
  //             artisan: newCusto.local_government.includes(
  //               newCusto.local_government[Number(text) - 1]
  //             ).name,
  //             step: 9,
  //           },
  //           {
  //             where: {
  //               user_id: id,
  //             },
  //           }
  //         );
  //         const newCustomerRequest = await currentStage(id);
  //         const {
  //           user_id,
  //           menu,
  //           full_name,
  //           service,
  //           address,
  //           location,
  //           task_description,
  //           artisan,
  //         } = newCustomerRequest;
  //         const requestToSave = {
  //           user_id,
  //           menu,
  //           full_name,
  //           service,
  //           address,
  //           location,
  //           task_description,
  //           artisan,
  //         };
  //         await saveCustomerRequest(requestToSave);
  //         await destroy({ where: { user_id: id } });
  //         response = "Your request has been received successfully";
  //       }
  //     } else {
  //       console.log(type, text);
  //       response =
  //         "Invalid input,please check or enter *[restart]* to start all over";
  //     }
  //     return res.status(200).json(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
};
