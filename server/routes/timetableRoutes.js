const express = require('express');
const router = express.Router();

const {
  createTimetable,
  getTimetablesByClass,
  updateTimetable,
  deleteTimetable,
} = require('../controllers/timetableController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin and teachers manage timetables
router.post('/', auth, roleCheck('admin', 'teacher'), asyncHandler(createTimetable));
router.get('/class/:classId', auth, asyncHandler(getTimetablesByClass));
router.put('/:id', auth, roleCheck('admin', 'teacher'), asyncHandler(updateTimetable));
router.delete('/:id', auth, roleCheck('admin'), asyncHandler(deleteTimetable));

module.exports = router;

