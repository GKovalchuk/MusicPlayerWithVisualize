// Визуализация воспроизводимого звука.
export const visualisationAudio = () => {
	const audio = document.getElementById("audio");
	const canvas = document.getElementById("canvas");

	// Создаем контекст Web Audio.
	const audioCtx = new AudioContext();
	// Создаем источник звука.
	const source = audioCtx.createMediaElementSource(audio);
	// Создаем анализатор для получения данных о звуке.
	let analyser = audioCtx.createAnalyser();
	/*
	Устанавливаем размер окна для БПФ.
	Чем меньше значение, тем плавнее и глубже будет кривая.
	*/
	analyser.fftSize = 4096;
	// Преобразуем и записываем данные в массив.
	const dataArray = new Uint8Array(analyser.frequencyBinCount);
	// Соединяем источник, анализатор и выход.
	source.connect(analyser);
	analyser.connect(audioCtx.destination);

	// Получаем контекст canvas.
	const context = canvas.getContext("2d");
	// Устанавливаем размеры canvas.
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	// Рисование звуковых волн на canvas.
	function drawWave(context, data) {
		// Устанавливаем цвет заливки.
		context.fillStyle = "black";
		// Начинаем новый путь.
		context.beginPath();
		// Перемещаемся в начальную точку (левый нижний угол).
		context.moveTo(0, canvas.height);
		// Проходим по массиву данных, содержащему амплитуды звука.
		for (let i = 0; i < data.length; i += 1) {
			// Вычисляем координату x на основе индекса и ширины canvas.
			let x = (i * canvas.width) / data.length;
			// Вычисляем координату y на основе амплитуды и высоты canvas.
			let y = canvas.height - (data[i] * canvas.height) / 256;
			// Рисуем линию к текущей точке (x, y).
			context.lineTo(x, y);
		}
		// Рисуем линию к правому нижнему углу.
		context.lineTo(canvas.width, canvas.height);
		// Закрываем путь.
		context.closePath();
		// Заливаем путь цветом.
		context.fill();
	}

	// Версия с троттлингом
	function throttle(callee, timeout) {
		// Создаем таймер.
		let timer = null;

		return function perform(...args) {
			// Прекращение выполнения, если таймер уже существует.
			if (timer) return;

			// Запуск функции создает таймер.
			timer = setTimeout(() => {
				callee(...args);

				// По окончанию очищаем таймер.
				clearTimeout(timer);
				timer = null;
			}, timeout);
		};
	}

	// Функция для обновления анимации звуковой волны.
	function updateWave() {
		// // Получаем данные о частоте звука.
		// analyser.getByteFrequencyData(dataArray);
		// Очищаем канвас.
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		// Копируем данные из анализатора в массив.
		analyser.getByteTimeDomainData(dataArray);
		// Рисуем звуковую волну на canvas.
		drawWave(context, dataArray);
		// Запрашиваем следующий кадр.
		// const getAddressWithThrottle = throttle((updateWave) => {
		// }, 50);
		// getAddressWithThrottle(updateWave);
		requestAnimationFrame(updateWave);
	}

	updateWave();
};
