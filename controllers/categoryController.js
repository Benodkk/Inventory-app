const Instrument = require('../models/instrument')
const Category = require('../models/category')

const async = require("async");
const { body, validationResult } = require("express-validator");


// Display list of all Categories.
exports.category_list = function (req, res, next) {
    Category.find({}, "name")
      .sort({ name: 1 })
      .exec(function (err, list_categories) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("category_list", { title: "Instrumets List", list: list_categories });
      });
  };

// Display detail page for a specific Category
exports.category_detail = (req, res, next) => {
    async.parallel(
      {
        category(callback) {
          Category.findById(req.params.id).exec(callback);
        },
  
        instruments(callback) {
          Instrument.find({ genre: req.params.id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.category == null) {
          // No results.
          const err = new Error("category not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render
        res.render("category_detail", {
          title: "Category Detail",
          category: results.category,
          instruments: results.instruments,
        });
      }
    );
  };

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};
// Handle category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "category name required")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  (req, res, next) => {

    const errors = validationResult(req);
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];