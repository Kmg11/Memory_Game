// Start Global Vaiables

let // Duration Of The Flip
	duration = 500,
	// Duration Of The First Flip
	flipDuration = 2000,
	// Time - You Should Change Default Time When Change It
	time,
	// Default Time - This Var Use In Result
	defaultTime = { minutes: 1, seconds: 0 },
	// Select Blocks Container
	blocksContainer = document.querySelector(".memory-game-blocks"),
	// Selcet All Blocks
	blocks = Array.from(blocksContainer.children),
	// Select Username Element
	userName = document.querySelector(".info-container .name span"),
	// Select Tries Element
	triesElement = document.querySelector(".tries span"),
	// Tries Count
	triesCount = 0;

// End Global Vaiables
// Start Local Storage

let // This Array To Push All Player Info In
	playerInfoArr = [],
	// Select Results Header
	resultsHeader = document.querySelectorAll(".results header"),
	// Get [ playerInfo ] From Local Storage
	playerInfoLocal = localStorage.getItem("playerInfoLocal");

// Winners Title
(winnersTitle = document.querySelectorAll(".results .winners h3")),
	// losers Title
	(losersTitle = document.querySelectorAll(".results .losers h3"));

// Check If Local Storage Have Value Or No
if (playerInfoLocal !== null) {
	// Convert Player Info To Object
	let playerInfoObj = JSON.parse(playerInfoLocal);

	// Make Results Header Visable
	resultsHeader[0].style.display = "flex";
	resultsHeader[1].style.display = "flex";

	playerInfoObj.forEach((obj) => {
		// Make Results H3 Visable
		if (obj.result === "Winner") {
			winnersTitle.forEach((ele) => ele.classList.add("show"));
		} else {
			losersTitle.forEach((ele) => ele.classList.add("show"));
		}

		// Create All Players
		createPlayer(
			obj.name,
			obj.time.minutes,
			obj.time.seconds,
			obj.tries,
			obj.result
		);
	});
}

// End Local Storage
// Start Splash Screen

document.querySelector(".control-buttons span").onclick = (e) => {
	// Start Game
	startGame();

	// Add [ hidden ] Class On [ control-buttons ]
	e.target.parentElement.classList.add("hidden");
};

// End Splash Screen
// Start Play Again Button

let // Select Game Status Container
	gameStatusContainer = document.querySelector(".game-status"),
	// Select Background Music
	backgroundMusic = document.getElementById("background-music"),
	// Select Game Status Button
	gameStatusButton = gameStatusContainer.querySelector("button"),
	// Select Game Status Span
	gameStatusSpan = gameStatusContainer.querySelector("span"),
	// Select Game Status Results
	gameStatusResults = gameStatusContainer.querySelector(".results");

gameStatusButton.onclick = () => {
	// Remove [ show ] Class From [ gameStatusContainer ]
	gameStatusContainer.classList.remove("show");
	// Remove [ show ] Class From [ gameStatusSpan ]
	gameStatusSpan.classList.remove("show");
	// Remove [ show ] Class From [ gameStatusButton ]
	gameStatusButton.classList.remove("show");
	// Remove [ show ] Class From [ gameStatusResults ]
	gameStatusResults.classList.remove("show");

	// Start Game
	startGame();
};

// End Play Again Button
// Start Click On Block

// Flip The Block When Click On It
blocks.forEach((block) => {
	block.addEventListener("click", () => flipBlock(block));
});

// End Click On Block
// Start Game Memory Functions

let // Select Timer Minutes Element
	timerMinutes = document.querySelector(".timer .minutes"),
	// Select Timer Seconds Element
	timerSeconds = document.querySelector(".timer .seconds");

