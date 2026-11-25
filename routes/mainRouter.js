const express = require("express");
const authRouter = require("./authRouter");
const { default: contactRouter } = require("./contactRouter");
const { default: trophyRouter } = require("./trophyRoutes");

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/trophy", trophyRouter);
mainRouter.use("/contact", contactRouter);

module.exports = mainRouter;
