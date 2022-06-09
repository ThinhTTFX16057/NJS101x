const express = require('express');
const searchCtrl = require('../controllers/search');
const router = express.Router();

// MENU: Search, PATH: /search
router.get('/',searchCtrl.getSearch);
router.post('/',searchCtrl.postSearch);
router.get('/keyword/:companyId',searchCtrl.searchWithKeywords);

module.exports = router;
 