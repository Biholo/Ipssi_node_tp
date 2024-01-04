const express = require('express')
const router = express.Router();
const technoController = require('../controllers/technoController');
const middleware = require('../middleware/middleware');

// Routes Techno
router.post('/add', middleware.isAdmin, technoController.createTechno); // Create
router.get('/detail/:id', technoController.getTechnoById); // Read
router.put('/update/:id', middleware.isAdmin, technoController.updateTechno); // Update
router.delete('/delete/:id', middleware.isAdmin, technoController.deleteTechno); // Delete
router.get('/getAll', technoController.getAllTechnos); // GetAll


module.exports = router