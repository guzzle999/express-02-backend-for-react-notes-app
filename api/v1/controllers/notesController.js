import { Note } from "../../../models/Note.js"


// createNote
export const createNote = async(req, res, next) => {
    const{title, content, tags = []} = req.body

    const userId = req.user._id

    if(!title || !content || !userId) {
        const error = new Error("Title, content and userId are required!")
        error.status = 400;
        return next(error);
    }

    try {
        const note = await Note.create({userId, title, content, tags})
        res.status(201).json({
            error: false,
            note,
            message: "Note created successfully!",
        });
    }   catch (err) {
        next(err)
    }
};

// getNote
export const getNotes = async(req, res, next) => {

    if(!req.user || !req.user._id) {
        const error = new Error("Unauthorized: No user found in request object!");
        error.status = 401;
        return next (error);
    }

    try {
        const notes = await Note.find({userId: req.user._id}).sort({
            createdAt: -1})

        res.status(200).json({
            error: false,
            notes,
            message: "All user's notes retrieved successfully!",
        })
    }   catch (err) {
        next(err)
    }
};

// editNote
export const editNote = async(req, res, next) => {

    const noteId= req.params.id;

    const {title, content, tags} = req.body;

    try {
        const note = await Note.findOne({_id: noteId})
        if(!note) {
            const error = new Error("Note not found!")
            error.status=404;
            return next(error);
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;

        await note.save()

        res.status(201).json({
            error: false,
            note,
            message: "Note updated successfully!",
        });
    }   catch (err) {
        next (err)
    }
};


// deleteNote
export const deleteNote = async(req, res, next) => {
    const noteId = req.params.id

    try {
        const note = await Note.findOne({_id: noteId})

        if(!note) {
            const error= new Error("Note not found!");
            error.status=404;
            return next (error);
        }

        await Note.deleteOne({_id: noteId})
        res.status(200).json({
            error: false,
            message: "Note deleted successfully!",
        })
    }   catch(err) {
        next(err);
    }
};