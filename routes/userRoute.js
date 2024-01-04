const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/detail/:id', userController.getUserById);  // Read
router.put('/update/:id', userController.updateUser);  // Update
router.delete('/delete/:id', userController.deleteUser); // Delete
router.get('/getAll', userController.getAllClient);  // GetAll
router.post('/login', userController.login);  // login
router.post('/register', userController.register);   // Create (Register)



module.exports = router