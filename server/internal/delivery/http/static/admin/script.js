document.addEventListener('DOMContentLoaded', () => {
	const API_BASE_URL = 'http://localhost:8080/admin'
	const tokenInput = document.getElementById('admin-token')
	const saveTokenBtn = document.getElementById('save-token')
	const statusMessage = document.getElementById('status-message')

	// 🔥 Элементы навигации
	const navRaffleBtn = document.getElementById('nav-raffle')
	const navWaitlistBtn = document.getElementById('nav-waitlist')
	const raffleView = document.getElementById('raffle-view')
	const waitlistView = document.getElementById('waitlist-view')

	// Элементы для участников
	const refreshParticipantsBtn = document.getElementById('refresh-participants')
	const clearParticipantsBtn = document.getElementById('clear-participants')
	const participantsCount = document.getElementById('participants-count')
	const participantsBody = document.getElementById('participants-body')

	// Элементы для победителей
	const selectWinnersForm = document.getElementById('select-winners-form')
	const refreshWinnersBtn = document.getElementById('refresh-winners')
	const clearWinnersBtn = document.getElementById('clear-winners')
	const winnersCount = document.getElementById('winners-count')
	const winnersBody = document.getElementById('winners-body')
	const winnersLimitInput = document.getElementById('winners-limit')

	// 🔥 Элементы для вайтлиста
	const refreshWaitlistBtn = document.getElementById('refresh-waitlist')
	const clearWaitlistBtn = document.getElementById('clear-waitlist')
	const waitlistCount = document.getElementById('waitlist-count')
	const waitlistBody = document.getElementById('waitlist-body')

	// --- АУТЕНТИФИКАЦИЯ (БЕЗ ИЗМЕНЕНИЙ) ---
	tokenInput.value = sessionStorage.getItem('adminToken') || ''
	saveTokenBtn.addEventListener('click', () => {
		sessionStorage.setItem('adminToken', tokenInput.value)
		showStatus('Токен сохранен в сессии.', 'success')
	})
	const getAuthHeader = () => {
		/* ... (без изменений) ... */
	}

	// --- Утилиты (БЕЗ ИЗМЕНЕНИЙ) ---
	const showStatus = (message, type) => {
		/* ... (без изменений) ... */
	}
	const fetchData = async (endpoint, options = {}) => {
		/* ... (без изменений) ... */
	}

	// --- ФУНКЦИИ РЕНДЕРА ТАБЛИЦ ---
	const renderParticipantsTable = (data, bodyElement, countElement) => {
		/* ... (переименовано из renderTable) ... */
	}

	// 🔥 Новая функция для рендера таблицы вайтлиста
	const renderWaitlistTable = data => {
		waitlistBody.innerHTML = ''
		waitlistCount.textContent = data.length
		if (!data || data.length === 0) {
			waitlistBody.innerHTML = '<tr><td colspan="3">Нет данных</td></tr>'
			return
		}
		data.forEach(item => {
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
            `
			waitlistBody.insertAdjacentHTML('beforeend', row)
		})
	}

	// --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---
	// Розыгрыш
	const loadParticipants = async () => {
		/* ... (без изменений) ... */
	}
	const loadWinners = async () => {
		/* ... (без изменений) ... */
	}
	clearParticipantsBtn.addEventListener('click', async () => {
		/* ... (без изменений) ... */
	})
	clearWinnersBtn.addEventListener('click', async () => {
		/* ... (без изменений) ... */
	})
	selectWinnersForm.addEventListener('submit', async e => {
		/* ... (без изменений) ... */
	})

	// 🔥 Новые обработчики для вайтлиста
	const loadWaitlist = async () => {
		const data = await fetchData('/waitlist')
		if (data) renderWaitlistTable(data)
	}

	clearWaitlistBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите очистить ВЕСЬ вайтлист?')) return
		await fetchData('/waitlist', { method: 'DELETE' })
		showStatus('Вайтлист полностью очищен.', 'success')
		loadWaitlist()
	})

	// 🔥 ОБНОВЛЕННЫЙ обработчик удаления
	document.body.addEventListener('click', async e => {
		if (e.target.matches('.delete-btn')) {
			const id = e.target.dataset.id
			const type = e.target.dataset.type
			if (!confirm(`Удалить запись с ID ${id}?`)) return

			let endpoint = ''
			let reloadFunction = null

			if (type === 'participant') {
				endpoint = `/participants/${id}`
				reloadFunction = loadParticipants
			} else if (type === 'winner') {
				endpoint = `/winners/${id}`
				reloadFunction = loadWinners
			} else if (type === 'waitlist') {
				endpoint = `/waitlist/${id}`
				reloadFunction = loadWaitlist
			}

			if (endpoint) {
				await fetchData(endpoint, { method: 'DELETE' })
				showStatus(`Запись с ID ${id} удалена.`, 'success')
				reloadFunction()
			}
		}
	})

	// --- 🔥 ЛОГИКА НАВИГАЦИИ ---
	navRaffleBtn.addEventListener('click', () => {
		raffleView.classList.remove('hidden')
		waitlistView.classList.add('hidden')
		navRaffleBtn.classList.add('active')
		navWaitlistBtn.classList.remove('active')
	})

	navWaitlistBtn.addEventListener('click', () => {
		waitlistView.classList.remove('hidden')
		raffleView.classList.add('hidden')
		navWaitlistBtn.classList.add('active')
		navRaffleBtn.classList.remove('active')
		loadWaitlist() // Загружаем данные при переключении
	})

	// --- ЗАГРУЗКА ДАННЫХ ---
	refreshParticipantsBtn.addEventListener('click', loadParticipants)
	refreshWinnersBtn.addEventListener('click', loadWinners)
	refreshWaitlistBtn.addEventListener('click', loadWaitlist)

	if (sessionStorage.getItem('adminToken')) {
		loadParticipants()
		loadWinners()
	}

	// Переименование функции renderTable
	function renderTable(data, bodyElement, countElement) {
		bodyElement.innerHTML = ''
		countElement.textContent = data.length
		if (!data || data.length === 0) {
			bodyElement.innerHTML = '<tr><td colspan="5">Нет данных</td></tr>'
			return
		}
		data.forEach(item => {
			const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.twitter_username}</td>
                    <td>${item.discord_username}</td>
                    <td>${item.wallet_address}</td>
                    <td>
                        <button class="small-danger delete-btn" data-id="${
													item.id
												}" data-type="${
				bodyElement.id.includes('participant') ? 'participant' : 'winner'
			}">
                            Удалить
                        </button>
                    </td>
                </tr>
            `
			bodyElement.insertAdjacentHTML('beforeend', row)
		})
	}
})
