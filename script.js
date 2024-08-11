// Конфигурация сайта
const siteConfig = {
    title: "⌠SL⌡World🍀",
    projectName: "⌠SL⌡World🍀",
    logoImageUrl: "https://cdn.discordapp.com/attachments/1209475725522894858/1259550384842735679/sl512.png?ex=66b992f5&is=66b84175&hm=3ae68479bc128f97ed930959f15f40f83f8be09a5ba6c137a40a0fa8be8aca0a&"
};

// Пример данных о серверах
const servers = [
    {
        name: "⌠SL⌡WoD🌠",
        shortDescription: "Внилла++",
        fullDescription: "🌆〡От части ванильный майнкрафт, но время от времени будут добавляться различные плагины которые вы можете использовать под свой стиль игры(РП или будь что другое)",
        joinLink: "https://discord.gg/Y7rCYhHpth",
        imageUrl: "https://i.pinimg.com/originals/92/64/e4/9264e45e96c6725b9e36af434b0d5ae7.gif",
        iconUrl: "https://cdn.discordapp.com/attachments/1259052471909617756/1272197191942934588/838587266740912178.png?ex=66ba1976&is=66b8c7f6&hm=6c90ed06d322f238573b301bda6e7299b85caa808bae8a008d1386797fc88c2c&"
    },
    {
        name: "BEB",
        shortDescription: "Бубуб",
        fullDescription: "Бубубуу!",
        joinLink: "https://discord.gg/b22AecqwKq",
        imageUrl: "https://cdn.discordapp.com/attachments/797900252304113667/1260751472249933864/image.png?ex=66b9fd0e&is=66b8ab8e&hm=7aa53fe8df8728cc4e66556e816ece3b1ebd89dcc927b9275f2ee99acff9d3d1&",
        iconUrl: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
    }
    // Добавьте здесь больше серверов по необходимости
];

function initializeSite() {
    // Установка заголовка страницы
    document.getElementById('pageTitle').textContent = siteConfig.title;

    // Установка изображения логотипа
    const logoImage = document.getElementById('logoImage');
    const projectTitle = document.getElementById('projectTitle');
    
    logoImage.src = siteConfig.logoImageUrl;
    projectTitle.textContent = siteConfig.projectName;
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

// Закрытие модального окна
const modal = document.getElementById('serverModal');
const span = document.getElementsByClassName("close")[0];
span.onclick = closeModal;
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Инициализация сайта и отображение серверов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeSite();
    displayServers();
});