import express from "express";
import cors from "cors";


const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ], // frontend domain
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res, next) => {
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

let notes = [];

app.post("/notes", (req, res, next) => {
  try {
    const { title, content, tags = [] } = req.body;
    const newNote = {
      id: String(notes.length + 1),
      title: title,
      content: content,
      tags: tags,
    };

    notes.push(newNote);

    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
});

app.get("/notes", (req, res, next) => {
  try {
    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
});

app.delete("/notes/:id", (req, res, next) => {
  try {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      return res.status(200).json(`Note with ID ${noteId} Deleted`);
    }

    res.status(404).json("Note not found");
  } catch (error) {
    next(error);
  }
});

app.put("/notes/:id", (req, res, next) => {
  try {
    const noteId = req.params.id;
    const { title, content, tags } = req.body;

    const note = notes.find((n) => n.id === noteId);

    if (note) {
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      if (tags !== undefined) note.tags = tags;

      res.status(200).json(note);
    } else {
      res.status(404).send("Note not find");
    }
  } catch (error) {
    next(error);
  }
});


// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = 3001;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});


