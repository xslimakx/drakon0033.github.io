const categories = [
    {
        name: "SL〡World🍀",
        folder: "slworld",
        imageUrl: "https://i.pinimg.com/originals/dc/12/c8/dc12c8629ff2c1330a2270047616e8d8.gif",
        iconUrl: "https://media.discordapp.net/attachments/1272589209705779200/1275843892964495371/slava.png?ex=66c75db8&is=66c60c38&hm=45418e62bf50c2f3f945996d64d4f3d71ad2329bd61eaff0e345d849daff39ef&=&format=webp&quality=lossless",
        shortDescription: "Мир SL: Ванильный майнкрафт с дополнениями"
    },
    {
        name: "SW3XXT",
        folder: "sw3xxt",
        imageUrl: "https://media.discordapp.net/attachments/655766154916397089/1079719740991357028/kotyaka_blekmyaka.gif?ex=66c71a5e&is=66c5c8de&hm=7cd21e9e88f2f280ad3765ccad70d7695d34059088a922786b1bdc4478cbc052&=",
        iconUrl: "https://media.discordapp.net/attachments/655766154916397089/1079719740991357028/kotyaka_blekmyaka.gif?ex=66c71a5e&is=66c5c8de&hm=7cd21e9e88f2f280ad3765ccad70d7695d34059088a922786b1bdc4478cbc052&=",
        shortDescription: "Проекты SW3XXT: Инновации и творчество"
    },
    {
        name: "CryptocrSSWT",
        folder: "cryptocrsswt",
        imageUrl: "https://example.com/path/to/cryptocrsswt-image.gif", // Замените на реальный URL изображения
        iconUrl: "https://example.com/path/to/cryptocrsswt-icon.png", // Замените на реальный URL иконки
        shortDescription: "Создание и управление токенами Solana"
    }
];

function displayCategories() {
    const categoriesContainer = document.getElementById('categories');
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
            <img src="${category.imageUrl}" alt="${category.name}" class="category-image">
            <div class="category-overlay">
                <h2><img src="${category.iconUrl}" alt="${category.name} icon" class="category-icon"><span>${category.name}</span></h2>
                <p class="category-description">${category.shortDescription}</p>
                <a href="categories/${category.folder}/${category.folder}.html" class="category-button">Перейти</a>
            </div>
        `;
        categoriesContainer.appendChild(categoryDiv);
    });
}

document.addEventListener('DOMContentLoaded', displayCategories);