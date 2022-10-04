const Instrument = require('../models/instrument')
const Category = require('../models/category')

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
    async.parallel(
        {
          instrument_count(callback) {
            Instrument.countDocuments({}, callback);
          },
          category_count(callback) {
            Category.countDocuments({}, callback);
          },
        },
        (err, results) => {
          res.render("index", {
            title: "Musical-instruments inventory",
            error: err,
            data: results,
          });
        }
      );
  };

// Display list of all Instruments.
exports.instrument_list = function (req, res, next) {
  Instrument.find({}, "name price")
    .sort({ name: 1 })
    .exec(function (err, list_instruments) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("instrument_list", { title: "Instrumets List", list: list_instruments });
    });
};

// Display detail page for a specific instrument.
exports.instrument_detail = (req, res, next) => {
  Instrument.findById(req.params.id)
    .populate("category")
    .exec(function(err, instrument){
      if (err) {
        return next(err);
      }
      if (instrument == null) {
        // No results.
        const err = new Error("instrument not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("instrument_detail", {
        title: instrument.name,
        instrument: instrument,
      });
    } );

};

// Display instrument create form on GET.
exports.instrument_create_get = (req, res, next) => {
  Category.find()
    .exec((err, categories) => {
      if (err) {
        return next(err);
      }
      res.render("instrument_form", {
        title: "Create instrument",
        categories: categories,
      });
    });
};
// Display instrument create form on POST.
exports.instrument_create_post = [
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Instrument should have category.")
    .isLength({ min: 1 })
    .escape(),    
  body("price", "Instrument should have price.")
    .trim()
    .isLength({ min: 1 })
    .escape(),    
  body("nrInStock", "How many of this instrument is on stock?")
    .trim()
    .isLength({ min: 1 })
    .escape(),  
    (req, res, next) => {
      const errors = validationResult(req);

      const instrument = new Instrument({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        nrInStock: req.body.nrInStock,        
      });
      if(!errors.isEmpty()){
        Category.find({}, "name")
        .exec((err, categories) => {
          if (err) {
            return next(err);
          }
          res.render("instrument_form", {
            title: "Create instrument",
            categories: categories,
            instrument,
            errors: errors.array(),
          });
        });
      }
      
      // Data from form is valid. Save instrument.
      instrument.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful: redirect to new instrument record.
        res.redirect(instrument.url);
      });
    }
]

// Display book delete form on GET.
exports.instrument_delete_get = (req, res, next) => { 
  Instrument.findById(req.params.id)
    .exec((err, instrument) => {
      if (err) {
        return next(err);
      }
      if (instrument == null) {
        // No results.
        res.redirect("/catalog/instruments");
      }
      // Successful, so render.
      res.render("instrument_delete", {
        title: "Delete Instrument",
        instrument: instrument
      });
    });
};

// Handle instrument delete on POST.
exports.instrument_delete_post = (req, res, next) => {
  Instrument.findById(req.params.id)
  .exec((err, instrument) => {
    if (err) {
      return next(err);
    }
    if (instrument == null) {
      // No results.
      res.redirect("/catalog/instruments");
    }

    Instrument.findByIdAndRemove(req.body.instrumentid, (err) => {
      if (err) {
        return next(err);
      }
      // Success - go to instrument list
      res.redirect("/catalog/instruments");
    });
  })
};

// Display instrument update form on GET.
exports.instrument_update_get = (req, res, next) => {
  async.parallel(
    {
      instrument(callback){
        Instrument.findById(req.params.id)
        .populate("category")
        .exec(callback)
      },
      categories(callback) {
        Category.find(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }  
      if (results.instrument == null) {
        // No results.
        const err = new Error("Instrument not found");
        err.status = 404;
        return next(err);
      }   
      res.render("instrument_form", {
        title: "Update Instrument",
        categories: results.categories,
        instrument: results.instrument,
      });
    }
  )
}

// Handle instrument update on POST.
exports.instrument_update_post = [
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Instrument should have category.")
    .isLength({ min: 1 })
    .escape(),    
  body("price", "Instrument should have price.")
    .trim()
    .isLength({ min: 1 })
    .escape(),    
  body("nrInStock", "How many of this instrument is on stock?")
    .trim()
    .isLength({ min: 1 })
    .escape(),  
    (req, res, next) => {
      const errors = validationResult(req);

      const instrument = new Instrument({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        nrInStock: req.body.nrInStock,  
        _id: req.params.id,      
      });
      if(!errors.isEmpty()){
        Category.find({}, "name")
        .exec((err, categories) => {
          if (err) {
            return next(err);
          }
          res.render("instrument_form", {
            title: "Create instrument",
            categories: categories,
            instrument,
            errors: errors.array(),
          });
        });
      }
      // Data from form is valid. Update the record.
      Instrument.findByIdAndUpdate(req.params.id, instrument, {}, (err, theinstrument) => {
        if (err) {
          return next(err);
        }

        // Successful: redirect to instrument detail page.
        res.redirect(theinstrument.url);
      });
    }
]
