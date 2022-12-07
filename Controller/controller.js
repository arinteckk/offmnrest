const fireAdmin = require('firebase-admin');
require('dotenv').config();

const exp = process.env.exp;

var serviceAccount = {
    type : process.env.type,
    project_id :process.env.project_id,
    private_key_id : process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id : process.env.client_id,
    auth_uri: process.env.auth_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
};


fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});


const db = fireAdmin.firestore();


exports.createMAdminAccount = async (req, res, next) => {
    
    const passCode = req.body['passCode'];
    const displayName = req.body['MAdminName'];

    const users = await db.collection('mAdmin').get();

    var existingUser = users.docs.find((user) => user.data().passcode == passCode);


    if(!existingUser || users.docs.length == 0) {
        fireAdmin.auth()
            .createUser({
                email: `${passCode}@gmail.com`,
                emailVerified: true,
                password: exp,
                displayName: displayName,
            }).then((response) =>{
                db.collection('mAdmin')
                    .doc(response.uid)
                    .set({
                        "uid": response.uid,
                        "type" : "mAdmin",
                        "mAdminName": displayName,
                        "passcode": passCode,
                        "disabled": false
                    });
            res.status(201).json({
                message: `mAdmin created successfully`,
            });
    }).catch((err) =>{
            res.json({
                message: `${err} Error to create mAdmin`,
            });
        });
        
    }else{
        res.json({
            message: `mAdmin already exist`,
        });
    }


}


exports.updateDelivererAccount = async (req, res, next) => {
    
    const userId = req.body['userUid'];
    const passCode = req.body['delivererPassCode'];
    const delivererPhone = req.body['delivererPhone'];
    const displayName = req.body['delivererName'];

    const users = await db.collection('users').get();

    var existingUser = users.docs.find((user) => user.data().uid === userId);

    if(existingUser) {
        fireAdmin.auth().updateUser(userId, {
            email: `${passCode}@gmail.com`,
            password: exp,
            displayName: displayName,
        }).then((response) =>{
            db.collection('users')
                       .doc(userId)
                       .update({
                        "uid": response.uid,
                        "delivererName": displayName,
                        "delivererPhone": delivererPhone,
                        "passcode": passCode
                    });
            res.status(201).json({
                message: `deliverer update successfully`,
            });
    }).catch((err) =>{
            res.json({
                message: `Error to update deliverer ${err}`,
            });
        });
        
    }else{
        res.json({
            message: `Can't update deliverer not found`,
        });
    }


}


exports.createDelivererAccount = async (req, res, next) => {
    
    const passCode = req.body['passCode'];
    const displayName = req.body['delivererName'];
    const delivererPhone = req.body['delivererPhone'];
    const createAt = req.body['createAt'];
    const timestamp = req.body['timestamp'];

    const users = await db.collection('users').get();

    var existingUser = users.docs.find((user) => user.data().delivererPassCode == passCode);

    if(!existingUser || users.docs.length == 0) {
        fireAdmin.auth()
            .createUser({
                email: `${passCode}@gmail.com`,
                emailVerified: true,
                password: exp,
                displayName: displayName,
            }).then((response) =>{
                db.collection('users')
                    .doc(response.uid)
                    .set({
                        "uid": response.uid,
                        "type" : "deliverer",
                        "delivererName": displayName,
                        "delivererPhone": delivererPhone,
                        "createAt" :createAt,
                        "timestamp" :parseInt(timestamp),
                        "passcode": passCode,
                        "disabled": false
                    });
            res.status(201).json({
                message: `deliverer created successfully`,
            });
    }).catch((err) =>{
            res.json({
                message: `${err} Error to create deliverer`,
            });
        });
        
    }else{
        res.json({
            message: `deliverer already exist`,
        });
    }


}


exports.updateAdminData = async(req, res, next) => {
    const userId = req.body['userUid'];
    const adminPassCode = req.body['adminPassCode'];
    const adminFullName = req.body['adminFullName'];
    const adminPhoneNumber = req.body['adminPhoneNumber'];

    const users = await db.collection('users').get();

    var existingUser = users.docs.find((user) => user.data().uid === userId);

    var response = existingUser === undefined ? null : existingUser.data();

            if(existingUser){
             fireAdmin.auth().updateUser(userId, {
                    email: `${adminPassCode}@gmail.com`,
                    password: exp,
                }).then(() => {
                    db.collection('users')
                             .doc(userId)
                             .update({
                                "adminPhoneNumber":adminPhoneNumber,
                                "adminFullName":adminFullName,
                                "adminPassCode" :adminPassCode,
                             });

                     res.status(201).json({
                         message: "Admin updated successfully",
                     });
                })
                .catch((error) => {
                        res.json({
                            message: "Error to update admin",
                            msg: `${error}`,
                        });
                        next(error);
                    });
        
         }else{
            res.json({
                message: "Can't update admin not found",
            });
         }


}



