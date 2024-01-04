const express = require('express')
const router = express.Router();
const commentController = require('../controllers/commentController');
const middleware = require('../middleware/middleware');

router.put('/update/:id', middleware.isAdmin, commentController.updateComment); // Update
router.delete('/delete/:id', middleware.isAdmin, commentController.deleteComment); // Delete
router.get('/getAll', middleware.authenticator, commentController.getAllComments); // GetAll
router.post('/add', middleware.isReporterOrAdmin, commentController.createComment); //Create comment
router.get('/techno/:id', middleware.authenticator, commentController.getCommentByTechnoId); //Get comment by techno id
router.get('/user/:id', middleware.authenticator, commentController.getCommentByUserId); //Get techno by user id
router.get('/date/:date', middleware.authenticator, commentController.getCommentAfterDate); //get techno after

module.exports = router