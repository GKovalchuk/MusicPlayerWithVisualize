import { loadPlaylist } from "./loadPlaylist.js";
import { visualisationAudio } from "./renderVisualisation.js";

const playlistContainer = document.getElementById("playlistContainer");
const nameContainer = document.getElementById("track-name");
const shuffleButton = document.getElementById("shuffle");
const loopButton = document.getElementById("loop");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

// Воспроизведения трека из плейлиста.
export const playTrack = (index) => {
	// Получаем плейлист.
	let playlist = loadPlaylist();
	// Проверяем, что индекс в допустимом диапазоне.
	if (index >= 0 && index < playlist.length) {
		// Ищем нужный трек.
		const track = playlist.filter((track) => index === track.queue)[0];

		// Проверяем, трек находится в БД, или на сервере.
		if (!track.keyDB) {
			// Создаем элементы для нового трека.
			buildAudioSrc(track);
			// Воспроизводим трек.
			audio.play();
		} else {
			// Открываем базу данных.
			const request = indexedDB.open("audioDB", 1);
			// Когда БД открыта.
			request.onsuccess = function (event) {
				// Получаем объект базы данных.
				const db = event.target.result;
				// Создаем транзакцию.
				const transaction = db.transaction(["tracks"], "readonly");
				// Получаем таблицу tracks.
				const objectStore = transaction.objectStore("tracks");
				// Отправляем запрос в таблицу по id.
				const request = objectStore.get(track.keyDB);
				// При успешном запросе.
				request.onsuccess = function (event) {
					// Получаем результат запроса.
					const trackData = event.target.result;
					// Проверяем.
					if (trackData) {
						// Передаем данные в src.
						track.src = trackData.data;
						// Создаем элементы для нового трека.
						buildAudioSrc(track);
						// Воспроизводим трек.
						audio.play();
					} else {
						// Выводим сообщение об ошибке, если объектпустой.
						console.log(`Track not found: ${track.name}`);
					}
				};
				// Обрабатываем событие ошибки при получении объекта.
				request.onerror = function (event) {
					// Выводим сообщение об ошибке.
					console.log(`Error getting track: ${event.target.errorCode}`);
				};
			};
			// Обрабатываем событие ошибки при открытии базы данных
			request.onerror = function (event) {
				// Выводим сообщение об ошибке
				console.log("Error opening database: " + event.target.errorCode);
			};
		}
	} else {
		// Если индекс недопустим, то выводим сообщение об ошибке.
		console.error("Invalid track index");
	}
};

// Создаем элементы для нового трека.
const buildAudioSrc = (track) => {
	audio.removeAttribute("src");
	if (!track) {
		console.error("трек не найден");
		return;
	}
	// Устанавливаем атрибуты src и type у элемента audio.
	audio.setAttribute("src", track.src);
	audio.setAttribute("type", track.type);
	// Рендер имени текущего трека.
	renderTrackName(track);
};

// Рендер имени текущего трека.
const renderTrackName = (track) => {
	// Выводим имя на экран.
	nameContainer.textContent = track.name;
};

