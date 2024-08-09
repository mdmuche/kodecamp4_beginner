var express = require("express");
const { isUserLoggedIn } = require("../middleware/checkIfUserLoggedIn");
const { noteCollection } = require("../model/noteModel");
const { userCollection } = require("../model/userModel");
var router = express.Router();

router.use(isUserLoggedIn);

router.post("/", async (req, res, next) => {
  try {
    const { title, body } = req.body;

    await noteCollection.create({ owner: req.userDetails.userId, title, body });

    res.status(201).send({
      message: "note created",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const notes = await noteCollection.find({});

    if (notes.length == 0) {
      res.status(404).send({ message: "no note found" });
      return;
    }

    res.send({
      notes,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    const profile = await userCollection.findById(
      req.userDetails.userId,
      "-password"
    );

    res.send({
      profile,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await noteCollection.findById(id);

    res.send({ note });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;

    const noteDetails = await noteCollection.findById(id);

    // if (req.userDetails.userId != noteDetails.owner.toString()) {
    //   res
    //     .status(401)
    //     .send({ message: "you are not authorized to take this action" });
    //   return;
    // }

    const note = await noteCollection.findByIdAndUpdate(
      id,
      {
        title,
        body,
      },
      { new: true }
    );

    res.status(200).send({
      message: "note updated sucessfully!",
      note,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // if (req.userDetails.userId != noteDetails.owner.toString()) {
    //   res
    //     .status(401)
    //     .send({ message: "you are not authorized to take this action" });
    //   return;
    // }

    const note = await noteCollection.findByIdAndDelete(id);

    res.status(200).send({
      message: "note deleted sucessfully!",
      note,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
