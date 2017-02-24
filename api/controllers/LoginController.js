var Machine = require("machine");
var bcrypt = require('bcryptjs');


module.exports = {
    'create': function(req, res) {
        Machine.build({
            inputs: {
                "email": {
                    "example": "abc123",
                    "required": true
                },
                "password": {
                    "example": "l0lcatzz",
                    "required": true
                }
            },
            exits: {
                respond: {}
            },
            fn: function(inputs, exits) {
                // Find One User
                sails.machines['_project_3202_0.0.15'].findOne_user({
                    "criteria": {
                        email: inputs.email
                    }
                }).setEnvironment({
                    sails: sails
                }).exec({
                    "success": function(findOneUser) {
                        // Check password
                        sails.machines['e05a71f7-485d-443a-803e-029b84fe73a4_2.3.0'].checkPassword({
                            "passwordAttempt": inputs.password,
                            "encryptedPassword": (findOneUser && findOneUser.password)
                        }).exec({
                            "error": function(checkPassword) {
                                return exits.error({
                                    data: checkPassword,
                                    status: 500
                                });

                            },
                            "incorrect": function(checkPassword) {
                                return exits.respond({
                                    action: "respond_with_status",
                                    status: "401"
                                });

                            },
                            "success": function(checkPassword) {
                                // Save to session
                                sails.machines['0ab17fbc-e31c-430d-85a4-929318f5e715_0.4.0'].save({
                                    "key": "userId",
                                    "value": (findOneUser && findOneUser.id)
                                }).setEnvironment({
                                    req: req
                                }).exec({
                                    "error": function(saveToSession) {
                                        return exits.error({
                                            data: saveToSession,
                                            status: 500
                                        });

                                    },
                                    "success": function(saveToSession) {
                                        return exits.respond({
                                            data: {
                                                id: (findOneUser && findOneUser.id),
                                                email: (findOneUser && findOneUser.email),
                                                username: (findOneUser && findOneUser.username),
                                                avatarUrl: (findOneUser && findOneUser.avatarUrl)
                                            },
                                            action: "respond_with_value_and_status",
                                            status: 200
                                        });

                                    }
                                });

                            }
                        });

                    },
                    "error": function(findOneUser) {
                        return exits.error({
                            data: findOneUser,
                            status: 500
                        });

                    },
                    "notFound": function(findOneUser) {
                        return exits.respond({
                            action: "respond_with_status",
                            status: "403"
                        });

                    }
                });
            }
        }).configure(req.params.all(), {
            respond: res.response,
            error: res.negotiate
        }).exec();
    },
    'login': function(req,res){
        var email = req.param('email');
        var password = req.param('password');

        if (!email || !password){
            return res.forbidden();
        }

        User
        .findOne({
            email: email
        })
        .exec(function(err,user){
            if (err){
                return res.serverError();
            }

            if (!user){
                return res.notFound();           
            }

            // Load hash from your password DB.
            bcrypt.compare(password, user.password, function(err, results) {
                if (err){
                    return res.serverError();
                }

                if (!!results){
                    req.session.authenticated = true;
                    req.session.user = user;
                    return res.ok(user);
                }
                else {
                    return res.notFound();
                }
            });
        });

    }
};