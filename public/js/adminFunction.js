document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchUsers();
        });
    }
});

function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value;
    fetch(`/admin/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            updateTable(data);
        })
        .catch(error =>  {
            console.error('Error loading the users:', error);
        });
}

function updateTable(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = ''; // Clear the table body

    users.forEach((user, index) => {
        const row = `<tr>
                        <td>${index + 1}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td style="text-align: center;">
                            <form action="/admin/edit/${user._id}" method="get" style="display: inline;">
                                <button type="submit">Edit</button>
                            </form>
                            <form action="/admin/delete/${user._id}" method="post" onsubmit="return confirm('Are you sure?');" style="display: inline;">
                                <button type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

