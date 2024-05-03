'use strict';



const addEventOnElements =function($elements, eventType, callback)
{
    console.log($elements)
    $elements.forEach($element=> $element.addEventListener(eventType,callback));
}

const getGreetingMsg = function (currentHour){
 const/**{string} */ greeting =
 currentHour <5 ? 'Night' :
 currentHour <12 ? 'Morning' :
 currentHour <16 ? 'Afternoon' :    
 currentHour <20 ? 'Evening' :
 'Night';

 return `Good ${greeting}`;
}

let /** {HTMLElement | undefined} */ $lastActiveNavItem;

const activeNotebook = function () {
    $lastActiveNavItem?.classList.remove('active');
    this.classList.add('active');
    $lastActiveNavItem = this;

}

const makeElemEditable = function ($element){
    $element.setAttribute('contenteditable', true);
    $element.focus();
}

const generateID = function (){
    return new Date().getTime().toString();
}

const findNotebook = function (db, notebookId) {
    return db.notebooks.find(notebook => notebook.id == notebookId);
}

const findNotebookIndex = function (db, notebookId) {
    return db.notebooks.findIndex(item => item.id == notebookId);
}

const getRelativeTime = function (millieseconds) {
    const /* number*/currentTime = new Date().getTime();

    let /* number*/ minute = Math.floor((currentTime - millieseconds)/ 1000 /60);
    const /* number*/ hour = Math.floor (minute/60);
    const /* number*/ day = Math.floor(hour / 24);

    return minute <1 ? 'Just now' : minute <60 ? `${minute} min ago`
    : hour <24 ? `${hour} hour ago` : `${day} day ago`;

}

const findNote = (db, noteId) => {
    let note;
    for (const notebook of db.notebooks) {
        note = notebook.notes.find(note => note.id == noteId);
        if (note) break;
    }
    return note;
}

const findNoteIndex = function (notebook, noteId){
    return notebook.notes.findIndex(note => note.id == noteId);
}

export {
    addEventOnElements,
    getGreetingMsg,
    activeNotebook,
    makeElemEditable,
    generateID,
    findNotebook,
    findNotebookIndex,
    getRelativeTime,
    findNote,
    findNoteIndex
}