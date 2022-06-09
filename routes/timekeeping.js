const express = require('express');
const timekeepingCtrl = require('../controllers/timekeeping');
const router = express.Router();

// MENU: Chấm công, PATH: /timekeeping
router.get('/',timekeepingCtrl.getStaff);

router.get('/checkin/:companyId', timekeepingCtrl.getCheckIn);
router.post('/checkin', timekeepingCtrl.postCheckIn);
//Xem lại trang checkin với dữ liệu mới cập nhật
router.get('/viewcheckin/:companyId',timekeepingCtrl.getViewCheckIn);




router.get('/checkout/:companyId', timekeepingCtrl.getCheckOut)
router.post('/checkout', timekeepingCtrl.postCheckOut);
//Xem lại trang checkout với dữ liệu mới cập nhật
router.get('/viewcheckout/:companyId',timekeepingCtrl.getViewCheckOut);





router.get('/registryleave/:companyId', timekeepingCtrl.getLeave)
router.post('/registryleave', timekeepingCtrl.postLeave);
//Xem lại trang nghỉ phép với dữ liệu mới cập nhật
router.get('/viewleave/:companyId',timekeepingCtrl.getViewLeave);



module.exports = router;
