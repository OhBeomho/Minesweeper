const table = document.querySelector("table")

const NUMBER_OF_BOMB = 14
const table_array = []
const bombs = []

let current_bomb = NUMBER_OF_BOMB
let running = true

function start_game() {
	for (let i = 0; i < 8; i++) {
		const tr = document.createElement("tr")
		const row = []

		for (let j = 0; j < 8; j++) {
			const td = document.createElement("td")
			td.className = "closed"
			td.addEventListener("click", (e) => {
				if (!running) return

				if (e.ctrlKey && td.classList.contains("closed")) {
					td.classList.toggle("check")

					if (td.classList.contains("check")) {
						td.innerHTML = "<img src='images/flag.png' width='45' height='45' />"
						current_bomb--
					} else {
						td.innerHTML = ""
						current_bomb++
					}

					document.querySelector("#bombs").innerText = "Bombs: " + current_bomb

					return
				}

				if (!td.classList.contains("check")) open(j, i)
			})

			tr.appendChild(td)
			row.push(td)
		}

		table.appendChild(tr)
		table_array.push(row)
	}

	const bomb_index_array = []
	const get_random_pos = () => {
		let random_x = Math.floor(Math.random() * table_array[0].length)
		let random_y = Math.floor(Math.random() * table_array.length)

		while (bomb_index_array.find((e) => e[0] === random_x && e[1] === random_y)) {
			random_x = Math.floor(Math.random() * table_array[0].length)
			random_y = Math.floor(Math.random() * table_array.length)
		}

		const random_pos = [random_x, random_y]
		bomb_index_array.push(random_pos)

		return random_pos
	}

	for (let i = 0; i < NUMBER_OF_BOMB; i++) {
		const random_pos = get_random_pos()
		bombs.push(table_array[random_pos[1]][random_pos[0]])
	}

	for (let i = 0; i < 5; i++) {
		const random_pos = get_random_pos()
		table_array[random_pos[1]][random_pos[0]].click()
	}

	document.querySelector("#bombs").innerText = "Bombs: " + NUMBER_OF_BOMB
}

function game_over(td) {
	if (!bombs.length) return

	bombs.splice(bombs.indexOf(td), 1)
	const BOMB_DELAY = 180

	const explode = (bomb) => {
		if (!bomb.classList.contains("check")) bomb.style.backgroundColor = "red"
		bomb.innerHTML = "<img src='images/bomb.png' width='45' height='45' />"
	}

	explode(td)
	for (let i = 0; i < bombs.length; i++) setTimeout(() => explode(bombs[i]), BOMB_DELAY * (i + 1))
	setTimeout(() => {
		bombs.splice(0, bombs.length)
		document.querySelector("#bombs").innerText = "GAME OVER"
	}, BOMB_DELAY * (bombs.length + 1))

	running = false
}

function check_table() {
	const not_opened = table_array.flat().filter((e) => e.classList.contains("closed"))
	if (not_opened.length === bombs.length) return not_opened.every((e) => bombs.includes(e))
	else return false
}

function open(x, y) {
	if (bombs.includes(table_array[y][x])) {
		game_over(table_array[y][x])
		return
	}

	let bomb_count = 0
	const start_y = y - 1 < 0 ? 0 : y - 1
	const end_y = y + 2 >= table_array.length ? table_array.length : y + 2
	const start_x = x - 1 < 0 ? 0 : x - 1
	const end_x = x + 2 >= table_array[0].length ? table_array[0].length : x + 2

	for (let i = start_y; i < end_y; i++) {
		for (let j = start_x; j < end_x; j++) {
			if (bombs.includes(table_array[i][j])) bomb_count++
		}
	}

	let color = "blue"
	if (bomb_count === 2) color = "green"
	else if (bomb_count > 2) color = "red"

	table_array[y][x].className = ""
	table_array[y][x].style.color = color
	if (bomb_count > 0) table_array[y][x].innerText = bomb_count

	if (check_table()) {
		document.querySelector("#bombs").innerText = "YOU WIN!"
		running = false
	}
}

window.addEventListener("DOMContentLoaded", start_game)
