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
              : "To continue click your prefer option."
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
  listButtons,
  changeNameButton,
};
