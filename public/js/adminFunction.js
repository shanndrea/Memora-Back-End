document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {  // Cek jika tombol yang ditekan adalah Enter
                event.preventDefault();  // Menghentikan form dari submit secara default
                searchUsers();           // Memanggil fungsi pencarian
            }
        });
    }
});  
    
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value;
    fetch(`/admin/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data);
        })
        .catch(error => {
            console.error('Error loading the users:', error);
        });
}


function updateTable(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    users.forEach((user, index) => {
        // Pastikan ID dan fields lain sesuai dengan data yang diterima
        const row = `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.securityAnswer}</td>
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
