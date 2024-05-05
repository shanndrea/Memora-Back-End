function toggleActive(element) {
    // Menghapus kelas 'active' dari semua elemen yang memiliki kelas 'nav-item'
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Menambahkan kelas 'active' pada elemen yang diklik
    element.classList.add('active');
}

//searchbar
function filterNotes() {
    const searchInput = document.getElementById('searchBar').value.trim().toUpperCase();
    const noteLists = document.querySelectorAll('[data-note-panel]'); // Pilih semua panel catatan
    let totalVisibleNotes = 0;
    let emptyNotesElement = document.querySelector('.empty-notes'); // Elemen untuk ditampilkan ketika tidak ada catatan yang ditemukan

    noteLists.forEach(noteList => {
        const notes = noteList.querySelectorAll('.card');

        notes.forEach(note => {
            const text = note.textContent.trim().toUpperCase();
            const shouldDisplay = searchInput === '' || text.includes(searchInput);
            note.style.display = shouldDisplay ? '' : 'none'; // Tampilkan catatan jika sesuai dengan pencarian, sisanya sembunyikan
            if (shouldDisplay) {
                totalVisibleNotes++;
            }
        });
    });

    // Tampilkan pesan catatan kosong jika tidak ada catatan yang terlihat di semua kategori
    emptyNotesElement.style.display = totalVisibleNotes === 0 ? 'block' : 'none';
}


//greeting 
document.addEventListener('DOMContentLoaded', function() {
    function updateGreeting() {
        var currentTime = new Date();
        var currentHour = currentTime.getHours();

        var greeting;
        if (currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }

        var greetingElement = document.querySelector('[data-greeting]');
        if (greetingElement) {
            greetingElement.textContent = greeting;
        }
    }

    function updateCurrentDate() {
        var currentDate = new Date();
        var options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
        var formattedDate = currentDate.toLocaleDateString('en-US', options);

        var currentDateElement = document.querySelector('[data-current-date]');
        if (currentDateElement) {
            currentDateElement.textContent = formattedDate;
        }
    }

    updateGreeting();
    updateCurrentDate();
    setInterval(function() {
        updateGreeting();
        updateCurrentDate();
    }, 60000); 
});


//saat masuk tampilan pertama kali
document.addEventListener('DOMContentLoaded', function() {
    // Setelah tampilan dimuat
    var notebookTitle = document.querySelector('[data-note-panel-title]');
    if (notebookTitle) {
        notebookTitle.textContent = "Work"; // Set judul catatan secara default

        // Menambahkan kelas 'active' ke elemen 'nav-item' yang sesuai
        var navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.querySelector('.text').textContent.trim() === notebookTitle.textContent) {
                item.classList.add('active'); // Menambahkan kelas 'active'
            }
        });
    }
});


//supaya judul notebook diheader ikut dengan yang kita klik disidebar
document.addEventListener('DOMContentLoaded', function() {
    var navItems = document.querySelectorAll('[data-notebook-field]');
    var notebookTitle = document.querySelector('[data-note-panel-title]');

    navItems.forEach(function(navItem) {
        navItem.addEventListener('click', function() {
            var notebookField = navItem.textContent;
            notebookTitle.textContent = notebookField;
        });
    });
});

//close dan overlay pada modal
document.addEventListener('DOMContentLoaded', function() {
    var newNoteBtn = document.querySelector('[data-note-create-btn]');
    var modal = document.querySelector('.modal');
    var overlay = document.getElementById('overlay');

    newNoteBtn.addEventListener('click', function() {
        modal.classList.add('show-modal');
        overlay.style.display = 'block'; // Show overlay when modal is displayed
    });

    var closeModalBtn = document.querySelector('.modal [aria-label="Close modal"]');
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('show-modal');
        overlay.style.display = 'none'; // Hide overlay when modal is closed
    });

    var saveBtn = document.querySelector('.modal [data-submit-btn]');
    saveBtn.addEventListener('click', function() {
        modal.classList.remove('show-modal');
        overlay.style.display = 'none'; // Hide overlay when save button is clicked
    });
});


