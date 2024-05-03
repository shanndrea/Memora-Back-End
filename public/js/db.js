'use strict';

/**
 * import module
 */
import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utils.js";

//db object
let /**{object} */ notekeeperDB = {};

const initDB = function(){
    const /**{JSON | undefined} */ db =localStorage.getItem('notekeeperDB');

    if (db) {
        notekeeperDB = JSON.parse(db);
    }else{
        notekeeperDB.notebooks = [];
        localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));

    }
}

initDB();

/**
 * Reads and loads the localstorage data in to the global variable `notekeeperDB`.
 */

const readDB = function () {
    notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
}


/**
 * Writes the current state of the global variable `notekeeperDB` to local Storage
 */
const writeDB = function () {
    localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
}


export const db = {

    post: {
        notebook(name){
            readDB();

            const/**{Object} */ notebookData = {
                id: generateID(),
                name,
                notes: []
            }


            notekeeperDB.notebooks.push(notebookData);

            writeDB();

            return notebookData;
        },

        note(notebookId, object){
            readDB();
            const/**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
            const /**{Object} */ noteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn: new Date().getTime()
            }

            console.log(noteData);
            notebook.notes.unshift(noteData);

            writeDB();

            return noteData;
        }
    }, 

    get: {
        notebook(){
            readDB();

            return notekeeperDB.notebooks;
        },

        note(notebookId) {
            readDB();

            const /**{object} */ notebook = findNotebook(notekeeperDB, notebookId);
            return notebook.notes;
        }
    },

    update: {
        notebook(notebookId, name){
            readDB();

            const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
            notebook.name = name;

            writeDB();

            return notebook;
        },

        note(noteId, object) {
            readDB();

            const /**{object} */ oldNote = findNote(notekeeperDB, noteId);
            const /**{object} */ newNote = Object.assign(oldNote, object);

            writeDB();

            return newNote;            

        }
    },

    delete: {
        notebook(notebookId){
            readDB();
            const /** {number*/  notebookIndex = findNotebookIndex(notekeeperDB,notebookId);
            notekeeperDB.notebooks.splice(notebookIndex, 1);

            writeDB();
        },

        note(notebookId, noteId) {
            readDB();

            const /** {object} */ notebook = findNotebook(notekeeperDB, notebookId);
            const /** {number} */ noteIndex = findNoteIndex(notebook, noteId)

            notebook.notes.splice(noteIndex, 1);

            writeDB();

            return notebook.notes;
        }
    }
}
