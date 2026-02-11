const express = require('express');
const router = express.Router();

const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin manages teachers
router.use(auth, roleCheck('admin'));

router.post('/', asyncHandler(createTeacher));
router.get('/', asyncHandler(getTeachers));
router.get('/:id', asyncHandler(getTeacherById));
router.put('/:id', asyncHandler(updateTeacher));
router.delete('/:id', asyncHandler(deleteTeacher));

module.exports = router;

