import express from "express";
import { createNote, deleteNote, editNote, getNotes } from "./controllers/notesController.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res
      .status(200)
      .send(
        "Hello!, this is an Express API server for a Notes App build with React."
      );
  } catch (err) {
    next(err);
  }
});

// CRUD notes routes

router.post("/notes", authUser, createNote);

router.get("/notes", authUser, getNotes);

router.delete("/notes/:id", deleteNote);

router.put("/notes/:id", editNote);

export default router;