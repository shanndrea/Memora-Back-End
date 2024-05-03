'use strict';

// db object
let notekeeperDB = {};

const initDB = function () {
    const db = localStorage.getItem('notekeeperDB');
    if (db) {
        try {
            notekeeperDB = JSON.parse(db);
        } catch (error) {
            console.error('Error parsing database:', error);
        }
    } else {
        notekeeperDB.notebooks = [];
        writeDB();
    }
}

initDB();

/**
 * Reads and loads the localstorage data into the global variable `notekeeperDB`.
 */
const readDB = function () {
    try {
        const db = localStorage.getItem('notekeeperDB');
        if (db) {
            notekeeperDB = JSON.parse(db);
        }
    } catch (error) {
        console.error('Error reading database:', error);
    }
}

/**
 * Writes the current state of the global variable `notekeeperDB` to local Storage
 */
const writeDB = function () {
    try {
        localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
    } catch (error) {
        console.error('Error writing to database:', error);
    }
}

export const db = {
    post: {
        notebook(name) {
            try {
                readDB();
                const notebookData = {
                    id: generateID(),
                    name,
                    notes: []
                }
                notekeeperDB.notebooks.push(notebookData);
                writeDB();
                return notebookData;
            } catch (error) {
                console.error('Error creating notebook:', error);
                return null;
            }
        },

        note(notebookId, object) {
            try {
                readDB();
                const notebook = findNotebook(notekeeperDB, notebookId);
                const noteData = {
                    id: generateID(),
                    notebookId,
                    ...object,
                    postedOn: new Date().getTime()
                }
                notebook.notes.unshift(noteData);
                writeDB();
                return noteData;
            } catch (error) {
                console.error('Error creating note:', error);
                return null;
            }
        }
    },

    get: {
        notebook() {
            try {
                readDB();
                return notekeeperDB.notebooks;
            } catch (error) {
                console.error('Error getting notebooks:', error);
                return [];
            }
        },

        note(notebookId) {
            try {
                readDB();
                const notebook = findNotebook(notekeeperDB, notebookId);
                return notebook.notes;
            } catch (error) {
                console.error('Error getting notes:', error);
                return [];
            }
        }
    },

    update: {
        notebook(notebookId, name) {
            try {
                readDB();
                const notebook = findNotebook(notekeeperDB, notebookId);
                notebook.name = name;
                writeDB();
                return notebook;
            } catch (error) {
                console.error('Error updating notebook:', error);
                return null;
            }
        },

        note(noteId, object) {
            try {
                readDB();
                const oldNote = findNote(notekeeperDB, noteId);
                const newNote = Object.assign(oldNote, object);
                writeDB();
                return newNote;
            } catch (error) {
                console.error('Error updating note:', error);
                return null;
            }
        }
    },

    delete: {
        notebook(notebookId) {
            try {
                readDB();
                const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
                notekeeperDB.notebooks.splice(notebookIndex, 1);
                writeDB();
            } catch (error) {
                console.error('Error deleting notebook:', error);
            }
        },

        note(notebookId, noteId) {
            try {
                readDB();
                const notebook = findNotebook(notekeeperDB, notebookId);
                const noteIndex = findNoteIndex(notebook, noteId)
                notebook.notes.splice(noteIndex, 1);
                writeDB();
                return notebook.notes;
            } catch (error) {
                console.error('Error deleting note:', error);
                return [];
            }
        }
    }
}