//reset moddal
document.addEventListener('DOMContentLoaded', function() {
    // Dapatkan elemen tombol "New note"
    var newNoteBtn = document.querySelector('[data-note-create-btn]');

    // Dapatkan elemen input dan textarea modal
    var titleInput = document.querySelector('.modal-title');
    var textArea = document.querySelector('.modal-text');

    // Fungsi untuk mengatur ulang konten modal
    function resetModalContent() {
        titleInput.value = ''; // Set nilai input title menjadi string kosong
        textArea.value = ''; // Set nilai textarea menjadi string kosong
    }

    // Tambahkan event listener ke tombol "New note"
    newNoteBtn.addEventListener('click', function() {
        resetModalContent(); // Panggil fungsi untuk mengatur ulang konten modal
        // Lakukan tindakan lain yang diperlukan saat tombol "New note" diklik
    });
});


//notelistuntuk setiap category
document.addEventListener('DOMContentLoaded', function() {
    var navItems = document.querySelectorAll('[data-notebook-field]');
    var noteLists = document.querySelectorAll('[data-note-panel]');
    setActiveCategory('Work');
    navItems.forEach(function(navItem) {
        navItem.addEventListener('click', function() {
            var category = navItem.textContent.trim();
            setActiveCategory(category);

            // Sembunyikan semua note-list
            noteLists.forEach(function(noteList) {
                noteList.style.display = 'none';
            });

            // Tampilkan note-list sesuai dengan kategori yang dipilih
            var selectedNoteList = document.querySelector(`[data-category="${category}"]`);
            if (selectedNoteList) {
                selectedNoteList.style.display = 'block';
            }
        });
    });
});


