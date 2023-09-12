import { playlistLogic } from "./playlistLogic.js";
import { readFiles } from "./readFiles.js";

/*
Создаем начальный json на 5 песен. Не стал создавать для этого сервер и
считывать файлы в json, задача, вроде как, другая.
*/
const initialJson = JSON.stringify([
	{ keyDB: null, name: "01 - Spiritual State", src: "/audio/01 - Spiritual State.mp3", type: "mp3", queue: 0 },
	{ keyDB: null, name: "16 - Reflection Eternal", src: "/audio/16 - Reflection Eternal.mp3", type: "mp3", queue: 1 },
	{
		keyDB: null,
		name: "AnnenMayKantereit-x-Parcels-—-Can_t-Get-You-out-of-My-Head-_Кавер-версия_-_www.lightaudio.ru_",
		src: "/audio/AnnenMayKantereit-x-Parcels-—-Can_t-Get-You-out-of-My-Head-_Кавер-версия_-_www.lightaudio.ru_.wav",
		type: "wav",
		queue: 2,
	},
	{
		keyDB: null,
		name: "Never Get Enough feat. Kathy Brown",
		src: "/audio/Never Get Enough feat. Kathy Brown.mp3",
		type: "mp3",
		queue: 3,
	},
	{
		keyDB: null,
		name: "Nujabes - Luv (Sic.) Pt.3 feat. Shing02",
		src: "/audio/Nujabes - Luv (Sic.) Pt.3 feat. Shing02.mp3",
		type: "mp3",
		queue: 4,
	},
]);

// Записываем файл плейлиста в localStorage.
localStorage.setItem("playlist", initialJson);

// Добавление новых файлов.
readFiles();

// Создание прослушивателей событий.
playlistLogic();