// Start Game Function
function startGame() {
	let // Prompt To Allow User To Type His/Her Name
		yourName = prompt("What's Your Name");

	// Set The Username
	if (yourName === "" || yourName === null) userName.textContent = "Unknown";
	else userName.textContent = yourName;

	/*
		Create Range Of Keys
		- Another Way - let orderRange = [...Array(blocks.length).keys()]
	*/
	let orderRange = Array.from(Array(blocks.length).keys());

	// Change Order Range Elements Randomly
	shuffle(orderRange);

	blocks.forEach((block, index) => {
		// Add Css Order Propery
		block.style.order = orderRange[index];

		// Add [ is-flipped ] Class To Block Element
		block.classList.add("is-flipped");

		// After [ flipDuration ] Remove [ is-flipped ] & [ has-match ] Class If It Found
		setTimeout(() => {
			// Remove [ is-flipped ] Class From [ block ]
			block.classList.remove("is-flipped");

			// If [ has-match ] Class Found Remove It
			if (block.classList.contains("has-match")) {
				block.classList.remove("has-match");
			}
		}, flipDuration);
	});

	// Change Overflow Property To Auto
	document.body.style.overflow = "auto";

	// Change The Music Volume
	backgroundMusic.volume = 0.3;
	// Play The Bakcground Music
	backgroundMusic.play();

	// Manage Time
	manageTime();

	// Reset Tries
	triesCount = 0;
	triesElement.textContent = 0;
}

/*
	Set Time Function
*/

function setTime() {
	// Set Time - You Should Change Default Time When Change It
	time = { minutes: 1, seconds: 0 };

	// Check If The Minutes < 10 Add "0" Before Time
	if (time.minutes < 10) timerMinutes.textContent = "0" + time.minutes;
	else timerMinutes.textContent = time.minutes;

	// Check If The Seconds < 10 Add "0" Before Time
	if (time.seconds < 10) {
		timerSeconds.textContent = "0" + time.seconds;
		if (time.minutes === 0) {
			timerSeconds.style.color = "#ff0047";
		}
	} else {
		timerSeconds.textContent = time.seconds;
	}
}

/*
	Manage Time Function
*/

// Manage Time
let manageSeconds;

function manageTime() {
	// Set Time
	setTime();

	// After [ flipDuration ]
	setTimeout(() => {
		manageSeconds = setInterval(() => {
			// If The Seconds !== 0
			if (time.seconds > 0) {
				// Decrease The Seconds
				time.seconds -= 1;

				// Check If The Seconds < 10 Add "0" Before Time
				if (time.seconds < 10) {
					timerSeconds.textContent = "0" + time.seconds;
					if (time.minutes === 0) {
						timerSeconds.style.color = "#ff0047";
					}
				} else {
					timerSeconds.textContent = time.seconds;
				}
			} else {
				// If Minutes !== 0
				if (time.minutes !== 0) {
					// Decrease The Minutes By 1
					time.minutes -= 1;
					// Set Seconds To 60
					time.seconds = 60;

					// Check If The Minutes < 10 Add "0" Before Time
					if (time.minutes < 10) timerMinutes.textContent = "0" + time.minutes;
					else timerMinutes.textContent = time.minutes;
				}
			}

			// Check If The Time End Or The Game Complete
			endGame();
		}, 1000);
	}, flipDuration);
}

/*
	Shuffle Function
	- Change The Block Place Randomly
	- Use Elzero Shuffle Way Becouse The Order Number Did't Repeat
	- Machanizem
		- Explain Shuffle Array
		- Current Array [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
		- New Array [1, 2, 3, 0, 5, 9, 7, 8, 6, 4]
		- Quetion: How To Make Random Images Generate Unic Numbers
		- Steps
			[1] Save Current Element in Stash
			[2] Current Element = Random Element
			[3] Ranom Element = Get Element From Stash

*/

function shuffle(array) {
	// Main Variables Of The Function
	let current = array.length,
		random;

	// Loop On The Array To Shuffke
	while (current > 0) {
		// Get Random Number
		random = Math.floor(Math.random() * current);

		// Decrease The Array Length By One
		current--;

		// Replacement The Elements Using Destructuring
		[array[current], array[random]] = [array[random], array[current]];
	}

	// Return The Array After Shuffle It
	return array;
}

/*
	Flip Block Function
	- Flip The Block To Check If It's Matched Or No
	- Stop User To Click On Any Block
*/

function flipBlock(selectedBlock) {
	// Add Class [ is-flipped ] To Show Block
	selectedBlock.classList.add("is-flipped");

	// Collect All Flipped Cards
	let allFlippedBlocks = blocks.filter((flippedBlock) =>
		flippedBlock.classList.contains("is-flipped")
	);

	// If Theres Two Selected Blocks
	if (allFlippedBlocks.length === 2) {
		// Stop User To Click
		stopClicking();

		// Check Elements Is Matched Or No
		chckMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
	}
}

