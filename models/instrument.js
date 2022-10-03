const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true},
    category: { type: Schema.Types.ObjectId, required: true, ref: "Category"},
    price: { type: String, required: true},
    nrInStock: { type: Number, required: true},
});

// Virtual for instrument's URL
InstrumentSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/instrument/${this._id}`;
});

// Export model
module.exports = mongoose.model("Instrument", InstrumentSchema);