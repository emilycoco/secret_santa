var helpers = require('../helpers');
var operations = require('../operations');

function smsCtrl(req, res) {
    let action = helpers.processSMS(req.body.Body);
    let phone = req.body.From[0] === '+' ? req.body.From.slice(1) : req.body.From;

    var phoneCheck = (phone && typeof phone === 'string' && phone.length === 11);
    var bodyCheck = (action.action && action.data && action.data.key && action.data.value);

    if (phoneCheck && bodyCheck) {
        switch (action.action) {
            case helpers.actions.addUser: {
                operations.addUser(phone, action.data.value)
                    .then(rsp => {
                        helpers.respond(res, rsp.msg);
                    })
                    .catch(err => {
                        helpers.respond(res, err.msg);
                    });
                break;
            }
            case helpers.actions.joinGroup: {
                operations.joinGroup(phone, action.data.value)
                    .then(rsp => {
                        helpers.respond(res, rsp.msg);
                    })
                    .catch(err => {
                        helpers.respond(res, err.msg);
                    });
                break;
            }
            case helpers.actions.sendSanta: {
                operations.sendMsg(phone, action.data)
                    .then(rsp => {
                        helpers.respond(res, rsp.msg);
                    })
                    .catch(err => {
                        helpers.respond(res, err.msg);
                    });
                break;
            }
            case helpers.actions.sendRecipient: {
                operations.sendMsg(phone, action.data)
                    .then(rsp => {
                        helpers.respond(res, rsp.msg);
                    })
                    .catch(err => {
                        helpers.respond(res, err.msg);
                    });
                break;
            }
        }
    } else {
        helpers.respond(res, helpers.generateError(null, helpers.errMsgs.paramsErr.name, null).msg);
    }
}

module.exports = {
    smsCtrl: smsCtrl
};