/*
	Stop Clicking Function
	- Block User From Click On Any Block
*/

function stopClicking() {
	// Add [ no-clicking ] Class To Stop Click On The Block
	blocksContainer.classList.add("no-clicking");

	// After The Duration Remove [ no-clicking ] Class To Let User Click
	setTimeout(() => {
		blocksContainer.classList.remove("no-clicking");
	}, duration);
}

/*
	Check Matched Block Function
	- Check The 2 Blocks That User Clicked On Is Matched Or No
*/

function chckMatchedBlocks(firstBlock, secondBlock) {
	if (firstBlock.dataset.tech === secondBlock.dataset.tech) {
		// Remove [ is-flipped ] Class To Emptying The Array
		firstBlock.classList.remove("is-flipped");
		secondBlock.classList.remove("is-flipped");

		// Add [ has-match ] Class To Show Matched Block
		firstBlock.classList.add("has-match");
		secondBlock.classList.add("has-match");

		// Play Success Music
		document.getElementById("success").play();
	} else {
		// Change Tries Number
		++triesCount;
		triesElement.innerHTML = triesCount;

		// After Duration Remove [ if-flipped ] Class
		setTimeout(() => {
			firstBlock.classList.remove("is-flipped");
			secondBlock.classList.remove("is-flipped");
		}, duration);

		// Play Fail Music
		document.getElementById("fail").play();
	}
}

/*
	Stop The Game After The Time End - After The User Complete The Game
*/

function endGame() {
	let // Select Game Status Element
		gameStatusSpan = gameStatusContainer.querySelector("span"),
		// Select Matched Blocks
		matchedBlocks = document.querySelectorAll(".has-match");

	if (
		(time.minutes === 0 && time.seconds === 0) ||
		blocks.length === matchedBlocks.length
	) {
		// Clear The Interval
		clearInterval(manageSeconds);

		// End Screen Animation
		endGameAnimation();

		// Stop Music When The Game End
		backgroundMusic.pause();
		// Reset The Music Timer To 0
		backgroundMusic.currentTime = 0;

		// Check If The User Win Or Fail
		if (blocks.length === matchedBlocks.length) {
			endGameStatus("final-win", "Winner", "#00ff37");
		} else {
			endGameStatus("final-fail", "Failed", "#ff0047");
		}

		// Save Game Info
		createPlayer(
			userName.textContent,
			time.minutes,
			time.seconds,
			triesElement.textContent,
			gameStatusSpan.textContent
		);
	}
}

// End Game Animation
function endGameAnimation() {
	// Add [ show ] Class To The Sections To Animation
	gameStatusContainer.classList.add("show");
	gameStatusSpan.classList.add("show");
	gameStatusButton.classList.add("show");
	gameStatusResults.classList.add("show");

	// Add Overflow Property To The Body Element
	document.body.style.overflow = "hidden";

	// Make Results Header Visable
	resultsHeader[0].style.display = "flex";
	resultsHeader[1].style.display = "flex";

	// Make Results Title Visable
	if (gameStatusSpan.textContent === "Winner") {
		winnersTitle.forEach((ele) => ele.classList.add("show"));
	} else {
		losersTitle.forEach((ele) => ele.classList.add("show"));
	}
}

// End Game Status Function
function endGameStatus(music, gameStatus, color) {
	// Play Final Winner Music
	document.getElementById(music).play();

	// Change [ gameStatusSpan ] Content
	gameStatusSpan.textContent = gameStatus;
	// Change [ gameStatusSpan ] Style Color
	gameStatusSpan.style.color = color;
}

