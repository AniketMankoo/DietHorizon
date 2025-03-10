const express = require("express");
const { userSeeAll, userSeeOne, userCreate, userUpdate, userDelete } = require("./user.controller");

const router = express.Router();

router.get("/", userSeeAll);
router.get("/:id", userSeeOne);
router.post("/", userCreate);
router.put("/:id", userUpdate);
router.delete("/:id", userDelete);

module.exports = router;
