const express = require('express');
const workingHoursCtrl = require('../controllers/workingHours');
const router = express.Router();

// MENU: Tra cuu gio lam, PATH: /workinghours
router.get('/',workingHoursCtrl.getStaff);


router.get('/uploaddata/:companyId', workingHoursCtrl.uploadData);
//Xem lại trang với dữ liệu mới cập nhật
router.get('/viewinfo/:companyId',workingHoursCtrl.getViewInfo);
router.get('/viewsalary/:companyId',workingHoursCtrl.getViewSalary);
router.get('/searchinfo/:companyId',workingHoursCtrl.getViewSearchInfo);
router.get('/searchsalary/:companyId',workingHoursCtrl.getViewSearchSalary);

router.get('/error/:companyId',workingHoursCtrl.getSearchError);

module.exports = router;
 