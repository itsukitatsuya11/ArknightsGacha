const apiUrl = 'https://api.rhodesapi.com/api/operator';
let cardCollection = JSON.parse(localStorage.getItem('cardCollection')) || [];

window.onload = () => {
    updateCardCollection();
};

async function gacha() {
    const gachaButton = document.getElementById('gachaButton');
    gachaButton.disabled = true;

    let seconds = 10; 
    const countdownInterval = setInterval(() => {
        gachaButton.textContent = `Wait ${seconds} seconds`;
        seconds--;
        if (seconds < 0) {
            clearInterval(countdownInterval);
            gachaButton.disabled = false;
            gachaButton.textContent = 'Gacha';
        }
    }, 1000); 

    const operatorContainer = document.getElementById('operatorContainer');
    operatorContainer.innerHTML = '';

    try {
        const response = await fetch(apiUrl);
        const operators = await response.json();
        const randomIndex = Math.floor(Math.random() * operators.length);
        const randomOperator = operators[randomIndex];
        displayOperator(randomOperator);

        cardCollection.push(randomOperator);
        saveCardCollection();
        updateCardCollection();
    } catch (error) {
        console.error('Error:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveCardCollection() {
    localStorage.setItem('cardCollection', JSON.stringify(cardCollection));
}

function displayOperator(operator) {
    const operatorContainer = document.getElementById('operatorContainer');
    const operatorDiv = document.createElement('div');
    operatorDiv.classList.add('operator');
    const baseArt = operator.art ? operator.art.find(art => art.name === 'Base') : null;
    const imageUrl = baseArt ? baseArt.link : 'default-image-url.jpg';
    const starString = '★'.repeat(operator.rarity);

    operatorDiv.innerHTML = `
        <img src="${imageUrl}" alt="${operator.name}">
        <div class="card">
            <span></span>
            <span>${operator.name}</span>
        </div>
        <div class="card">
            <span></span>
            <span>${starString}</span>
        </div>
    `;
    operatorContainer.appendChild(operatorDiv);
}

function updateCardCollection(filteredOperators) {
    const cardCollectionDiv = document.getElementById('cardCollection');
    cardCollectionDiv.innerHTML = '';
    const operators = filteredOperators || cardCollection;
    operators.forEach((operator, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('operator');

        const baseArt = operator.art ? operator.art.find(art => art.name === 'Base') : null;
        const imageUrl = baseArt ? baseArt.link : 'default-image-url.jpg'; 

        const starString = '★'.repeat(operator.rarity);

        cardDiv.innerHTML = `
            <img src="${imageUrl}" alt="${operator.name}">
            <div class="card">
                <span>Name:</span>
                <span class="infodata">${operator.name}</span>
            </div>
            <div class="card">
                <span>Rarity:</span>
                <span class="infodata">${starString}</span>
            </div>
            <button class="accordion">Details</button>
            <div class="panel" style="display: none;">
                <hr/>
                <div class="card">
                    <span>&bull; Biography:</span>
                    <span class="infodata">${operator.biography}</span>
                </div>
                <hr/>
                <div class="card">
                <span>&bull; Base Stats:</span>
                <table class="stats-table">
                    <tr>
                        <td>HP</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.hp : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Attack</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.atk : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Defense</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.def : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Resist</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.resist : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Deploy</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.deploy : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Cost</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.cost : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Interval</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.interval : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Block</td>
                        <td class="infodata">${operator.statistics && operator.statistics.base ? operator.statistics.base.block : 'N/A'}</td>
                    </tr>
                </table>
                </div>
            </div>
            <button class="delete" onclick="deleteOperator(${index})">Delete</button>
        `;
        cardCollectionDiv.appendChild(cardDiv);
    });

    const accordions = document.getElementsByClassName("accordion");
    for (let i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}

function searchOperator() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredOperators = cardCollection.filter(operator => {
        return operator.name.toLowerCase().includes(searchInput); 
    });
    updateCardCollection(filteredOperators);
}

function deleteOperator(index) {
    cardCollection.splice(index, 1);
    saveCardCollection();
    updateCardCollection();
}

function showCardCollection() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    updateCardCollection();
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
