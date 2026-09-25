const express = require('express');
const router = express.Router();
const { handleAssistantChat } = require('../controllers/assistantController');

// Public route with optional auth decoding inside controller
router.post('/chat', handleAssistantChat);

module.exports = router;
