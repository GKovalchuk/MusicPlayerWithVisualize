// Загружаем плейлист из localStorage.
export const loadPlaylist = () => {
	// Проверяем, есть ли ключ playlist в localStorage.
	if (localStorage.getItem("playlist")) {
		// Парсим json и возвращаем массив объектов.
		return JSON.parse(localStorage.getItem("playlist"));
	} else {
		// Если нет, то возвращаем пустой массив.
		return [];
	}
};
