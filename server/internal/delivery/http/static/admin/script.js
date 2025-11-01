document.addEventListener('DOMContentLoaded', () => {
	const API_BASE_URL = '/admin'
	const tokenInput = document.getElementById('admin-token')
	const saveTokenBtn = document.getElementById('save-token')
	const statusMessage = document.getElementById('status-message')

	// Навигация
	const navRaffleBtn = document.getElementById('nav-raffle')
	const navWaitlistBtn = document.getElementById('nav-waitlist')
	const navWaitlistResBtn = document.getElementById('nav-waitlist-res') // 🔥 НОВЫЙ
	const raffleView = document.getElementById('raffle-view')
	const waitlistView = document.getElementById('waitlist-view')
	const waitlistResView = document.getElementById('waitlist-res-view') // 🔥 НОВЫЙ

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

	// Вайтлист (Заявки)
	const refreshWaitlistBtn = document.getElementById('refresh-waitlist')
	const clearWaitlistBtn = document.getElementById('clear-waitlist')
	const waitlistCount = document.getElementById('waitlist-count')
	const waitlistBody = document.getElementById('waitlist-body')

	// 🔥 НОВЫЕ: Вайтлист (Результаты)
	const refreshWaitlistResBtn = document.getElementById('refresh-waitlist-res')
	const clearWaitlistResBtn = document.getElementById('clear-waitlist-res')
	const waitlistResCount = document.getElementById('waitlist-res-count')
	const waitlistResBody = document.getElementById('waitlist-res-body')

	// --- АУТЕНТИФИКАЦИЯ (без изменений) ---
	const savedToken = sessionStorage.getItem('adminToken')
	if (savedToken) {
		tokenInput.value = savedToken
	}
	saveTokenBtn.addEventListener('click', () => {
		const token = tokenInput.value.trim()
		if (!token) {
			showStatus('Ошибка: Введите токен.', 'error')
			return
		}
		sessionStorage.setItem('adminToken', token)
		showStatus('Токен успешно сохранен в сессии.', 'success')
		loadParticipants()
		loadWinners()
	})
	const getAuthHeader = () => {
		/* ... (без изменений) ... */
	}

	// --- УТИЛИТЫ (без изменений) ---
	const showStatus = (message, type) => {
		/* ... (без изменений) ... */
	}
	const fetchData = async (endpoint, options = {}) => {
		/* ... (без изменений) ... */
	}

	// --- ФУНКЦИИ РЕНДЕРА ---
	const renderRaffleTable = (data, bodyElement, countElement) => {
		/* ... (без изменений) ... */
	}
	const renderWaitlistTable = data => {
		/* ... (без изменений) ... */
	}

	// 🔥 НОВАЯ ФУНКЦИЯ: Рендер таблицы результатов вайтлиста
	const renderWaitlistResTable = data => {
		waitlistResBody.innerHTML = ''
		const items = Array.isArray(data) ? data : []
		waitlistResCount.textContent = items.length

		if (items.length === 0) {
			waitlistResBody.innerHTML =
				'<tr><td colspan="6" style="text-align: center;">Нет данных</td></tr>'
			return
		}

		items.forEach(item => {
			const row = document.createElement('tr')
			const checkedText = item.checked ? 'Да' : 'Нет'
			const checkedAt = item.checked_at
				? new Date(item.checked_at).toLocaleString()
				: '-'

			row.innerHTML = `
                <td>${item.id || '-'}</td>
                <td>${item.wallet_address || '-'}</td>
                <td>${item.result || '-'}</td>
                <td>${checkedText}</td>
                <td>${checkedAt}</td>
                <td>
                    <button class="small-danger delete-btn" data-id="${
											item.id
										}" data-type="waitlist-res">
                        Удалить
                    </button>
                </td>
            `
			waitlistResBody.appendChild(row)
		})
	}

	// --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---
	const loadParticipants = async () => {
		/* ... (без изменений) ... */
	}
	const loadWinners = async () => {
		/* ... (без изменений) ... */
	}
	const loadWaitlist = async () => {
		/* ... (без изменений) ... */
	}

	// 🔥 НОВЫЙ: Загрузка результатов вайтлиста
	const loadWaitlistRes = async () => {
		const data = await fetchData('/waitlist-res')
		if (data) {
			renderWaitlistResTable(data)
		}
	}

	// Обработчики очистки
	clearParticipantsBtn.addEventListener('click', async () => {
		/* ... (без изменений) ... */
	})
	clearWinnersBtn.addEventListener('click', async () => {
		/* ... (без изменений) ... */
	})
	clearWaitlistBtn.addEventListener('click', async () => {
		/* ... (без изменений) ... */
	})

	// 🔥 НОВЫЙ: Очистка результатов вайтлиста
	clearWaitlistResBtn.addEventListener('click', async () => {
		if (!confirm('Вы уверены, что хотите очистить ВСЕ результаты вайтлиста?'))
			return
		const result = await fetchData('/waitlist-res', { method: 'DELETE' })
		if (result) {
			showStatus('Все результаты вайтлиста полностью очищены.', 'success')
			loadWaitlistRes()
		}
	})

	// Выбор победителей
	selectWinnersForm.addEventListener('submit', async e => {
		/* ... (без изменений) ... */
	})

	// 🔥 ОБНОВЛЕНИЕ: Глобальный обработчик удаления
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
				// 🔥 НОВЫЙ СЛУЧАЙ
				case 'waitlist-res':
					endpoint = `/waitlist-res/${id}`
					reloadFunction = loadWaitlistRes
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

	// --- 🔥 ОБНОВЛЕНИЕ: НАВИГАЦИЯ ---
	navRaffleBtn.addEventListener('click', () => {
		raffleView.classList.remove('hidden')
		waitlistView.classList.add('hidden')
		waitlistResView.classList.add('hidden') // Скрываем новую

		navRaffleBtn.classList.add('active')
		navWaitlistBtn.classList.remove('active')
		navWaitlistResBtn.classList.remove('active')
	})

	navWaitlistBtn.addEventListener('click', () => {
		raffleView.classList.add('hidden')
		waitlistView.classList.remove('hidden')
		waitlistResView.classList.add('hidden') // Скрываем новую

		navRaffleBtn.classList.remove('active')
		navWaitlistBtn.classList.add('active')
		navWaitlistResBtn.classList.remove('active')

		loadWaitlist()
	})

	navWaitlistResBtn.addEventListener('click', () => {
		raffleView.classList.add('hidden')
		waitlistView.classList.add('hidden')
		waitlistResView.classList.remove('hidden') // Показываем новую

		navRaffleBtn.classList.remove('active')
		navWaitlistBtn.classList.remove('active')
		navWaitlistResBtn.classList.add('active')

		loadWaitlistRes() // Загружаем данные при переключении
	})

	// --- ОБРАБОТЧИКИ ОБНОВЛЕНИЯ ---
	refreshParticipantsBtn.addEventListener('click', loadParticipants)
	refreshWinnersBtn.addEventListener('click', loadWinners)
	refreshWaitlistBtn.addEventListener('click', loadWaitlist)
	refreshWaitlistResBtn.addEventListener('click', loadWaitlistRes) 

	// --- АВТОЗАГРУЗКА ДАННЫХ ---
	if (sessionStorage.getItem('adminToken')) {
		// Загружаем только данные для первой активной вкладки
		loadParticipants()
		loadWinners()
	}
})
