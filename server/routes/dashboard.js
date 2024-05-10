const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.viewNote);
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.updateNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteNote);

module.exports = router;