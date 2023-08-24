const form = document.getElementById('item-form');
const tableBody = document.querySelector('#item-table tbody');

// Initial load of items
loadItems().then(() => {
    console.log("Items are loaded.");
});
/*form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const response = await fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
    });

    if (response.ok) {
        const newItem = await response.json();
        appendItemToTable(newItem);
        form.reset();
    }
});*/

async function loadItems() {
    const response = await fetch('/items');
    const items = await response.json();

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    if (items.length === 0) {
        const noItemsRow = createNoItemsRow();
        tableBody.appendChild(noItemsRow);
    }
    else {
        items.forEach(item => {
            appendItemToTable(item);
        });
    }
}

function appendItemToTable(item) {
    // Create and append a table row for the item
    const row = createTableRow(item);
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>
            <button class="btn-update" data-id="${item.id}">Update</button>
            <button class="btn-delete" data-id="${item.id}">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}

function createNoItemsRow() {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'No items available';
    row.appendChild(cell);
    return row;
}

function deleteTableRow(itemId) {
    const tableRow = document.querySelector(`tr[data-id="${itemId}"]`);
    if (tableRow) {
        tableRow.remove();
    }
}

tableBody.addEventListener('click', async (event) => {
    const target = event.target;

    if (target.classList.contains('btn-update')) {
        const itemId = target.getAttribute('data-id');

        // Navigate to the update page with the selected item's ID as a query parameter
        window.location.href = `updateItem.html?id=${itemId}`;
    }

    if (target.classList.contains('btn-delete')) {
        const itemId = target.getAttribute('data-id');
        const shouldDelete = confirm('Are you sure you want to delete this item?');

        if (shouldDelete) {
            fetch(`/items/${itemId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        deleteTableRow(itemId);
                    }
                });
        }
    }
});

const addButton = document.getElementById('addButton');

addButton.addEventListener('click', () => {
    window.location.href = 'addItem.html'; // Redirect to AddItem page
});

function createTableRow(item) {
    let row = document.querySelector(`tr[data-id="${item.id}"]`);

    if (row) {
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>
                <button class="btn-update" data-id="${item.id}">Update</button>
                <button class="btn-delete" data-id="${item.id}">Delete</button>
            </td>
        `;
    } else {
        row = document.createElement('tr');
        row.setAttribute('data-id', item.id);
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>
                <button class="btn-update" data-id="${item.id}">Update</button>
                <button class="btn-delete" data-id="${item.id}">Delete</button>
            </td>
        `;
    }

    return row;
}
