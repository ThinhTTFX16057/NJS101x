const express = require('express');
const workingHoursCtrl = require('../controllers/workingHours');
const router = express.Router();

// MENU: Tra cuu gio lam, PATH: /workinghours
router.get('/',workingHoursCtrl.getStaff);

router.get('/info/:companyId', workingHoursCtrl.getInfo);
// router.post('/info', workingHoursCtrl.postConfirm);


// router.get('/salary/:companyId', workingHoursCtrl.getSalary)
//router.post('/getsalary', workingHoursCtrl.postSalary);

module.exports = router;
 