function setActiveCategory(category) {
    var noteLists = document.querySelectorAll('[data-note-panel]');
    noteLists.forEach(function(noteList) {
        if (noteList.getAttribute('data-category') === category) {
            noteList.style.display = 'block'; // Show the active category
        } else {
            noteList.style.display = 'none'; // Hide other categories
        }
    });

    // Optionally update any active class on category buttons/links
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        if (item.querySelector('[data-notebook-field]').textContent.trim() === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update the notebook title or any other UI element
    var notebookTitle = document.querySelector('[data-note-panel-title]');
    if (notebookTitle) {
        notebookTitle.textContent = category;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var saveBtn = document.querySelector('.modal [data-submit-btn]');
    var modal = document.querySelector('.modal');
    var titleInput = modal.querySelector('.modal-title');
    var textArea = modal.querySelector('.modal-text');
    var overlay = document.getElementById('overlay');
    var noteList = document.querySelector('.note-list');
    var currentCard = null; // Variable to store the currently clicked card
    var emptyNotes = document.querySelector('.empty-notes'); // Empty notes element
    var deleteModal = document.querySelector('.modals'); // Delete confirmation modal
    var deleteConfirmBtn = deleteModal.querySelector('.modals-footer .btn.text:last-child'); // Delete button on modal

    // Function to check if input or textarea is empty
    function checkEmptyInput() {
        var isTitleEmpty = titleInput.value.trim() === '';
        var isTextEmpty = textArea.value.trim() === '';
        return isTitleEmpty && isTextEmpty;
    }

    // Function to toggle save button based on input and textarea
    function toggleSaveBtn() {
        if (checkEmptyInput()) {
            saveBtn.disabled = true;
            saveBtn.style.cursor = 'not-allowed';
        } else {
            saveBtn.disabled = false;
            saveBtn.style.cursor = 'pointer';
        }
    }

    // Function to show or hide empty notes based on the number of cards
// Function to show or hide empty notes based on the number of cards
function toggleEmptyNotes() {
    var activeCategory = document.querySelector('.nav-item.active [data-notebook-field]').textContent;
    var activeNoteList = document.querySelector(`[data-category="${activeCategory}"]`);
    if (activeNoteList.children.length === 0) {
        emptyNotes.style.display = 'block'; // Show empty notes if there are no cards
    } else {
        emptyNotes.style.display = 'none'; // Hide empty notes if there are cards
    }
}


    // Event listeners for input and textarea change
    titleInput.addEventListener('input', toggleSaveBtn);
    textArea.addEventListener('input', toggleSaveBtn);

    // Function to update card content
    function updateCard(card, title, text, formattedDate) {
        var cardTitle = card.querySelector('.card-title');
        var cardText = card.querySelector('.card-text');
        var cardDate = card.querySelector('.card-date');

        cardTitle.textContent = title;
        cardText.textContent = text;
        cardDate.textContent = formattedDate;
    }

    // Event listener for save button click
    saveBtn.addEventListener('click', function(event) {
        if (checkEmptyInput()) {
            event.preventDefault();
        } else {
            var title = titleInput.value.trim() || 'Untitled';
            var text = textArea.value.trim() || 'Add your notes...';
            var date = new Date();
            var formattedDate = date.toLocaleDateString(); // Get formatted date without time
            var activeCategory = document.querySelector('.nav-item.active [data-notebook-field]').textContent;
            
            var postData = {
                title: title,
                text: text,
                noteDate: formattedDate,
                category: activeCategory
            };

            var method = currentCard ? 'PUT' : 'POST';
            var url = currentCard ? `/toDoList/update/${currentCard.dataset.noteId}` : '/toDoList/add';

            
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }).then(response => response.json())
              .then(data => {
                console.log('Success:', data);
                // Assuming data contains { _id: "uniqueNoteId", ... }
                if (currentCard) {
                    updateCard(currentCard, title, text, formattedDate);
                } else {
                    var card = document.createElement('div');
                    card.classList.add('card');
                    card.dataset.noteId = data._id; // Set the unique ID from server response
                    // Continue with card setup...
                    var cardTitle = document.createElement('h3');
                    cardTitle.classList.add('card-title', 'text-title-medium');
                    cardTitle.textContent = title;
                    var cardText = document.createElement('p');
                    cardText.classList.add('card-text', 'text-body-large');
                    cardText.textContent = text;
                    var cardDate = document.createElement('span');
                    cardDate.classList.add('card-date', 'text-label-large');
                    cardDate.textContent = formattedDate;
                    
                    var deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('icon-btn', 'large');
                    deleteBtn.setAttribute('aria-label', 'Delete note');
                    deleteBtn.innerHTML = '<span class="material-symbols-rounded" aria-hidden="true">delete</span>';
                    deleteBtn.addEventListener('click', function(event) {
                        event.stopPropagation();
                        currentCard = card;
                        overlay.style.display = 'block';
                        deleteModal.style.display = 'block';
                    });
    
                    var wrapper = document.createElement('div');
                    wrapper.classList.add('wrapper');
                    wrapper.appendChild(cardDate);
                    wrapper.appendChild(deleteBtn);
    
                    card.appendChild(cardTitle);
                    card.appendChild(cardText);
                    card.appendChild(wrapper);
    
                    var activeNoteList = document.querySelector(`[data-category="${activeCategory}"]`);
                    activeNoteList.appendChild(card);
                }
    
                modal.classList.remove('show-modal');
                overlay.style.display = 'none';
                titleInput.value = '';
                textArea.value = '';
                toggleSaveBtn();
                currentCard = null;
                toggleEmptyNotes();
              }).catch((error) => {
                console.error('Error:', error);
            });
        }
    });
    
    

    // Event listener for close modal button click
    modal.querySelector('[aria-label="Close modal"]').addEventListener('click', function() {
        modal.classList.remove('show-modal');
        overlay.style.display = 'none';

        // Reset currentCard to null when modal is closed
        currentCard = null;
    });

    // Event listener for card click to display modal
    document.addEventListener('click', function(event) {
        var card = event.target.closest('.card');
        if (card) {
            // Set currentCard to the clicked card
            currentCard = card;
    
            // Display modal
            modal.classList.add('show-modal');
            overlay.style.display = 'block';
    
            // Fill modal fields with card data
            var cardTitle = card.querySelector('.card-title').textContent;
            var cardText = card.querySelector('.card-text').textContent;
            titleInput.value = cardTitle;
            textArea.value = cardText;
            toggleSaveBtn(); // Enable save button since inputs are filled
        }
    });
    

    // Event listener for cancel button on delete confirmation modal
    deleteModal.querySelector('.modals-footer .btn.text:first-child').addEventListener('click', function() {
        // Hide modal
        overlay.style.display = 'none';
        deleteModal.style.display = 'none';
    });

    // Event listener for delete button on delete confirmation modal
    deleteConfirmBtn.addEventListener('click', function() {
        if (currentCard && currentCard.dataset.noteId) { // Ensure currentCard and noteId are defined
            const noteId = currentCard.dataset.noteId; // Retrieve the ID from the card
    
            fetch(`/toDoList/delete/${noteId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete the note');
                }
                return response.json(); // or just response.text() if no JSON is returned
            })
            .then(() => {
                // Only remove the card and update UI if server deletion was successful
                currentCard.remove();
                overlay.style.display = 'none';
                deleteModal.style.display = 'none';
                currentCard = null;
                toggleEmptyNotes();
                console.log('Note deleted successfully');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Initial check to show or hide empty notes on page load
    toggleEmptyNotes();
});

