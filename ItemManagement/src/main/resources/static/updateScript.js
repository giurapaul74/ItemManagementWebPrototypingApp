const updateItemForm = document.getElementById('update-item-form');
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id'); // Get the item's ID from the URL parameter

updateItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedName = document.getElementById('updatedName').value;
    const updatedDescription = document.getElementById('updatedDescription').value;
    const errorMessageElement = document.getElementById("error-message");

    const updatedItem = {
        id: Number(itemId),
        name: updatedName,
        description: updatedDescription
    };

    const response = await fetch(`/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    });

    try{
        if (response.ok) {
            // Redirect back to the main page after successful update
            updateTableRow(itemId, updatedItem);
            window.location.href = 'index.html';
        } else {
            // Handle error
            const errorData = await response.json();
            errorMessageElement.textContent = errorData.message;
            console.error("Error: ", errorData.message);
        }
    }
    catch (error){
        errorMessageElement.textContent = 'An unexpected error occurred. Please try again.'; // Display a generic error message
        console.error("Error: ", error.message);
    }
});

function updateTableRow(itemId, updatedItem) {
    const tableRow = document.querySelector(`tr[data-id="${itemId}"]`);
    if (tableRow) {
        tableRow.innerHTML = `
            <td>${updatedItem.id}</td>
            <td>${updatedItem.name}</td>
            <td>${updatedItem.description}</td>
            <td>
                <button class="btn-update" data-id="${updatedItem.id}">Update</button>
                <button class="btn-delete" data-id="${updatedItem.id}">Delete</button>
            </td>
        `;
        updateTableRow(itemId, updatedItem);
    }
}