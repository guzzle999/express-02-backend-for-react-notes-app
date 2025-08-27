import { Schema, model } from "mongoose";

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  createdOn: { type: Date, default: new Date().getTime() },
});

export const Note = model("Note", NoteSchema);