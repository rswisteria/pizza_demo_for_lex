"use strict";

let error_result = (message) => {
    return {
        dialogAction: {
            type: "Close",
            fulfillmentState: "Failed",
            message: {
                contentType: "PlainText",
                content: `${message}`
            }
        }
    };
};

let dispatch = (event , callback) => {

};

exports.handler = (event, context, callback) => {
    console.log(event);
    try {
        dispatch(event, (response) => callback(null, response));
    } catch(e) {
        callback(null, error_result(e));
    }
};