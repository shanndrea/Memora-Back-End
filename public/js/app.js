'use strict';

// Import modules
import { addEventOnElements, getGreetingMsg, activeNotebook, makeElemEditable } from "./utils.js";
import { Tooltip } from "./Tooltip.js";
import { db } from "./db.js"; // Pastikan db.js sudah diubah untuk menggunakan MongoDB
import { client } from "./client.js";
import { NoteModal } from "./Modal.js";

// Toggle sidebar visibility on small screens
const $sidebar = document.querySelector('[data-sidebar]');
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const $overlay = document.querySelector('[data-sidebar-overlay]');

addEventOnElements($sidebarTogglers, 'click', function () {
    $sidebar.classList.toggle('active');
    $overlay.classList.toggle('active');
});

// Initialize tooltips
const $tooltipElems = document.querySelectorAll('[data-tooltip]');
$tooltipElems.forEach($elem => Tooltip($elem));

// Display greeting message based on time of day
const $greetElem = document.querySelector('[data-greeting]');
const currentHour = new Date().getHours();
$greetElem.textContent = getGreetingMsg(currentHour);

// Display the current date
const $currentDateElem = document.querySelector('[data-current-date]');
const currentDate = new Date().toDateString();
const modifiedDate = currentDate.slice(0, 3) + ',' + currentDate.slice(3);
$currentDateElem.textContent = modifiedDate;

// Notebook creation logic
const $sidebarList = document.querySelector('[data-sidebar-list]');
const $addNotebookBtn = document.querySelector('[data-add-notebook]');

$addNotebookBtn.addEventListener('click', async function () {
    const notebookName = prompt("Enter the name of the new notebook:");
    if (notebookName) {
        try {
            const notebookData = await db.post.notebook(notebookName);
            client.notebook.create(notebookData);
        } catch (error) {
            console.error('Error creating notebook:', error);
        }
    }
});

// Render existing notebooks
async function renderExistedNotebook() {
    try {
        const notebookList = await db.get.notebooks();
        client.notebook.read(notebookList);
    } catch (error) {
        console.error('Error fetching notebooks:', error);
    }
}

renderExistedNotebook();

// Note creation logic
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

addEventOnElements($noteCreateBtns, 'click', async function () {
    const modal = NoteModal();
    modal.open();

    modal.onSubmit(async (noteObj) => {
        const activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;
        try {
            const noteData = await db.post.note(activeNotebookId, noteObj.title, noteObj.text);
            client.note.create(noteData);
            modal.close();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    });
});

// Display notes for the selected notebook
async function renderExistedNote() {
    const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;
    if (activeNotebookId) {
        try {
            const noteList = await db.get.notes(activeNotebookId);
            client.note.read(noteList);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }
}

renderExistedNote();

// app.js

// Fetch daftar notebook dari backend
fetch('/notebooks')
    .then(response => response.json())
    .then(notebooks => {
        // Proses daftar notebook dan tampilkan di frontend
        const notebookList = document.getElementById('notebook-list');
        notebooks.forEach(notebook => {
            const listItem = document.createElement('li');
            listItem.textContent = notebook.name;
            notebookList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching notebook list:', error);
    });
