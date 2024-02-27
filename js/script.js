// Elements
const notesContainer = document.querySelector("#notes-container");

const noteInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-input");

const exportBtn = document.querySelector("#exports-notes");

// Functions
function showNotes() {
    cleanNotes();

    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);
        notesContainer.appendChild(noteElement);
    });
}

function cleanNotes() {
    notesContainer.replaceChildren([]);
}

function addNote() {

    const notes = getNotes();

    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);

    noteInput.value = "";
}

function generateId() {
    return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed) {
    const div = document.createElement("div");
    
    div.classList.add("note");

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.placeholder = "Adicione algum texto...";

    div.appendChild(textarea);

    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi","bi-pin"]);

    div.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi","bi-x-lg"]);

    div.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi","bi-file-earmark-plus"]);

    div.appendChild(duplicateIcon);

    if (fixed){
        div.classList.add("fixed");
    }

    //Events in div
    div.querySelector("textarea").addEventListener("keyup", (e) => {
        const noteContent = e.target.value;

        updateNote(id, noteContent);
    })

    div.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    })

    div.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, div);
    })

    div.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id);
    })

    return div;
}

function toggleFixNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);

    notesContainer.removeChild(element);
}

function copyNote(id) {
    const notes = getNotes();
    
    const targetElement = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: generateId(),
        content: targetElement.content,
        fixed: false,
    };

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);
}

function updateNote(id, newContent) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id ===id)[0];

    targetNote.content = newContent;

    saveNotes(notes);
}

function exportData() {
    const notes = getNotes();

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ].map((e) => e.join(",")).join("\n");

    const element = document.createElement("a");

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";

    element.download = "notes.csv";

    element.click();
}

// Local Storage
function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
    
    return orderedNotes;
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function searchNotes(search) {
    const searchResults = getNotes().filter((note) => note.content.includes(search));

    if (search !== ""){
        cleanNotes();

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content);
            notesContainer.appendChild(noteElement);
        })

        return;
    }

    cleanNotes();

    showNotes();
}

// Events
addNoteBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    searchNotes(search);
})

noteInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") addNote();
})

exportBtn.addEventListener("click", () => {
    exportData();
})

// Initialize
showNotes();