const express = require('express');
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin manages students
router.use(auth, roleCheck('admin'));

router.post('/', asyncHandler(createStudent));
router.get('/', asyncHandler(getStudents));
router.get('/:id', asyncHandler(getStudentById));
router.put('/:id', asyncHandler(updateStudent));
router.delete('/:id', asyncHandler(deleteStudent));

module.exports = router;

