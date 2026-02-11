const express = require('express');
const router = express.Router();

const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { auth, roleCheck } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// Admin manages subjects
router.use(auth, roleCheck('admin'));

router.post('/', asyncHandler(createSubject));
router.get('/', asyncHandler(getSubjects));
router.get('/:id', asyncHandler(getSubjectById));
router.put('/:id', asyncHandler(updateSubject));
router.delete('/:id', asyncHandler(deleteSubject));

module.exports = router;

