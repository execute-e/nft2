document.addEventListener('DOMContentLoaded', () => {
	const API_BASE_URL = `https://the-monicorns-production.up.railway.app/admin` //  TODO: заменить на реальный урл
	const tokenInput = document.getElementById('admin-token')
	const saveTokenBtn = document.getElementById('save-token')
	const statusMessage = document.getElementById('status-message')

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

	// --- АУТЕНТИФИКАЦИЯ ---
	tokenInput.value = sessionStorage.getItem('adminToken') || ''

	saveTokenBtn.addEventListener('click', () => {
		sessionStorage.setItem('adminToken', tokenInput.value)
		showStatus('Токен сохранен в сессии.', 'success')
	})

	const getAuthHeader = () => {
		const token = sessionStorage.getItem('adminToken')
		if (!token) {
			showStatus('Ошибка: Admin Token не установлен.', 'error')
			return null
		}
		return { Authorization: `Bearer ${token}` }
	}

	// --- Утилиты ---
	const showStatus = (message, type) => {
		statusMessage.textContent = message
		statusMessage.className = type
		setTimeout(() => (statusMessage.className = ''), 4000)
	}

	const renderTable = (data, bodyElement, countElement) => {
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

	const fetchData = async (endpoint, options = {}) => {
		const headers = getAuthHeader()
		if (!headers) return

		try {
			const response = await fetch(`${API_BASE_URL}${endpoint}`, {
				...options,
				headers: { ...headers, ...options.headers },
			})
			if (!response.ok) {
				const err = await response.json()
				throw new Error(err.error || `HTTP error! status: ${response.status}`)
			}
			if (
				response.status === 204 ||
				(response.status === 200 &&
					response.headers.get('Content-Length') === '0')
			) {
				return null // No content
			}
			return await response.json()
		} catch (error) {
			showStatus(`Ошибка: ${error.message}`, 'error')
			return null
		}
	}

	// --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

	// Участники
	const loadParticipants = async () => {
		const data = await fetchData('/participants')
		if (data) renderTable(data, participantsBody, participantsCount)
	}

	clearParticipantsBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите удалить ВСЕХ участников?')) return
		await fetchData('/participants', { method: 'DELETE' })
		showStatus('Все участники удалены.', 'success')
		loadParticipants()
	})

	// Победители
	const loadWinners = async () => {
		const data = await fetchData('/winners')
		if (data) renderTable(data, winnersBody, winnersCount)
	}

	clearWinnersBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите удалить ВСЕХ победителей?')) return
		await fetchData('/winners', { method: 'DELETE' })
		showStatus('Все победители удалены.', 'success')
		loadWinners()
	})

	selectWinnersForm.addEventListener('submit', async e => {
		e.preventDefault()
		const limit = parseInt(winnersLimitInput.value, 10)
		if (limit < 1) {
			showStatus('Лимит должен быть больше 0.', 'error')
			return
		}
		const newWinners = await fetchData('/winners', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ limit }),
		})
		if (newWinners) {
			showStatus(`${newWinners.length} победителей выбрано!`, 'success')
			loadParticipants()
			loadWinners()
		}
	})

	// Удаление по ID (один обработчик на обе таблицы)
	document.body.addEventListener('click', async e => {
		if (e.target.matches('.delete-btn')) {
			const id = e.target.dataset.id
			const type = e.target.dataset.type
			const endpoint =
				type === 'participant' ? `/participants/${id}` : `/winners/${id}`

			if (!confirm(`Удалить запись с ID ${id}?`)) return

			await fetchData(endpoint, { method: 'DELETE' })
			showStatus(`Запись с ID ${id} удалена.`, 'success')

			if (type === 'participant') loadParticipants()
			else loadWinners()
		}
	})

	// --- ЗАГРУЗКА ДАННЫХ ---
	refreshParticipantsBtn.addEventListener('click', loadParticipants)
	refreshWinnersBtn.addEventListener('click', loadWinners)

	// Первоначальная загрузка
	if (sessionStorage.getItem('adminToken')) {
		loadParticipants()
		loadWinners()
	}
})
