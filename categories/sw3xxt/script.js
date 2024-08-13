const servers = [
    {
        name: "sw3xxt Дискорд сервер",
        shortDescription: "Сервачок для общения и веселья! 🎉",
        fullDescription: "Тут пенисы не показывать!!! Зато можно показывать смешные мемы и котиков! 😺",
        joinLink: "https://discord.gg/jmvmY3B5ez",
        imageUrl: "https://cdn.discordapp.com/attachments/1150879903860924546/1157118559986655325/image0.jpg?ex=66bb57e2&is=66ba0662&hm=cc1c1f9380d5fee5183ea7b20a80cc02832ef4d80583e60f07177fb4801abf28&",
        iconUrl: "https://media.discordapp.net/attachments/765647977032712224/824007482028458004/hapee.gif?ex=66bb1085&is=66b9bf05&hm=99ebd95565cb9c82b264eb8d6ba140d32204497c1c1163d4279e3b539df52192&="
    },
];

function setPageInfo() {
    const sw3xxtCategory = categories.find(category => category.folder === 'sw3xxt');
    if (sw3xxtCategory) {
        document.getElementById('favicon').href = sw3xxtCategory.iconUrl;
        document.getElementById('pageTitle').textContent = sw3xxtCategory.name;
        
        const headerTitle = document.getElementById('headerTitle');
        headerTitle.innerHTML = `
            <img src="${sw3xxtCategory.iconUrl}" alt="${sw3xxtCategory.name} Icon" class="header-icon">
            ${sw3xxtCategory.name}
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
                <button class="details-button" onclick="openModal(${index})">Подробнее 🧐</button>
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

function setupModalClose() {
    const closeButton = document.querySelector('.close');
    const modal = document.getElementById('serverModal');

    closeButton.addEventListener('click', closeModal);
    
    closeButton.addEventListener('mouseenter', startEmojiAnimation);
    closeButton.addEventListener('mouseleave', stopEmojiAnimation);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function startEmojiAnimation() {
    this.classList.add('animated');
}

function stopEmojiAnimation() {
    this.classList.remove('animated');
}

window.closeModal = function() {
    const modal = document.getElementById('serverModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

function addFloatingEmojis() {
    const emojis = ['😂', '🤣', '😅', '😆', '😁', '😄', '😃', '😀', '😊', '😉'];
    const container = document.querySelector('.container');

    for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.animationDuration = `${Math.random() * 10 + 5}s`;
        emoji.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(emoji);
    }
}

function startCursorAnimation() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseout', () => {
        cursor.style.display = 'none';
    });

    document.addEventListener('mouseover', () => {
        cursor.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setPageInfo();
    displayServers();
    addFloatingEmojis();
    startCursorAnimation();
    setupModalClose();
});