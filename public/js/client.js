'use strict';

/**
 * Import module
 */
import { NavItem } from "./Navitem.js";
import { activeNotebook } from "./utils.js";
import { Card } from "./Card.js";

const /**{HTMLElement}*/ $sidebarList = document.querySelector('[data-sidebar-list]');
const /**{HTMLElement}*/ $notePanelTitle= document.querySelector('[data-note-panel-title]');
const /**{HTMLElement}*/ $notePanel = document.querySelector('[data-note-panel]');
const /**{Array<HTMLElement>}*/ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const /**{string} */ emptyNotesTemplate = `
        <div class="empty-notes">
            <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

            <div class="text-headine-small">No notes</div>
        </div>
`;

const disableNoteCreateBtns = function (isThereAnyNotebook) {
 $noteCreateBtns.forEach($item =>{
    $item[isThereAnyNotebook ? 'removeAttribute' : 'setAttribute']
    ('disabled', '');
    });
}

export const client = {
 
    notebook: {
        create(notebookData){
            const /**{HEMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebarList.appendChild($navItem);
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
            $notePanel.innerHTML = emptyNotesTemplate;
            disableNoteCreateBtns(true);
        },

        read(notebookList){
            disableNoteCreateBtns(notebookList.length);

            notebookList.forEach((notebookData, index) => {
                const /** {HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);

                if (index == 0) {
                    activeNotebook.call($navItem);
                    $notePanelTitle.textContent = notebookData.name;
                }

                $sidebarList.appendChild($navItem);
            });
        },

        update(notebookId, notebookData){
         const /**{HTMLElement} */  $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`)  ;
         const /** {HTMLElement} */ $newNotebook = NavItem(notebookData.id, notebookData.name);

         $notePanelTitle.textContent = notebookData.name;
         $sidebarList.replaceChild($newNotebook, $oldNotebook);
         activeNotebook.call($newNotebook);
        },

        delete (notebookId) {
            const /**{HTMLElement} */ $deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const /** {HTMLElement | null}*/ $activeNavItem =$deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if($activeNavItem) {
                $activeNavItem.click();
            }else{
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML ='';
                disableNoteCreateBtns(false);
            }

            $deletedNotebook.remove();
        }

    },

    note: {
        create(noteData){
            //Clear 'emptyNotesTemplate' from 'notPanel' if there is no note exists

            if (!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML ='';


            //append card in notepanel
            const /**{HTMLElement} */ $card = Card(noteData);
            $notePanel.prepend($card);
        },

        read(noteList){

            if(noteList.length) {
                $notePanel.innerHTML = '';
                
                noteList.forEach(noteData =>{
                    const /** {HTMLElement}*/ $card = Card(noteData);
                    $notePanel.appendChild($card);
                });
            } else {
                $notePanel.innerHTML = emptyNotesTemplate;
            }
        },

        update(noteId, noteData) {
            const /**{HTMLElement} */ $oldCard = document.querySelector(`[data-note="${noteId}"]`);
            const /**{HTMLElement} */ $newCard = Card(noteData);
            $notePanel.replaceChild($newCard, $oldCard);
        },

        delete(noteId, isNoteExists){
            document.querySelector(`[data-note="${noteId}"]`).remove();
            if (!isNoteExists) $notePanel.innerHTML = emptyNotesTemplate;
        }
    }
}