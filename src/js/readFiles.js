import { playlistLogic } from "./playlistLogic.js";
import { loadPlaylist } from "./loadPlaylist.js";

const input = document.getElementById("playlist__input");

export const readFiles = () => {
	// Создаем прослушиватель на инпуте.
	input.addEventListener("change", () => {
		// Создаем (открываем) Базу Данных.
		let request = indexedDB.open("audioDB", 1);

		// Прослушиватель обновления БД.
		request.onupgradeneeded = (event) => {
			// Получаем объект базы данных из события.
			let db = event.target.result;

			// Создаем таблицу с именем "tracks" и ключом "id".
			db.createObjectStore("tracks", { keyPath: "id" });
		};

		// При успешном открытии БД.
		request.onsuccess = (event) => {
			// Получаем список файлов из инпута.
			const files = input.files;

			// Проходим по списку файлов.
			for (let index = 0; index < files.length; index += 1) {
				// Получаем текущий файл из объекта.
				const file = files[index];

				// Получаем расширение файла.
				let extension = file.name.split(".")[file.name.split(".").length - 1];
				// Проверяем, является ли файл mp3 или wav.
				if (extension != "mp3" && extension != "wav") {
					alert("Выберите аудиофайл формата .mp3 или .wav");
					return;
				}

				// Создаем объект FileReader для чтения содержимого файла.
				let reader = new FileReader();

				// Подгружаем данные старого плейлиста.
				const prevPlaylist = loadPlaylist();
				const startIndex = prevPlaylist[prevPlaylist.length - 1].queue + 1;

				// Прослушиватель конца загрузки файла.
				reader.addEventListener("load", async () => {
					// Задаем очередность для трека.
					let queue = startIndex + index;
					// Получаем данные файла.
					let data = reader.result;

					// Получаем имя файла из свойства name файла.
					let name = file.name;

					// Снова получаем объект БД.
					let db = event.target.result;
					// Открываем транзакцию для записи в таблицу tracks.
					let transaction = db.transaction("tracks", "readwrite");
					// Получаем таблицу tracks.
					let store = transaction.objectStore("tracks");

					// Создаем объект с данными файла.
					let track = { id: name + queue, data: data };

					// Добавляем объект с данными файла в таблицу tracks.
					let addRequest = store.put(track);

					// При успешном добавлении объекта.
					addRequest.onsuccess = () => {
						// Подгружаем данные старого плейлиста.
						const curPlaylist = loadPlaylist();
						// Создаем новый плейлист. Преобразуем в JSON-строку.
						const json = JSON.stringify(
							[
								...curPlaylist,
								{
									keyDB: track.id,
									name: name,
									type: extension,
									queue: queue,
								},
							].sort((a, b) => a.queue - b.queue)
						);

						// Записываем новый массив в localStorage.
						localStorage.setItem("playlist", json);
						// Отрисовываем изменения.
						playlistLogic();
					};

					// Добавляем обработчик события onerror, который будет срабатывать при ошибке добавления объекта
					addRequest.onerror = (event) => {
						// Выводим сообщение об ошибке
						console.log("Error adding file " + "name :" + event.target.errorCode);
					};
				});

				// Читаем файл как base64
				reader.readAsDataURL(file);
			}
		};
	});
};
