const composer = document.getElementById("composer");
const composerForm = document.getElementById("composerForm");
const composerTitle = document.getElementById("composerTitle");
const composerBody = document.getElementById("composerBody");
const composerCloseBtn = document.getElementById("composerCloseBtn");

const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const emptyStateText = document.getElementById("emptyStateText");

const searchInput = document.getElementById("searchInput");

const noteTemplate = document.getElementById("noteCardTemplate");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCloseBtn = document.getElementById("modalCloseBtn");

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastActionBtn = document.getElementById("toastActionBtn");


let notes = [];

let currentFilter = "notes";

let editingNoteId = null;

let deletedNote = null;



const STORAGE_KEY = "google-keep-clone";



function init() {

    loadNotes();

    renderNotes();

}

init();



function loadNotes() {

    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (savedNotes) {

        notes = JSON.parse(savedNotes);

    }

}



function saveNotes() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
    );

}

function renderNotes() {

    console.log("Notes:", notes);

}