const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getMySwapRequests,
  respondSwapRequest,
  cancelSwapRequest
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createSwapRequest)
  .get(getMySwapRequests);

router.put('/:id/respond', respondSwapRequest);
router.delete('/:id', cancelSwapRequest);

module.exports = router;
