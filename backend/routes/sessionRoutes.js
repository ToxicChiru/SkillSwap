const express = require('express');
const router = express.Router();
const {
  createSession,
  getMySessions,
  completeSession,
  cancelSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createSession)
  .get(getMySessions);

router.put('/:id/complete', completeSession);
router.put('/:id/cancel', cancelSession);

module.exports = router;
