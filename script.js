// ================================
// Google Keep Clone
// Part 1
// ================================

const composer = document.getElementById("composer");
const composerTitle = document.getElementById("composerTitle");
const composerBody = document.getElementById("composerBody");
const composerCloseBtn = document.getElementById("composerCloseBtn");

const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const emptyStateText = document.getElementById("emptyStateText");

const searchInput = document.getElementById("searchInput");

const noteTemplate = document.getElementById("noteCardTemplate");

const STORAGE_KEY = "google-keep-clone";

let notes = [];
let currentFilter = "notes";

// ================================
// Local Storage
// ================================

function loadNotes() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        notes = JSON.parse(saved);
    }
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ================================
// Create Note
// ================================

function createNote(title, body) {

    const note = {
        id: crypto.randomUUID(),
        title,
        body,
        archived: false,
        createdAt: Date.now()
    };

    notes.unshift(note);

    saveNotes();

    renderNotes();

}

// ================================
// Render Notes
// ================================

function renderNotes() {

    notesGrid.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    const filtered = notes.filter(note => {

        const view =
            note.archived === (currentFilter === "archive");

        const matches =
            note.title.toLowerCase().includes(search) ||
            note.body.toLowerCase().includes(search);

        return view && matches;

    });

    if (filtered.length === 0) {

        emptyState.hidden = false;

        emptyStateText.textContent =
            currentFilter === "archive"
                ? "Your archived notes appear here"
                : "Notes you add appear here";

        return;
    }

    emptyState.hidden = true;

    filtered.forEach(note => {

        const clone = noteTemplate.content.cloneNode(true);

        clone.querySelector(".note-card__title").textContent =
            note.title;

        clone.querySelector(".note-card__body").textContent =
            note.body;

        clone.querySelector(".note-card__date").textContent =
            new Date(note.createdAt).toLocaleDateString();

        const archiveBtn = clone.querySelector(".note-card__archive");
const unarchiveBtn = clone.querySelector(".note-card__unarchive");
const deleteBtn = clone.querySelector(".note-card__delete");

if (note.archived) {
    archiveBtn.hidden = true;
    unarchiveBtn.hidden = false;
}

archiveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    archiveNote(note.id);
});

unarchiveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    unarchiveNote(note.id);
});

deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteNote(note.id);
});

notesGrid.appendChild(clone);

}

// ================================
// Archive / Unarchive
// ================================

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

// ================================
// Delete Note
// ================================

function deleteNote(id) {

    notes = notes.filter(note => note.id !== id);

    saveNotes();

    renderNotes();

}

// ================================
// Open Composer
// ================================

composerBody.addEventListener("focus", () => {

    composer.classList.add("is-open");

});

// ================================
// Save Note
// ================================

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

// ================================
// Search
// ================================

searchInput.addEventListener("input", () => {

    renderNotes();

});

// ================================
// Sidebar
// ================================

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