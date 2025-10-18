document.addEventListener('DOMContentLoaded', () => {
	const API_BASE_URL = 'http://localhost:8080/admin'
	const tokenInput = document.getElementById('admin-token')
	const saveTokenBtn = document.getElementById('save-token')
	const statusMessage = document.getElementById('status-message')

	// Навигация
	const navRaffleBtn = document.getElementById('nav-raffle')
	const navWaitlistBtn = document.getElementById('nav-waitlist')
	const raffleView = document.getElementById('raffle-view')
	const waitlistView = document.getElementById('waitlist-view')

	// Участники
	const refreshParticipantsBtn = document.getElementById('refresh-participants')
	const clearParticipantsBtn = document.getElementById('clear-participants')
	const participantsCount = document.getElementById('participants-count')
	const participantsBody = document.getElementById('participants-body')

	// Победители
	const selectWinnersForm = document.getElementById('select-winners-form')
	const refreshWinnersBtn = document.getElementById('refresh-winners')
	const clearWinnersBtn = document.getElementById('clear-winners')
	const winnersCount = document.getElementById('winners-count')
	const winnersBody = document.getElementById('winners-body')
	const winnersLimitInput = document.getElementById('winners-limit')

	// Вайтлист
	const refreshWaitlistBtn = document.getElementById('refresh-waitlist')
	const clearWaitlistBtn = document.getElementById('clear-waitlist')
	const waitlistCount = document.getElementById('waitlist-count')
	const waitlistBody = document.getElementById('waitlist-body')

	// --- АУТЕНТИФИКАЦИЯ ---
	// Загрузка токена из sessionStorage при запуске
	const savedToken = sessionStorage.getItem('adminToken')
	if (savedToken) {
		tokenInput.value = savedToken
	}

	// Сохранение токена
	saveTokenBtn.addEventListener('click', () => {
		const token = tokenInput.value.trim()
		if (!token) {
			showStatus('Ошибка: Введите токен.', 'error')
			return
		}
		sessionStorage.setItem('adminToken', token)
		showStatus('Токен успешно сохранен в сессии.', 'success')
		// Автоматически загружаем данные после сохранения токена
		loadParticipants()
		loadWinners()
	})

	// Получение заголовка авторизации
	const getAuthHeader = () => {
		const token = sessionStorage.getItem('adminToken')
		if (!token) {
			showStatus(
				'Ошибка: Admin Token не установлен. Сохраните токен сначала.',
				'error'
			)
			return null
		}
		return { Authorization: `Bearer ${token}` }
	}

	// --- УТИЛИТЫ ---
	// Показать статус-сообщение
	const showStatus = (message, type) => {
		statusMessage.textContent = message
		statusMessage.className = type
		statusMessage.style.display = 'block'
		setTimeout(() => {
			statusMessage.className = ''
			statusMessage.style.display = 'none'
		}, 4000)
	}

	// Универсальная функция для запросов к API
	const fetchData = async (endpoint, options = {}) => {
		const headers = getAuthHeader()
		if (!headers) return null

		try {
			const response = await fetch(`${API_BASE_URL}${endpoint}`, {
				...options,
				headers: {
					...headers,
					'Content-Type': 'application/json',
					...options.headers,
				},
			})

			// Проверка статуса ответа
			if (!response.ok) {
				let errorMessage = `HTTP ошибка! Статус: ${response.status}`
				try {
					const errorData = await response.json()
					errorMessage = errorData.error || errorData.message || errorMessage
				} catch (e) {
					// Если не удалось распарсить JSON, используем текстовое сообщение
					const errorText = await response.text()
					if (errorText) errorMessage = errorText
				}
				throw new Error(errorMessage)
			}

			// Обработка пустых ответов (для DELETE запросов)
			const contentType = response.headers.get('content-type')
			const contentLength = response.headers.get('content-length')

			if (response.status === 204 || contentLength === '0') {
				return true
			}

			// Если есть JSON в ответе
			if (contentType && contentType.includes('application/json')) {
				return await response.json()
			}

			return true
		} catch (error) {
			showStatus(`Ошибка: ${error.message}`, 'error')
			console.error('Fetch error:', error)
			return null
		}
	}

	// --- ФУНКЦИИ РЕНДЕРА ---
	const renderRaffleTable = (data, bodyElement, countElement) => {
		bodyElement.innerHTML = ''
		const items = Array.isArray(data) ? data : []
		countElement.textContent = items.length

		if (items.length === 0) {
			bodyElement.innerHTML =
				'<tr><td colspan="5" style="text-align: center;">Нет данных</td></tr>'
			return
		}

		items.forEach(item => {
			const type = bodyElement.id.includes('participant')
				? 'participant'
				: 'winner'
			const row = document.createElement('tr')
			row.innerHTML = `
				<td>${item.id || '-'}</td>
				<td>${item.twitter_username || '-'}</td>
				<td>${item.discord_username || '-'}</td>
				<td>${item.wallet_address || '-'}</td>
				<td>
					<button class="small-danger delete-btn" data-id="${
						item.id
					}" data-type="${type}">
						Удалить
					</button>
				</td>
			`
			bodyElement.appendChild(row)
		})
	}

	const renderWaitlistTable = data => {
		waitlistBody.innerHTML = ''
		const items = Array.isArray(data) ? data : []
		waitlistCount.textContent = items.length

		if (items.length === 0) {
			waitlistBody.innerHTML =
				'<tr><td colspan="3" style="text-align: center;">Нет данных</td></tr>'
			return
		}

		items.forEach(item => {
			const row = document.createElement('tr')
			row.innerHTML = `
				<td>${item.id || '-'}</td>
				<td>${item.wallet_address || '-'}</td>
				<td>
					<button class="small-danger delete-btn" data-id="${
						item.id
					}" data-type="waitlist">
						Удалить
					</button>
				</td>
			`
			waitlistBody.appendChild(row)
		})
	}

	// --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---
	const loadParticipants = async () => {
		const data = await fetchData('/participants')
		if (data) {
			renderRaffleTable(data, participantsBody, participantsCount)
		}
	}

	const loadWinners = async () => {
		const data = await fetchData('/winners')
		if (data) {
			renderRaffleTable(data, winnersBody, winnersCount)
		}
	}

	const loadWaitlist = async () => {
		const data = await fetchData('/waitlist')
		if (data) {
			renderWaitlistTable(data)
		}
	}

	// Очистка всех участников
	clearParticipantsBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите удалить ВСЕХ участников?')) return
		const result = await fetchData('/participants', { method: 'DELETE' })
		if (result) {
			showStatus('Все участники успешно удалены.', 'success')
			loadParticipants()
		}
	})

	// Очистка всех победителей
	clearWinnersBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите удалить ВСЕХ победителей?')) return
		const result = await fetchData('/winners', { method: 'DELETE' })
		if (result) {
			showStatus('Все победители успешно удалены.', 'success')
			loadWinners()
		}
	})

	// Очистка вайтлиста
	clearWaitlistBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите очистить ВЕСЬ вайтлист?')) return
		const result = await fetchData('/waitlist', { method: 'DELETE' })
		if (result) {
			showStatus('Вайтлист полностью очищен.', 'success')
			loadWaitlist()
		}
	})

	// Выбор победителей
	selectWinnersForm.addEventListener('submit', async e => {
		e.preventDefault()
		const limit = parseInt(winnersLimitInput.value, 10)

		if (isNaN(limit) || limit < 1) {
			showStatus('Ошибка: Лимит должен быть числом больше 0.', 'error')
			return
		}

		const newWinners = await fetchData('/winners', {
			method: 'POST',
			body: JSON.stringify({ limit }),
		})

		if (newWinners) {
			const count = Array.isArray(newWinners) ? newWinners.length : 0
			showStatus(`Успех! Выбрано победителей: ${count}`, 'success')
			loadParticipants()
			loadWinners()
		}
	})

	// Удаление отдельной записи
	document.body.addEventListener('click', async e => {
		if (e.target && e.target.matches('.delete-btn')) {
			const id = e.target.dataset.id
			const type = e.target.dataset.type

			if (!id || !type) {
				showStatus('Ошибка: Не удалось определить ID или тип записи.', 'error')
				return
			}

			if (!confirm(`Вы действительно хотите удалить запись с ID ${id}?`)) return

			let endpoint = ''
			let reloadFunction = null

			switch (type) {
				case 'participant':
					endpoint = `/participants/${id}`
					reloadFunction = loadParticipants
					break
				case 'winner':
					endpoint = `/winners/${id}`
					reloadFunction = loadWinners
					break
				case 'waitlist':
					endpoint = `/waitlist/${id}`
					reloadFunction = loadWaitlist
					break
				default:
					showStatus('Ошибка: Неизвестный тип записи.', 'error')
					return
			}

			const result = await fetchData(endpoint, { method: 'DELETE' })
			if (result) {
				showStatus(`Запись с ID ${id} успешно удалена.`, 'success')
				if (reloadFunction) reloadFunction()
			}
		}
	})

	// --- НАВИГАЦИЯ ---
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
		loadWaitlist()
	})

	// --- ОБРАБОТЧИКИ ОБНОВЛЕНИЯ ---
	refreshParticipantsBtn.addEventListener('click', loadParticipants)
	refreshWinnersBtn.addEventListener('click', loadWinners)
	refreshWaitlistBtn.addEventListener('click', loadWaitlist)

	// --- АВТОЗАГРУЗКА ДАННЫХ ---
	// Если токен уже сохранен, загружаем данные при старте
	if (sessionStorage.getItem('adminToken')) {
		loadParticipants()
		loadWinners()
	}
})
