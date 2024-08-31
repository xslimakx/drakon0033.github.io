let connection;
let wallet;

document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('token-creation-form');
    const resultDiv = document.getElementById('result');
    const connectedWalletDiv = document.getElementById('connected-wallet');

    // Инициализация подключения к Solana devnet
    connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    // Обработчики для кнопок подключения кошельков
    document.getElementById('connect-phantom').addEventListener('click', () => connectWallet('phantom'));
    document.getElementById('connect-solflare').addEventListener('click', () => connectWallet('solflare'));
    document.getElementById('connect-okx').addEventListener('click', () => connectWallet('okx'));
    document.getElementById('connect-metamask').addEventListener('click', () => connectWallet('metamask'));

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
        const revokeMintAuthority = document.getElementById('revoke-mint-authority').checked;
        const revokeFreezeAuthority = document.getElementById('revoke-freeze-authority').checked;
        const revokeMetadataAuthority = document.getElementById('revoke-metadata-authority').checked;

        try {
            const result = await createSolanaToken(tokenName, tokenSymbol, totalSupply, tokenIcon, revokeMintAuthority, revokeFreezeAuthority, revokeMetadataAuthority);
            resultDiv.innerHTML = `<p>Токен успешно создан!</p><p>Адрес токена: ${result}</p>`;
        } catch (error) {
            resultDiv.innerHTML = `<p>Ошибка: ${error.message}</p>`;
        }
    });
});

async function connectWallet(walletName) {
    let provider;

    switch(walletName) {
        case 'phantom':
            provider = window.solana;
            break;
        case 'solflare':
            provider = window.solflare;
            break;
        case 'okx':
            provider = window.okxwallet;
            break;
        case 'metamask':
            provider = window.ethereum;
            break;
        default:
            alert('Неизвестный тип кошелька');
            return;
    }

    if (!provider) {
        alert(`${walletName.charAt(0).toUpperCase() + walletName.slice(1)} кошелек не установлен!`);
        return;
    }

    try {
        if (walletName === 'metamask') {
            await provider.request({ method: 'eth_requestAccounts' });
            const accounts = await provider.request({ method: 'eth_accounts' });
            wallet = accounts[0];
        } else {
            await provider.connect();
            wallet = provider;
        }

        document.getElementById('connected-wallet').innerText = `Подключен кошелек: ${wallet.publicKey || wallet}`;
        document.getElementById('token-creation-form').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert('Ошибка при подключении кошелька');
    }
}

async function createSolanaToken(name, symbol, totalSupply, iconUrl, revokeMintAuthority, revokeFreezeAuthority, revokeMetadataAuthority) {
    // Создание минта
    const mint = await splToken.Token.createMint(
        connection,
        wallet,
        wallet.publicKey,
        revokeFreezeAuthority ? null : wallet.publicKey,
        9, // 9 десятичных знаков
        splToken.TOKEN_PROGRAM_ID
    );

    // Создание ассоциированного токен-аккаунта для владельца
    const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(wallet.publicKey);

    // Минтинг токенов
    await mint.mintTo(tokenAccount.address, wallet.publicKey, [], totalSupply);

    // Установка метаданных токена
    // Примечание: это упрощенная версия, в реальности вам нужно будет использовать Metaplex для установки метаданных
    console.log('Метаданные токена:', { name, symbol, uri: iconUrl });

    // Отзыв прав на минтинг, если выбрано
    if (revokeMintAuthority) {
        await mint.setAuthority(mint.publicKey, null, 'MintTokens', wallet.publicKey, []);
    }

    // Отзыв прав на изменение метаданных, если выбрано
    if (revokeMetadataAuthority) {
        // Здесь должен быть код для отзыва прав на изменение метаданных
        // Это требует использования Metaplex, который не включен в этот пример
        console.log('Отзыв прав на изменение метаданных');
    }

    return mint.publicKey.toString();
}