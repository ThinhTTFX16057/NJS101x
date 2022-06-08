const express = require('express');
const staffInfoCtrl = require('../controllers/info');
const router = express.Router();

// MENU: Staff Info, PATH: /staffinfo
router.get('/', staffInfoCtrl.getStaff);

router.get('/addstaff', staffInfoCtrl.getAddStaff);
router.post('/addstaff', staffInfoCtrl.postAddStaff);

router.get('/editstaff/:companyId', staffInfoCtrl.getEditStaff);
router.post('/editstaff', staffInfoCtrl.postEditStaff);

router.post('/deletestaff', staffInfoCtrl.postDeleteStaff);

module.exports = router;
