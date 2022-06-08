const express = require('express');
const covidCtrl = require('../controllers/covid');
const router = express.Router();

// MENU: Covid, PATH: /covid
router.get('/', covidCtrl.getStaff);

router.get('/bodytemperature/:companyId', covidCtrl.getBodyTemperature);
router.post('/bodytemperature', covidCtrl.postBodyTemperature);

router.get('/vaccine/:companyId', covidCtrl.getVaccine);
router.post('/vaccine', covidCtrl.postVaccine);

router.get('/positive/:companyId', covidCtrl.getPositive);
router.post('/positive', covidCtrl.postPositive);

module.exports = router;
