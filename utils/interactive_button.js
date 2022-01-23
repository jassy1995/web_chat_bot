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
          text: `please confirm your number *${artisan_phone}*`,
        },
        action: {
          buttons: button,
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
};
