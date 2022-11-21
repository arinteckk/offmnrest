const express = require('express');
const ctrl = require('../Controller/controller');

const router = express.Router();


router.post('/createAdmin', ctrl.createAdmin);

router.post('/deleteAccount',ctrl.deleteAccount);

router.post('/updateAdmin',ctrl.updateAdminData);

router.post('/disabelAccount',ctrl.disableAccount);

router.post('/createMAdminAccount',ctrl.createMAdminAccount);

router.post('/createDelivererAccount',ctrl.createDelivererAccount);
router.post('/updateDelivererAccount',ctrl.updateDelivererAccount);

router.post('/disableMAccount',ctrl.disableMAccount);

router.post('/deleteMAccount',ctrl.deleteMAccount);

module.exports = router;