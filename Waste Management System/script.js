
let wasteRecords = JSON.parse(
    localStorage.getItem("wasteRecords")
) || [];

const form = document.getElementById("wasteForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let location = document.getElementById("location").value.trim();
    let type = document.getElementById("type").value;
    let quantity = Number(document.getElementById("quantity").value);
    let status = document.getElementById("status").value;

    if (location === "" || quantity <= 0) {
        alert("Please enter valid details");
        return;
    }

    let record = {
        location: location,
        type: type,
        quantity: quantity,
        status: status
    };

    wasteRecords.push(record);

    saveRecords();
    form.reset();
    displayRecords();
});

function saveRecords() {
    localStorage.setItem(
        "wasteRecords",
        JSON.stringify(wasteRecords)
    );
}

function displayRecords() {
    let table = document.getElementById("wasteTable");
    let search = document.getElementById("search").value.toLowerCase();

    table.innerHTML = "";

    let total = 0;
    let collected = 0;
    let pending = 0;

    wasteRecords.forEach(function(record, index) {
        total++;

        if (record.status === "Collected") {
            collected++;
        } else {
            pending++;
        }

        if (
            record.location.toLowerCase().includes(search) ||
            record.type.toLowerCase().includes(search)
        ) {
            let row = table.insertRow();

            row.insertCell(0).textContent = record.location;
            row.insertCell(1).textContent = record.type;
            row.insertCell(2).textContent = record.quantity;
            row.insertCell(3).textContent = record.status;

            let actionCell = row.insertCell(4);

            if (record.status === "Pending") {
                let collectButton = document.createElement("button");
                collectButton.textContent = "Collect";

                collectButton.onclick = function() {
                    wasteRecords[index].status = "Collected";
                    saveRecords();
                    displayRecords();
                };

                actionCell.appendChild(collectButton);
            }

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";

            deleteButton.onclick = function() {
                wasteRecords.splice(index, 1);
                saveRecords();
                displayRecords();
            };

            actionCell.appendChild(deleteButton);
        }
    });

    document.getElementById("total").textContent = total;
    document.getElementById("collected").textContent = collected;
    document.getElementById("pending").textContent = pending;
}

document.getElementById("search").addEventListener(
    "input", displayRecords
);

displayRecords();