// Create Player Function
function createPlayer(name, minutes, seconds, tries, result) {
	// Create Player Div
	let player = document.createElement("div");

	// Add Player Div Class
	player.classList.add("player");
	// Append Player Name To Player
	player.appendChild(createPlayerName(name));
	// Append Player Time To Player
	player.appendChild(createPlayerTimer(minutes, seconds));
	// Append Player Tries Player
	player.appendChild(playerTries(tries));
	// Append Player Result Player
	player.appendChild(createPlayerResult(result));

	// Clone Player To Append It
	let clonePlayer = player.cloneNode(true);

	let // Select Results Winners
		resultsWinners = document.querySelectorAll(".results .winners"),
		// Select Results Losers
		resultsLosers = document.querySelectorAll(".results .losers");

	// Check If The Player Win Or Fail
	if (result === "Winner") {
		// Append Player To Game Status Result Winners
		resultsWinners[0].appendChild(player);
		// Append Player To Controls Buttons Result Losers
		resultsWinners[1].appendChild(clonePlayer);
	} else {
		// Append Player To Game Status Result Losers
		resultsLosers[0].appendChild(player);
		// Append Player To Controls Buttons Result Losers
		resultsLosers[1].appendChild(clonePlayer);
	}

	// Every Element Will Take His Tries Value
	document.querySelectorAll(".results .player").forEach((ele) => {
		ele.style.order = ele.children[2].textContent;
	});

	// This Object For Local Storage
	let playerInfoObj = {
		name,
		time: {
			minutes,
			seconds,
		},
		tries,
		result,
	};

	// Push Player Info Obj To Array
	playerInfoArr.push(playerInfoObj);

	// Save In Local Storage
	localStorage.setItem("playerInfoLocal", JSON.stringify(playerInfoArr));
}

// Create Player Name Function
function createPlayerName(name) {
	let // Create Player Name Div
		playerName = document.createElement("div"),
		// Create Player Name Span
		playerNameSpan = document.createElement("span");

	// Add Player Name Span Content
	playerNameSpan.textContent = name;

	// Append Player Name Text & Player Name Span To Player Name Div
	playerName.append(playerNameSpan);

	// Return playerName
	return playerName;
}

// Create Player Time Function
function createPlayerTimer(minutes, seconds) {
	let // Create Player Time Div
		playerTime = document.createElement("div"),
		// Create Player Time Minutes Span
		playerTimeMinutes = document.createElement("span"),
		// Create Player Time Seconds Span
		playerTimeSeconds = document.createElement("span"),
		// Total Seconds In The Start Of The Game
		totalSeconds = defaultTime.minutes * 60 + defaultTime.seconds,
		// Residual Seconds After The Game End
		residualSeconds = minutes * 60 + seconds,
		// The Seconds That User Take To End The Game
		takedSeconds = totalSeconds - residualSeconds,
		// The Minutes That User Take To End The Game
		takedMinutes = 0;

	// If takedSeconds > 60 - Minus From It 60
	while (takedSeconds > 60) {
		// Decrease The Total Time By 60
		takedSeconds -= 60;
		// Increase The Minutes By One
		takedMinutes++;
	}

	// Set Player Time Minutes Content
	if (takedMinutes < 10) playerTimeMinutes.textContent = "0" + takedMinutes;
	else playerTimeMinutes.textContent = takedMinutes;

	// Set Player Time Seconds Content
	if (takedSeconds < 10) playerTimeSeconds.textContent = "0" + takedSeconds;
	else playerTimeSeconds.textContent = takedSeconds;

	// Append Player Time Minutes Span & Player Time Seconds Span To Player Time Div
	playerTime.append(playerTimeMinutes, " : ", playerTimeSeconds);

	// Return playerTime
	return playerTime;
}

// Create Player Tries Function
function playerTries(tries) {
	let // Create Player Tries Div
		playerTries = document.createElement("div"),
		// Create Player Tries Span
		playerTriesSpan = document.createElement("span");

	// Add Player Tries Span Content
	playerTriesSpan.textContent = tries;

	// Style Tries Color
	playerTriesSpan.style.color = "#ff0047";

	// Append Text & Player Tries Span To Player Tries Div
	playerTries.append(playerTriesSpan);

	// Return playerTries
	return playerTries;
}

// Create Player Result Function
function createPlayerResult(result) {
	// Create Player Result Function
	let playerResult = document.createElement("div");

	// Add Player Result Content
	playerResult.textContent = result;

	// Change Player Result Color
	if (result === "Winner") playerResult.style.color = "rgb(0 199 43)";
	else playerResult.style.color = "#ff0047";

	// Return playerResult
	return playerResult;
}

// End Game Memory Functions
