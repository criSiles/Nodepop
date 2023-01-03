"use strict";

const express = require("express");
const createError = require("http-errors");
const Advertisement = require("../../models/Advertisement");

const router = express.Router();

// POST /api/advertisements (body=adData)
// Create an advertisement
router.post("/", async (req, res, next) => {
  try {
    const adData = req.body;

    // making a new ad in memory
    const ad = new Advertisement(adData);

    // save the ad in the db
    const adSaved = await ad.save();

    res.json({ result: adSaved });
  } catch (err) {
    next(err);
  }
});

// GET /api/agentes
// Devuelve una lista de agentes
router.get("/", async (req, res, next) => {
  try {
    // filtros
    const name = req.query.name;
    const sale = req.query.sale;
    const price = req.query.price;
    const photo = req.query.photo;
    const tags = req.query.tags;

    // paginación
    const skip = req.query.skip;
    const limit = req.query.limit;
    // selección de campos
    const fields = req.query.fields; // /api/agentes?fields=name -_id
    // ordenación
    const sort = req.query.sort; // /api/agentes?sort=age%20name

    const filter = {};

    if (name) {
      // /api/advertisements?name=Smith
      filter.name = name;
    }

    if (sale) {
      // /api/advertisements?sale=bike
      filter.sale = sale;
    }

    if (price) {
      // /api/advertisements?price=23
      filter.price = price;
    }

    if (photo) {
      // /api/advertisements?photo= ¿?¿?
      filter.photo = photo;
    }

    if (tags) {
      // /api/advertisements?tags= lifestyle
      filter.tags = tags;
    }

    const agentes = await Advertisement.lista(
      filter,
      skip,
      limit,
      fields,
      sort
    );
    res.json({ results: agentes });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
