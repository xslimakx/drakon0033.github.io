const categories = [
    {
        name: "SL〡World🍀",
        folder: "slworld",
        imageUrl: "https://cdn.discordapp.com/attachments/1269323708993114134/1272559583407374406/overworld.png?ex=66bb6af7&is=66ba1977&hm=a5e7194a86a572807450b55a75a4c249f469dbd263d1bbee7b07550524d6fb8a&",
        iconUrl: "https://cdn.discordapp.com/attachments/1269323708993114134/1272559631066992671/sl512.png?ex=66bb6b03&is=66ba1983&hm=fff9d6db44d3de3fa2f7fcd878732edcae9431b192885d938a0db4f087f54fa7&",
        shortDescription: "Мир SL: Ванильный майнкрафт с дополнениями"
    },
    {
        name: "SW3XXT",
        folder: "sw3xxt",
        imageUrl: "https://images-ext-1.discordapp.net/external/Qv1x9E0leTchoiBQKnGu_iVAhMkb112yN1lDcNKjYN8/https/cdn.discordapp.com/avatars/273493998956576778/a_3ad600f422bf0f5904146c509d28b1a0.gif",
        iconUrl: "https://images-ext-1.discordapp.net/external/Qv1x9E0leTchoiBQKnGu_iVAhMkb112yN1lDcNKjYN8/https/cdn.discordapp.com/avatars/273493998956576778/a_3ad600f422bf0f5904146c509d28b1a0.gif",
        shortDescription: "Проекты SW3XXT: Инновации и творчество"
    },    
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