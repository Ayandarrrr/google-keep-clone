const composer = document.getElementById("composer");
const composerTitle = document.getElementById("composerTitle");
const composerBody = document.getElementById("composerBody");
const composerCloseBtn = document.getElementById("composerCloseBtn");

const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const emptyStateText = document.getElementById("emptyStateText");

const noteTemplate = document.getElementById("noteCardTemplate");

let notes = [];
let currentFilter = "notes";

const STORAGE_KEY = "google-keep-clone";

/* --------------------------
   INITIALIZE
-------------------------- */

function init() {
    loadNotes();
    renderNotes();
}

init();

/* --------------------------
   LOCAL STORAGE
-------------------------- */

function loadNotes() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        notes = JSON.parse(saved);
    }
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/* --------------------------
   CREATE NOTE
-------------------------- */

function createNote(title, body) {

    const note = {
        id: crypto.randomUUID(),
        title,
        body,
        createdAt: Date.now(),
        archived: false,
        color: "default"
    };

    notes.unshift(note);

    saveNotes();

    renderNotes();
}

/* --------------------------
   RENDER NOTES
-------------------------- */

function renderNotes() {

    notesGrid.innerHTML = "";

    const filteredNotes = notes.filter(note =>
        note.archived === (currentFilter === "archive")
    );

    if (filteredNotes.length === 0) {

        emptyState.hidden = false;

        emptyStateText.textContent =
            currentFilter === "archive"
                ? "Your archived notes appear here"
                : "Notes you add appear here";

        return;
    }

    emptyState.hidden = true;

    filteredNotes.forEach(note => {

        const noteElement = noteTemplate.content.cloneNode(true);

        noteElement.querySelector(".note-card__title").textContent = note.title;

        noteElement.querySelector(".note-card__body").textContent = note.body;

        noteElement.querySelector(".note-card__date").textContent =
            new Date(note.createdAt).toLocaleDateString();

        const archiveBtn =
            noteElement.querySelector(".note-card__archive");

        const unarchiveBtn =
            noteElement.querySelector(".note-card__unarchive");

        if (note.archived) {
            archiveBtn.hidden = true;
            unarchiveBtn.hidden = false;
        } else {
            archiveBtn.hidden = false;
            unarchiveBtn.hidden = true;
        }

        archiveBtn.addEventListener("click", () => {
            archiveNote(note.id);
        });

        unarchiveBtn.addEventListener("click", () => {
            unarchiveNote(note.id);
        });

        notesGrid.appendChild(noteElement);

    });

}

/* --------------------------
   ARCHIVE
-------------------------- */

function archiveNote(id) {

    const note = notes.find(note => note.id === id);

    if (!note) return;

    note.archived = true;

    saveNotes();

    renderNotes();

}

function unarchiveNote(id) {

    const note = notes.find(note => note.id === id);

    if (!note) return;

    note.archived = false;

    saveNotes();

    renderNotes();

}

/* --------------------------
   COMPOSER
-------------------------- */

composerBody.addEventListener("focus", () => {
    composer.classList.add("is-open");
});

composerCloseBtn.addEventListener("click", () => {

    const title = composerTitle.value.trim();
    const body = composerBody.value.trim();

    if (!title && !body) {
        composer.classList.remove("is-open");
        return;
    }

    createNote(title, body);

    composerTitle.value = "";
    composerBody.value = "";

    composer.classList.remove("is-open");

});

/* --------------------------
   SIDEBAR
-------------------------- */

document.querySelectorAll(".sidebar__item").forEach(button => {

    button.addEventListener("click", () => {

        if (!button.dataset.view) return;

        currentFilter = button.dataset.view;

        document.querySelectorAll(".sidebar__item").forEach(item => {
            item.classList.remove("is-active");
        });

        button.classList.add("is-active");

        renderNotes();

    });

});