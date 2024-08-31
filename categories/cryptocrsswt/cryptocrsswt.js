const solanaWeb3 = window.solanaWeb3;
const splToken = window.splToken;
const mplTokenMetadata = window.mplTokenMetadata;

let connection;
let wallet;

document.addEventListener('DOMContentLoaded', async function() {
    const connectButton = document.getElementById('connect-wallet');
    const createTokenSection = document.getElementById('create-token');
    const myTokensSection = document.getElementById('my-tokens');
    const welcomeSection = document.getElementById('welcome');
    const form = document.getElementById('token-creation-form');
    const navLinks = document.querySelectorAll('nav a');
    const modal = document.getElementById('wallet-modal');
    const walletOptions = document.querySelectorAll('.wallet-option');

    // Инициализация подключения к Solana devnet
    connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    connectButton.addEventListener('click', showWalletModal);

    walletOptions.forEach(option => {
        option.addEventListener('click', () => {
            const walletType = option.getAttribute('data-wallet');
            connectWallet(walletType);
            modal.style.display = 'none';
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const target = link.textContent;
            if (target === 'Главная') {
                welcomeSection.style.display = 'block';
                createTokenSection.style.display = 'none';
                myTokensSection.style.display = 'none';
            } else if (target === 'Создать токен') {
                welcomeSection.style.display = 'none';
                createTokenSection.style.display = 'block';
                myTokensSection.style.display = 'none';
            } else if (target === 'Мои токены') {
                welcomeSection.style.display = 'none';
                createTokenSection.style.display = 'none';
                myTokensSection.style.display = 'block';
                displayMyTokens();
            }
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!wallet) {
            alert('Пожалуйста, подключите кошелек перед созданием токена.');
            return;
        }

        const tokenName = document.getElementById('token-name').value;
        const tokenSymbol = document.getElementById('token-symbol').value;
        const totalSupply = document.getElementById('total-supply').value;
        const tokenIcon = document.getElementById('token-icon').value;
        const metadataUri = document.getElementById('metadata-uri').value;
        const revokeMintAuthority = document.getElementById('revoke-mint-authority').checked;
        const revokeFreezeAuthority = document.getElementById('revoke-freeze-authority').checked;
        const revokeMetadataAuthority = document.getElementById('revoke-metadata-authority').checked;

        try {
            const result = await createSolanaToken(tokenName, tokenSymbol, totalSupply, tokenIcon, metadataUri, revokeMintAuthority, revokeFreezeAuthority, revokeMetadataAuthority);
            alert(`Токен успешно создан! Адрес токена: ${result}`);
            form.reset();
            displayMyTokens();
        } catch (error) {
            alert(`Ошибка при создании токена: ${error.message}`);
        }
    });

    // Добавляем обработчики событий для предпросмотра токена
    document.getElementById('token-name').addEventListener('input', updateTokenPreview);
    document.getElementById('token-symbol').addEventListener('input', updateTokenPreview);
    document.getElementById('token-icon').addEventListener('input', updateTokenPreview);
});

function showWalletModal() {
    const modal = document.getElementById('wallet-modal');
    modal.style.display = 'block';
}

async function connectWallet(walletType) {
    let provider;

    switch (walletType) {
        case 'phantom':
            if (window.solana && window.solana.isPhantom) {
                provider = window.solana;
            } else {
                alert('Пожалуйста, установите Phantom');
                return;
            }
            break;
        case 'solflare':
            if (window.solflare) {
                provider = window.solflare;
            } else {
                alert('Пожалуйста, установите Solflare');
                return;
            }
            break;
        default:
            alert('Неподдерживаемый тип кошелька');
            return;
    }

    try {
        await provider.connect();
        wallet = new solanaWeb3.Wallet(provider);
        console.log('Wallet connected:', wallet.publicKey.toString());
        document.getElementById('connect-wallet').textContent = 'Кошелек подключен';
        document.getElementById('connect-wallet').disabled = true;
    } catch (err) {
        console.error('Error connecting to wallet:', err);
        alert('Ошибка при подключении кошелька');
    }
}

async function createSolanaToken(name, symbol, totalSupply, iconUrl, metadataUri, revokeMintAuthority, revokeFreezeAuthority, revokeMetadataAuthority) {
    if (!wallet) {
        throw new Error('Кошелек не подключен');
    }

    try {
        // Создаем минт (новый токен)
        const mintAccount = await splToken.Token.createMint(
            connection,
            wallet,
            wallet.publicKey,
            revokeFreezeAuthority ? null : wallet.publicKey,
            9, // 9 десятичных знаков
            splToken.TOKEN_PROGRAM_ID
        );

        console.log('Mint account created:', mintAccount.publicKey.toString());

        // Создаем аккаунт токена для владельца
        const tokenAccount = await mintAccount.createAccount(wallet.publicKey);
        console.log('Token account created:', tokenAccount.toString());

        // Минтим токены
        await mintAccount.mintTo(
            tokenAccount,
            wallet.publicKey,
            [],
            totalSupply * 1e9 // Умножаем на 1e9 из-за 9 десятичных знаков
        );

        console.log('Tokens minted');

        if (revokeMintAuthority) {
            await mintAccount.setAuthority(
                mintAccount.publicKey,
                null,
                'MintTokens',
                wallet.publicKey,
                []
            );
            console.log('Mint authority revoked');
        }

        // Создаем метаданные токена
        const metadataPDA = await mplTokenMetadata.Metadata.getPDA(mintAccount.publicKey);
        const metadataTx = new mplTokenMetadata.CreateMetadataV2(
            { feePayer: wallet.publicKey },
            {
                metadata: metadataPDA,
                metadataData: new mplTokenMetadata.DataV2({
                    name: name,
                    symbol: symbol,
                    uri: metadataUri,
                    sellerFeeBasisPoints: 0,
                    creators: [{ address: wallet.publicKey, verified: true, share: 100 }],
                    collection: null,
                    uses: null
                }),
                updateAuthority: revokeMetadataAuthority ? null : wallet.publicKey,
                mint: mintAccount.publicKey,
                mintAuthority: wallet.publicKey
            }
        );

        const metadataTxId = await solanaWeb3.sendAndConfirmTransaction(connection, metadataTx, [wallet]);
        console.log('Metadata created:', metadataTxId);

        // Сохраняем информацию о токене
        const tokenInfo = { 
            name, 
            symbol, 
            address: mintAccount.publicKey.toString(), 
            icon: iconUrl,
            creator: 's3xcommunity'
        };
        let myTokens = JSON.parse(localStorage.getItem('myTokens')) || [];
        myTokens.push(tokenInfo);
        localStorage.setItem('myTokens', JSON.stringify(myTokens));

        return mintAccount.publicKey.toString();
    } catch (error) {
        console.error('Error creating token:', error);
        throw error;
    }
}

function displayMyTokens() {
    const tokenList = document.getElementById('token-list');
    tokenList.innerHTML = '';
    const myTokens = JSON.parse(localStorage.getItem('myTokens')) || [];

    myTokens.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.className = 'token-card';
        tokenCard.innerHTML = `
            <h3>${token.name} (${token.symbol})</h3>
            <p>Адрес: ${token.address}</p>
            <p>Создатель: ${token.creator}</p>
            ${token.icon ? `<img src="${token.icon}" alt="${token.name} icon" style="width: 50px; height: 50px;">` : ''}
        `;
        tokenList.appendChild(tokenCard);
    });
}

function updateTokenPreview() {
    const name = document.getElementById('token-name').value;
    const symbol = document.getElementById('token-symbol').value;
    const iconUrl = document.getElementById('token-icon').value;

    const previewContent = document.querySelector('.preview-content');
    previewContent.innerHTML = `
        ${iconUrl ? `<img src="${iconUrl}" alt="Token Icon">` : ''}
        <div>
            <h4>${name || 'Название токена'}</h4>
            <p>${symbol || 'СИМВОЛ'}</p>
            <p>Создатель: s3xcommunity</p>
        </div>
    `;
}

// Закрытие модального окна при клике вне его содержимого
window.onclick = function(event) {
    const modal = document.getElementById('wallet-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}