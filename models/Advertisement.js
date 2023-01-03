"use strict";

const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  name: String,
  sale: Boolean,
  price: Number,
  photo: String,
  tags: [String],
});

advertisementSchema.statics.lista = function (
  filter,
  skip,
  limit,
  fields,
  sort
) {
  const query = Advertisement.find(filter);
  query.skip(skip);
  query.limit(limit);
  query.select(fields);
  query.sort(sort);
  return query.exec();
};

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

// exportar el modelo
module.exports = Advertisement;
