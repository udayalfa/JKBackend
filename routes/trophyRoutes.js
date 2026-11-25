import express from "express";
import upload from "../middlewares/upload.js";
import { createTrophy, deleteTrophy, getAllTrophies, getFullTrophyByCategory, getHomeTrophies, getTrophyByCategory, getTrophyById, updateTrophy } from "../controllers/TrophyController.js";

const trophyRouter = express.Router();

trophyRouter.post("/", upload.array("images", 5), createTrophy);
trophyRouter.get("/", getAllTrophies);
trophyRouter.get("/home", getHomeTrophies);
trophyRouter.get("/all/:category", getTrophyByCategory);
trophyRouter.get("/allDetails/:category", getFullTrophyByCategory);
trophyRouter.get("/:id", getTrophyById);
trophyRouter.delete("/:id", deleteTrophy);
trophyRouter.put("/:id", upload.array("updatedImages", 5), updateTrophy);

export default trophyRouter;
