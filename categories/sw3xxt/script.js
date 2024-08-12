const servers = [
    {
        name: "sw3xxt Дискорд сервер",
        shortDescription: "Сервачок для общения и веселья! 🎉",
        fullDescription: "Тут пенисы не показывать!!! Зато можно показывать смешные мемы и котиков! 😺",
        joinLink: "https://discord.gg/jmvmY3B5ez",
        imageUrl: "https://cdn.discordapp.com/attachments/1150879903860924546/1157118559986655325/image0.jpg?ex=66bb57e2&is=66ba0662&hm=cc1c1f9380d5fee5183ea7b20a80cc02832ef4d80583e60f07177fb4801abf28&",
        iconUrl: "https://media.discordapp.net/attachments/765647977032712224/824007482028458004/hapee.gif?ex=66bb1085&is=66b9bf05&hm=99ebd95565cb9c82b264eb8d6ba140d32204497c1c1163d4279e3b539df52192&="
    },
    // Добавьте больше серверов по необходимости
];

const cursorImages = [
    'https://static-00.iconduck.com/assets.00/penis-emoji-2048x2004-mcysxmme.png',
    'https://cdn-icons-png.flaticon.com/512/9352/9352702.png',
    'https://cdn-icons-png.flaticon.com/512/9953/9953831.png',
    'https://cdn-icons-png.flaticon.com/512/9953/9953832.png',
    'https://cdn-icons-png.flaticon.com/512/9953/9953833.png'
];

function setPageInfo() {
    const sw3xxtCategory = categories.find(category => category.folder === 'sw3xxt');
    if (sw3xxtCategory) {
        document.getElementById('favicon').href = sw3xxtCategory.iconUrl;
        document.getElementById('pageTitle').textContent = "Смешной " + sw3xxtCategory.name;
        
        const headerTitle = document.getElementById('headerTitle');
        headerTitle.innerHTML = `
            <img src="${sw3xxtCategory.iconUrl}" alt="${sw3xxtCategory.name} Icon" class="header-icon">
            🤪 ${sw3xxtCategory.name} Веселуха 🎉
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
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function closeModal() {
    const modal = document.getElementById('serverModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

function initConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function addShakeEffect() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(style);

    document.body.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('server') || 
            event.target.classList.contains('details-button') || 
            event.target.classList.contains('join-button')) {
            event.target.style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both';
            event.target.addEventListener('animationend', () => {
                event.target.style.animation = '';
            });
        }
    });
}

function addFloatingEmojis() {
    const emojis = ['🍕', '🎉', '😂', '🚀', '💖', '🌈', '🦄', '🍦'];
    const container = document.querySelector('.container');

    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = '-20px';
        emoji.style.fontSize = '20px';
        emoji.style.animation = `float 5s linear`;
        container.appendChild(emoji);

        setTimeout(() => {
            container.removeChild(emoji);
        }, 5000);
    }, 1000);

    const floatKeyframes = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = floatKeyframes;
    document.head.appendChild(style);
}

function updateCursor() {
    const randomImage = cursorImages[Math.floor(Math.random() * cursorImages.length)];
    const randomSize = Math.floor(Math.random() * (40 - 20 + 1)) + 20; // Размер от 20px до 40px
    const randomRotation = Math.floor(Math.random() * 360); // Поворот от 0 до 359 градусов

    const cursorStyle = `
        url('${randomImage}') ${randomSize / 2} ${randomSize / 2},
        auto
    `;

    document.body.style.cursor = cursorStyle;
    document.body.style.setProperty('--cursor-rotation', `${randomRotation}deg`);
}

function startCursorAnimation() {
    updateCursor(); // Обновляем курсор сразу
    setInterval(updateCursor, 3000); // Обновляем курсор каждые 3 секунды
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
    initConfetti();
    addShakeEffect();
    addFloatingEmojis();
    startCursorAnimation();
});