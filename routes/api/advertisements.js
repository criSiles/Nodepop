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

// GET /api/advertisements
// Return a list of ads
router.get("/", async (req, res, next) => {
  try {
    // filters
    const name = req.query.name;
    const sale = req.query.sale;
    const price = req.query.price;
    const photo = req.query.photo;
    const tags = req.query.tags;

    // pagination
    const skip = req.query.skip;
    const limit = req.query.limit;
    // select fields
    const fields = req.query.fields; // /api/agentes?fields=name -_id
    // sort
    const sort = req.query.sort; // /api/agentes?sort=age%20name

    const filter = {};

    if (name) {
      // /api/advertisements?name=bike
      filter.name = name;
    }

    if (sale) {
      // /api/advertisements?sale=true
      filter.sale = sale;
    }

    if (price) {
      // /api/advertisements?price=23
      filter.price = price;
    }

    if (photo) {
      // /api/advertisements?photo=public/images/name.jpg?
      filter.photo = photo;
    }

    if (tags) {
      // /api/advertisements?tags= lifestyle
      filter.tags = tags;
    }

    const adList = await Advertisement.lista(
      filter,
      skip,
      limit,
      fields,
      sort
    );
    console.log(adList);

    // print how many agents are in the database
    const total = await Advertisement.countDocuments();
    console.log(`Hay ${total} agentes en la base de datos`);

    // res.json({ results: adList });
    res.render("listItems", {items: adList})
  } catch (err) {
    next(err);
  }
});

module.exports = router;
