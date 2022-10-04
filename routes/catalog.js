const express = require("express");
const router = express.Router();

const instrument_controller=require('../controllers/instrumentController')
const category_controller=require('../controllers/categoryController')

// GET catalog home page.
router.get("/", instrument_controller.index);

// GET request for creating a Book.
router.get("/instrument/create", instrument_controller.instrument_create_get);

// POST request for creating Book.
router.post("/instrument/create", instrument_controller.instrument_create_post);

// GET request to delete instrument.
router.get("/instrument/:id/delete", instrument_controller.instrument_delete_get);

// POST request to delete instrument.
router.post("/instrument/:id/delete", instrument_controller.instrument_delete_post);

// GET request to update instrument.
router.get("/instrument/:id/update", instrument_controller.instrument_update_get);

// POST request to update instrument.
router.post("/instrument/:id/update", instrument_controller.instrument_update_post);

// GET request for one instrument 
router.get("/instrument/:id", instrument_controller.instrument_detail);

// GET request for list of all Instruments items.
router.get("/instruments", instrument_controller.instrument_list);





// GET request for creating a Book.
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Book.
router.post("/category/create", category_controller.category_create_post);

// GET request for creating a Book.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request for creating Book.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request for creating a Book.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request for creating Book.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for list of all categories.
router.get("/categories", category_controller.category_list);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);



module.exports = router;
