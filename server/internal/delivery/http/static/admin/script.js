document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8080/admin';
    const tokenInput = document.getElementById('admin-token');
    const saveTokenBtn = document.getElementById('save-token');
    const statusMessage = document.getElementById('status-message');

    // Навигация
    const navRaffleBtn = document.getElementById('nav-raffle');
    const navWaitlistBtn = document.getElementById('nav-waitlist');
    const raffleView = document.getElementById('raffle-view');
    const waitlistView = document.getElementById('waitlist-view');

    // Участники
    const refreshParticipantsBtn = document.getElementById('refresh-participants');
    const clearParticipantsBtn = document.getElementById('clear-participants');
    const participantsCount = document.getElementById('participants-count');
    const participantsBody = document.getElementById('participants-body');

    // Победители
    const selectWinnersForm = document.getElementById('select-winners-form');
    const refreshWinnersBtn = document.getElementById('refresh-winners');
    const clearWinnersBtn = document.getElementById('clear-winners');
    const winnersCount = document.getElementById('winners-count');
    const winnersBody = document.getElementById('winners-body');
    const winnersLimitInput = document.getElementById('winners-limit');

    // Вайтлист
    const refreshWaitlistBtn = document.getElementById('refresh-waitlist');
    const clearWaitlistBtn = document.getElementById('clear-waitlist');
    const waitlistCount = document.getElementById('waitlist-count');
    const waitlistBody = document.getElementById('waitlist-body');

    // --- АУТЕНТИФИКАЦИЯ ---
    tokenInput.value = sessionStorage.getItem('adminToken') || '';
    saveTokenBtn.addEventListener('click', () => {
        sessionStorage.setItem('adminToken', tokenInput.value);
        showStatus('Токен сохранен в сессии.', 'success');
    });
    
    const getAuthHeader = () => {
        const token = sessionStorage.getItem('adminToken');
        if (!token) {
            showStatus('Ошибка: Admin Token не установлен.', 'error');
            return null;
        }
        return { 'Authorization': `Bearer ${token}` };
    };

    // --- Утилиты ---
    // 🔥 ФИКС: Реализована полная функция
    const showStatus = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = type;
        setTimeout(() => (statusMessage.className = ''), 4000);
    };

    // 🔥 ФИКС: Реализована полная функция
    const fetchData = async (endpoint, options = {}) => {
        const headers = getAuthHeader();
        if (!headers) return null;

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers },
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: `HTTP error! Status: ${response.status}` }));
                throw new Error(err.error || 'Unknown server error');
            }
            if (response.status === 204 || (response.status === 200 && response.headers.get('Content-Length') === '0')) {
                return true; // Возвращаем true для успешных DELETE/POST без ответа
            }
            return await response.json();
        } catch (error) {
            showStatus(`Ошибка: ${error.message}`, 'error');
            return null;
        }
    };

    // --- ФУНКЦИИ РЕНДЕРА ---
    const renderRaffleTable = (data, bodyElement, countElement) => {
        bodyElement.innerHTML = '';
        const items = data || [];
        countElement.textContent = items.length;
        if (items.length === 0) {
            bodyElement.innerHTML = '<tr><td colspan="5">Нет данных</td></tr>';
            return;
        }
        items.forEach(item => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.twitter_username}</td>
                    <td>${item.discord_username}</td>
                    <td>${item.wallet_address}</td>
                    <td>
                        <button class="small-danger delete-btn" data-id="${item.id}" data-type="${bodyElement.id.includes('participant') ? 'participant' : 'winner'}">
                            Удалить
                        </button>
                    </td>
                </tr>
            `;
            bodyElement.insertAdjacentHTML('beforeend', row);
        });
    };

    const renderWaitlistTable = (data) => {
        waitlistBody.innerHTML = '';
        const items = data || [];
        waitlistCount.textContent = items.length;
        if (items.length === 0) {
            waitlistBody.innerHTML = '<tr><td colspan="3">Нет данных</td></tr>';
            return;
        }
        items.forEach(item => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.wallet_address}</td>
                    <td>
                        <button class="small-danger delete-btn" data-id="${item.id}" data-type="waitlist">
                            Удалить
                        </button>
                    </td>
                </tr>
            `;
            waitlistBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---
    const loadParticipants = async () => {
        const data = await fetchData('/participants');
        renderRaffleTable(data, participantsBody, participantsCount);
    };

    const loadWinners = async () => {
        const data = await fetchData('/winners');
        renderRaffleTable(data, winnersBody, winnersCount);
    };

    const loadWaitlist = async () => {
        const data = await fetchData('/waitlist');
        renderWaitlistTable(data);
    };

    clearParticipantsBtn.addEventListener('click', async () => {
        if (!confirm('Вы уверены, что хотите удалить ВСЕХ участников?')) return;
        const result = await fetchData('/participants', { method: 'DELETE' });
        if (result) {
            showStatus('Все участники удалены.', 'success');
            loadParticipants();
        }
    });

    clearWinnersBtn.addEventListener('click', async () => {
        if (!confirm('Вы уверены, что хотите удалить ВСЕХ победителей?')) return;
        const result = await fetchData('/winners', { method: 'DELETE' });
        if (result) {
            showStatus('Все победители удалены.', 'success');
            loadWinners();
        }
    });

    clearWaitlistBtn.addEventListener('click', async () => {
        if (!confirm('Вы уверены, что хотите очистить ВЕСЬ вайтлист?')) return;
        const result = await fetchData('/waitlist', { method: 'DELETE' });
        if (result)