export const playlistLogic = () => {
	// Зацикливание.
	let loop = false;
	// Случайный порядок.
	let shuffle = false;
	let shuffleArr;
	// Текущий индекс трека в плейлисте.
	let currentTrack = 0;

	// Переключение на следующий трек в плейлисте.
	const nextTrack = () => {
		let playlist = loadPlaylist();
		// Проверяем, что плейлист не пустой.
		if (playlist.length > 0) {
			// Увеличиваем текущий индекс на единицу.
			currentTrack += 1;
			// Если текущий индекс выходит за пределы плейлиста, то обнуляем его.
			if (currentTrack >= playlist.length) {
				currentTrack = 0;
			}
			// При включенном shuffle идем по его списку.
			if (shuffle) {
				playTrack(shuffleArr[currentTrack]);
			} else {
				// Воспроизводим трек по новому индексу.
				playTrack(currentTrack);
			}
		} else {
			// Если плейлист пустой, то выводим сообщение об ошибке.
			console.error("Empty playlist");
		}
	};

	// Переключение на предыдущий трек в плейлисте.
	const prevTrack = () => {
		let playlist = loadPlaylist();
		// Проверяем, что плейлист не пустой.
		if (playlist.length > 0) {
			// Уменьшаем текущий индекс на единицу.
			currentTrack -= 1;
			/*
			Если текущий индекс выходит за пределы плейлиста, то устанавливаем его на
      последний элемент.
      */
			if (currentTrack < 0) {
				currentTrack = playlist.length - 1;
			}
			// При включенном shuffle идем по его списку.
			if (shuffle) {
				playTrack(shuffleArr[currentTrack]);
			} else {
				// Воспроизводим трек по новому индексу.
				playTrack(currentTrack);
			}
		} else {
			// Если плейлист пустой, то выводим сообщение об ошибке.
			console.error("Empty playlist");
		}
	};

	const shuffleTracks = () => {
		if (shuffle) {
			let playlist = loadPlaylist();
			// Выдаем класс кнопке shuffle.
			shuffleButton.classList.add("player__track-controls--active");
			// Создаем массив для случайного порядка.
			shuffleArr = [];
			// Заполняем массив числами.
			for (let i = 0; i < playlist.length; i++) shuffleArr.push(i);
			// Подготавливаем переменные для перемешивания.
			let currentIndex = shuffleArr.length;
			let shuffleIndex;

			// Перемешиваем.
			while (0 !== currentIndex) {
				// Получаем текущий индекс.
				currentIndex -= 1;
				// Получаем его новое рандомное место (всегда меньше длины плейлиста).
				shuffleIndex = Math.floor(Math.random() * playlist.length);

				// Меняем местами элементы.
				[shuffleArr[currentIndex], shuffleArr[shuffleIndex]] = [shuffleArr[shuffleIndex], shuffleArr[currentIndex]];
			}
		} else {
			// Удаляем класс кнопке shuffle.
			shuffleButton.classList.remove("player__track-controls--active");
			// Удаляем массив.
			shuffleArr = [];
		}
	};

	// Рендерим кнопки с треками в плейлисте.
	const renderPlaylist = () => {
		let playlist = loadPlaylist();
		// Очищаем контейнер плейлиста.
		playlistContainer.innerHTML = "";
		const buttonList = [];
		playlist.forEach((track) => {
			const button = document.createElement("button");
			button.classList.add("playlist__container_btn");
			button.type = "button";
			button.textContent = track.name;
			button.queue = track.queue;
			button.addEventListener("click", () => {
				currentTrack = track.queue;
				playTrack(track.queue);
			});
			buttonList.push(button);
		});
		// Сортируем кнопки по очередности.
		buttonList.sort((a, b) => a.queue - b.queue);
		//Заполняем контенер кнопками плейлиста.
		buttonList.forEach((button) => playlistContainer.append(button));
	};

	// Зацикливание текущего трека.
	const loopTrack = () => {
		if (loop) {
			// Выдаем класс кнопке loop.
			loopButton.classList.add("player__track-controls--active");
			// Меняем обработчики событий.
			audio.removeEventListener("ended", nextTrackWithDebounce);
			audio.addEventListener("ended", loopWithDebounce);
		} else {
			// Удаляем класс кнопке loop.
			loopButton.classList.remove("player__track-controls--active");
			// Меняем обработчики событий.
			audio.removeEventListener("ended", loopWithDebounce);
			audio.addEventListener("ended", nextTrackWithDebounce);
		}
	};

	// Фукнция, реализующая debounce
	function debounce(callee, timeoutMs) {
		return function perform(...args) {
			// Время предыдущего и текущего вызова.
			let previousCall = this.lastCall;
			this.lastCall = Date.now();
			/*
				Очищаем таймаут если разница во времени между вызовами меньше, чем
				указанный интервал.
				*/
			if (previousCall && this.lastCall - previousCall <= timeoutMs) {
				clearTimeout(this.lastCallTimer);
			}

			// Установка таймаута, вызывающего функцию.
			this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
		};
	}

	// Добавление дебаунсов.
	const nextTrackWithDebounce = debounce(nextTrack, 100);
	const prevTrackWithDebounce = debounce(prevTrack, 100);
	const loopWithDebounce = debounce(() => {
		if (shuffle) {
			playTrack(shuffleArr[currentTrack]);
		} else {
			playTrack(currentTrack);
		}
	}, 100);

	// Обновляем кнопки зацикливания и случайного порядка.
	loopTrack();
	shuffleTracks();

	// Назначаем прослушиватели кнопке зацикливания и случайного порядка.
	shuffleButton.onclick = () => {
		shuffle = !shuffle;
		shuffleTracks();
	};
	loopButton.onclick = () => {
		loop = !loop;
		loopTrack();
	};

	// Добавляем обработчики событий на кнопки next и prev.
	nextButton.addEventListener("click", nextTrackWithDebounce);
	prevButton.addEventListener("click", prevTrackWithDebounce);
	// Добавляем к событию play запуск визуализации.
	audio.addEventListener("play", visualisationAudio, { once: true });
	audio.addEventListener("ended", nextTrackWithDebounce);
	// Перерисовываем плейлист при перезагрузке плейлиста.
	renderPlaylist();
};
