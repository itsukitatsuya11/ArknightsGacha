const apiUrl = 'https://api.rhodesapi.com/api/operator';
let cardCollection = JSON.parse(localStorage.getItem('cardCollection')) || [];

window.onload = () => {
    updateCardCollection();
};

async function gacha() {
    const gachaButton = document.getElementById('gachaButton');
    gachaButton.disabled = true;
    gachaButton.textContent = 'Wait 10 seconds';

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

    await delay(10000); // Delay 10 seconds
    gachaButton.disabled = false;
    gachaButton.textContent = 'Gacha';
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

function updateCardCollection() {
    const cardCollectionDiv = document.getElementById('cardCollection');
    cardCollectionDiv.innerHTML = '';
    cardCollection.forEach((operator, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('operator');

        const baseArt = operator.art ? operator.art.find(art => art.name === 'Base') : null;
        const imageUrl = baseArt ? baseArt.link : 'default-image-url.jpg'; 
        const starString = '★'.repeat(operator.rarity);

        cardDiv.innerHTML = `
            <img src="${imageUrl}" alt="${operator.name}">
            <div class="card">
                <span></span>
                <span>${operator.name}</span>
            </div>
            <div class="card">
                <span></span>
                <span>${starString}</span>
            </div>
            <div class="card">
                <span>HP:</span>
                <span>${operator.statistics && operator.statistics.base ? operator.statistics.base.hp : 'N/A'}</span>
            </div>
            <button class="delete" onclick="deleteOperator(${index})">Delete</button>
        `;
        cardCollectionDiv.appendChild(cardDiv);
    });
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
