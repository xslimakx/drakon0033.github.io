const servers = [
    {
        name: "⌠SL⌡WoD🌠",
        shortDescription: "⌠SL⌡World of Dream🌠, Ванилла+",
        fullDescription: "🌆〡От части ванильный майнкрафт, но время от времени будут добавляться различные плагины которые вы можете использовать под свой стиль игры(РП или будь что другое)",
        joinLink: "https://discord.gg/Y7rCYhHpth",
        imageUrl: "https://cdn.discordapp.com/attachments/1269323708993114134/1272553329209376869/banerslwod.png?ex=66bb6524&is=66ba13a4&hm=115ab9cb18989b20f22b12bcb5efdf23943f26602aee79f825d9a6750a7429ba&",
        iconUrl: "https://cdn.discordapp.com/attachments/1259052471909617756/1272197191942934588/838587266740912178.png?ex=66bac236&is=66b970b6&hm=8a64d073485b49edb97adba8b259ecd02b784b77157f6214673182b35157316f&"
    },
    // Добавьте больше серверов по необходимости
];

function setPageInfo() {
    const slWorldCategory = categories.find(category => category.folder === 'slworld');
    if (slWorldCategory) {
        document.getElementById('favicon').href = slWorldCategory.iconUrl;
        document.getElementById('pageTitle').textContent = slWorldCategory.name;
        
        const headerTitle = document.getElementById('headerTitle');
        headerTitle.innerHTML = `
            <img src="${slWorldCategory.iconUrl}" alt="${slWorldCategory.name} Icon" class="header-icon">
            ${slWorldCategory.name}
        `;
    }
}

function displayServers() {
    const serverList = document.getElementById('server-list');
    servers.forEach((server, index) => {
        const serverDiv = document.createElement('div');
        serverDiv.className = 'server';
        serverDiv.innerHTML = `
            <img src="${server.imageUrl}" alt="${server.name}" class="server-image">
            <div class="server-info">
                <div class="server-title">
                    <img src="${server.iconUrl}" alt="${server.name} icon" class="server-icon">
                    <h2>${server.name}</h2>
                </div>
                <p>${server.shortDescription}</p>
                <button class="details-button" onclick="openModal(${index})">Подробнее</button>
            </div>
        `;
        serverList.appendChild(serverDiv);
    });
}

function openModal(serverIndex) {
    const modal = document.getElementById('serverModal');
    const server = servers[serverIndex];
    document.getElementById('modalServerImage').src = server.imageUrl;
    document.getElementById('modalServerName').textContent = server.name;
    document.getElementById('modalServerDescription').textContent = server.fullDescription;
    document.getElementById('modalJoinButton').href = server.joinLink;
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('serverModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

function setLightningRotations() {
    const lightnings = document.querySelectorAll('.lightning1, .lightning2, .lightning3');
    lightnings.forEach(lightning => {
        lightning.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    });
}

function toggleLightning() {
    const lightnings = document.querySelectorAll('.lightning1, .lightning2, .lightning3');
    lightnings.forEach(lightning => {
        lightning.style.opacity = lightning.style.opacity === '0.5' ? '0' : '0.5';
    });
    setTimeout(toggleLightning, Math.random() * 5000 + 2000); // Случайный интервал от 2 до 7 секунд
}

// Закрытие модального окна
const modal = document.getElementById('serverModal');
const span = document.getElementsByClassName("close")[0];
span.onclick = closeModal;
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setPageInfo();
    displayServers();
    setLightningRotations();
    toggleLightning(); // Запускаем анимацию молний
});