const express = require('express');
const {DataController} = require('./DataController');

const router = express.Router();


router.get('/get', DataController.findData);
router.get('/filter', DataController.findDataByFilter);  
router.get('/:id', DataController.findDataById);
router.post('/', DataController.addData);
router.delete('/:id', DataController.deleteData);
router.patch('/:id', DataController.patchDataByid);

module.exports = router;