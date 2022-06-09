const express = require('express');
const covidCtrl = require('../controllers/covid');
const router = express.Router();

// MENU: Covid, PATH: /covid
router.get('/', covidCtrl.getStaff);

router.get('/bodytemperature/:companyId', covidCtrl.getBodyTemperature)
router.post('/bodytemperature', covidCtrl.postBodyTemperature);
//Xem lại trang bodytemperature với dữ liệu mới cập nhật
router.get('/viewbodytemp/:companyId', covidCtrl.getViewBodyTemp)



router.get('/vaccine/:companyId', covidCtrl.getVaccine);
router.post('/vaccine', covidCtrl.postVaccine);
//Xem lại trang vaccine với dữ liệu mới cập nhật
router.get('/viewvaccine/:companyId', covidCtrl.getViewVaccine)



router.get('/positive/:companyId', covidCtrl.getPositive);
router.post('/positive', covidCtrl.postPositive);
//Xem lại trang positive với dữ liệu mới cập nhật
router.get('/viewpositive/:companyId', covidCtrl.getViewPositive)



module.exports = router;
