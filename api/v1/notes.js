import express from "express";
import { createNote, deleteNote, editNote, getNotes } from "./controllers/notesController.js";

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

// Declare a simple array called “members” to temporarily store members
// let notes = [];

// Route to handle POST requests to create a new post
router.post("/notes", createNote);
// router.post("/notes", (req, res, next) => {
//   try {
//     const { title, content, tags = [] } = req.body;

//     if(!title || !content) {
//         const error = new Error("Title and content are required.");
//         error.status = 400;
//         return next(error);
//     }

//     // Example: Save the post to a data store
//     const newNote = {
//       id: String(notes.length + 1),
//       title: title,
//       content: content,
//       tags: tags,
//     };

//     notes.push(newNote);

//     res.status(201).json(newNote);
//   } catch (err) {
//     next(err);
//   }
// });

// Route to handle GET requests to read posts

router.get("/notes", getNotes);
// router.get("/notes", (req, res, next) => {
//   try {
//     res.status(200).json(notes);
//   } catch (err) {
//     next(err);
//   }
// });

router.delete("/notes/:id", deleteNote);
// router.delete("/notes/:id", (req, res, next) => {
//   try {
//     const noteId = req.params.id;

//     const noteIndex = notes.findIndex((note) => note.id === noteId);

//     if (noteIndex !== -1) {
//       notes.splice(noteIndex, 1);

//       res.status(200).send(`Note with ID ${noteId} deleted successfully.`);
//     } else {
//       const error = new Error("Note not found.");
//       error.status=404;
//       return next(error);
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// Route to handle PUT requests to update a member

router.put("/notes/:id", editNote);
// router.put("/notes/:id", (req, res, next) => {
//   try {
//     const noteId = req.params.id;
//     const { title, content, tags } = req.body;

//     const note = notes.find((n) => n.id === noteId);

//     if (note) {
//       if (title !== undefined) note.title = title;
//       if (content !== undefined) note.content = content;
//       if (tags !== undefined) note.tags = tags;

//       res.status(200).json(note);
//     } else {
//       const error = new Error("Note not found.");
//       error.status = 404;
//       return next(error);
//     }
//   } catch (err) {
//     next(err);
//   }
// });

export default router;