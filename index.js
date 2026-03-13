const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

app.get("/", (req, res) => {
    res.send("Welcome to Notes API");
});

let notes = [
    { id: 1, title: "Study", content: "Study for GATE" },
    { id: 2, title: "Exercise", content: "Go for 30 min exercise" },
    { id: 3, title: "Coding", content: "Code for 2 hours" },
    { id: 4, title: "Painting", content: "Paint when free time" }
];

//Get all notes
app.get("/notes", (req, res) => {
    res.json(notes);
});

//Get notes by id
app.get("/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const note = notes.find(n => n.id === id);
    if (!note)
        return res.status(404).send(`Note with id ${id} not found!`);

    res.json(note);
});

//Create new note
app.post("/notes", (req, res) => {
    const body = req.body || {};
    console.log("POST body:", body);

    if (!body.title || !body.content) {
        return res.status(400).send("Bad Request: Missing title or content. Ensure Content-Type is application/json in Hoppscotch.");
    }

    const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;

    const newNote = {
        id: newId,
        title: body.title,
        content: body.content
    };

    notes.push(newNote);
    res.json(newNote);
});

//Update an existing note
app.put("/notes/:id", (req, res) => {
    const body = req.body || {};
    console.log("PUT body:", body);

    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);

    if (!note) {
        return res.status(404).send("Note not found");
    }

    if (body.title === undefined && body.content === undefined) {
        return res.status(400).send("Bad Request: Please provide title or content to update. Ensure Content-Type is application/json in Hoppscotch.");
    }

    note.title = body.title !== undefined ? body.title : note.title;
    note.content = body.content !== undefined ? body.content : note.content;

    res.json(note);
});

//Delete a note
app.delete("/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);
    if (!note) {
        return res.status(404).send(`Note at id ${id} not found!`);
    }
    notes = notes.filter(n => n.id !== id);
    res.send("Note deleted successfully!");
});