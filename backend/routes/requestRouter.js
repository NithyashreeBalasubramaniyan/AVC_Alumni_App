// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/auth');

router.post('/request-post', authenticateToken, requestController.createPostRequest);
router.get('/requests', authenticateToken, requestController.getAllRequests);
router.put('/request/status', authenticateToken, requestController.updatePostRequestStatus);

module.exports = router;
