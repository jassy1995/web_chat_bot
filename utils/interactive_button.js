const productsButtons = (info, button) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: `${info.header ? info.header : `Welcome, ${info}`}`,
        },
        body: {
          text: `${
            info.summary
              ? info.summary
              : "kindly click to select the your prefer option."
          }`,
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};

const genderButton = (button) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "kindly click one of the button below to select your gender",
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};

const changeAddressButton = (info, button, address) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: ` ${info}`,
        },
        body: {
          text: `Is your address is still the same as *${address}*?`,
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};
const changeNameButton = (info, button) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: ` ${info}`,
        },
        body: {
          text: "would you like to change your *full name*?",
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};

const confirmNumberButton = (info, button, artisan_phone) => {
  let num = "0";
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: ` ${info}`,
        },
        body: {
          text: `please confirm your number *${num.concat(
            artisan_phone.slice(3)
          )}*`,
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};

const artisanInfo = (fname, buttons, lname, email, mobile) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: ` ${fname} ${lname}`,
        },
        body: {
          text: `Email : *${email}* \n Mobile : *${mobile}* `,
        },
        action: {
          buttons: buttons,
        },
      },
    },
  };
  return message;
};

const productsButtons2 = (info, button) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: info.summary,
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};

const productsButtons3 = (info, button) => {
  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: info,
        },
        action: {
          buttons: button,
        },
      },
    },
  };
  return message;
};

const listButtons = (question, options) => {
  let lists = {
    payload: {
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: question,
        },
        action: {
          button: "Please choose",
          sections: [
            {
              rows: options,
            },
          ],
        },
      },
    },
  };

  return lists;
};

module.exports = {
  productsButtons,
  productsButtons2,
  listButtons,
  changeNameButton,
  confirmNumberButton,
  artisanInfo,
  changeAddressButton,
  genderButton,
  productsButtons3,
};