exports.disableAccount = async(req, res, next) => {
    const userId = req.body['userUid'];
    const disabled = req.body['disabled'];

    const users = await db.collection('users').get();

    var existingUser = users.docs.find((user) => user.data().uid === userId);

            if(existingUser){
             fireAdmin.auth().updateUser(userId, {
                   disabled: disabled == "oui" ? true : false
                }).then(() => {
                    db.collection('users')
                             .doc(userId)
                             .update({
                                "disabled": disabled == "oui" ? true : false
                             });

                     res.status(201).json({
                         message: "Admin updated successfully",
                     });
                })
                .catch((error) => {
                        res.json({
                            message: "Error to update admin",
                            msg: `${error}`,
                        });
                        next(error);
                    });
        
         }else{
            res.json({
                message: "Can't update admin not found",
            });
         }


}

exports.disableMAccount = async(req, res, next) => {
    const userId = req.body['userUid'];
    const disabled = req.body['disabled'];

    const users = await db.collection('mAdmin').get();

    var existingUser = users.docs.find((user) => user.data().uid === userId);

            if(existingUser){
             fireAdmin.auth().updateUser(userId, {
                   disabled: disabled == "oui" ? true : false
                }).then(() => {
                    db.collection('mAdmin')
                             .doc(userId)
                             .update({
                                "disabled": disabled == "oui" ? true : false
                             });

                     res.status(201).json({
                         message: "M Admin updated successfully",
                     });
                })
                .catch((error) => {
                        res.json({
                            message: "Error to update M admin",
                            msg: `${error}`,
                        });
                        next(error);
                    });
        
         }else{
            res.json({
                message: "Can't update M admin not found",
            });
         }


}


exports.deleteMAccount = async(req, res, next) =>{
    const userId = req.body['userUid'];
    const users = await db.collection('mAdmin').get();

    var existingUser = users.docs.find((user) => user.data().uid === userId);

    var response = existingUser === undefined ? null : existingUser.data();

    if(existingUser){
        db.collection('mAdmin').doc(userId).delete().then(() =>{
            fireAdmin.auth().deleteUser(userId)
            .then((response) =>{
                return res.status(201).json({
                    message: `M Admin deleted`,
                    response: response,
                });
            }).catch((err) =>{
                return res.json({
                    message: `Error to deleted M Admin`,
                    response: response,
                });
            })
        }).catch((err) =>{
            return res.status(503).json({
                message: `Error to deleted M Admin`,
                response: err,
            });
        })
    }else{
        res.json({
            message: `M Admin not exist`,
        });
    }

}

exports.deleteAccount = async(req, res, next) =>{
    const userId = req.body['userUid'];
    const users = await db.collection('users').get();

    var existingUser = users.docs.find((user) => user.data().uid === userId);

    var response = existingUser === undefined ? null : existingUser.data();

    if(existingUser){
        db.collection('users').doc(userId).delete().then(() =>{
            fireAdmin.auth().deleteUser(userId)
            .then((response) =>{
                return res.status(201).json({
                    message: `Admin deleted`,
                    response: response,
                });
            }).catch((err) =>{
                return res.json({
                    message: `Error to deleted Admin`,
                    response: response,
                });
            })
        }).catch((err) =>{
            return res.status(503).json({
                message: `Error to deleted Admin`,
                response: err,
            });
        })
    }else{
        res.json({
            message: `Admin not exist`,
        });
    }

}

exports.createAdmin = async (req, res, next) => {
    const adminPassCode = req.body['adminPassCode'];
    const adminFullName = req.body['adminFullName'];
    const adminPhoneNumber = req.body['adminPhoneNumber'];
    const createAt = req.body['createAt'];
    const timestamp = req.body['timestamp'];

    const users = await db.collection('users').get();

    var existingUser = users.docs.find((user) => user.data().adminPassCode == adminPassCode);

    var response = existingUser == undefined ? null : existingUser.data();


    if(!existingUser || users.docs.length == 0) {
        fireAdmin.auth()
            .createUser({
                email: `${adminPassCode}@gmail.com`,
                emailVerified: true,
                password: exp
            }).then((response) =>{

                db.collection('users')
                    .doc(response.uid)
                    .set({
                        "uid": response.uid,
                        "adminPhoneNumber":adminPhoneNumber,
                        "adminFullName":adminFullName,
                        "adminPassCode" :adminPassCode,
                        "createAt" :createAt,
                        "timestamp" :parseInt(timestamp),
                        "type" : "admin",
                        "sendDocCount" :0,
                        "disabled" : false,
                        "paidMenuPriceOnLine":true,
                        "paidDelivererFeesOnLine":true
                    });

            res.status(201).json({
                message: "created successfully",
                id:response.uid
            });
    }).catch((err) =>{
            res.json({
                message: `${err} Error to create admin`,
            });
        });
        
    }else{
        res.json({
            message:"admin already exist",
        });
    }


}




  