const titleScreen = document.getElementById("title-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const playButton = document.getElementById("play-button");
const beginButton = document.getElementById("begin-button");

window.onload = () => {
    titleScreen.classList.remove("hidden");
    setTimeout(() => {
        titleScreen.classList.add("visible");
    }, 100);
};

playButton.onclick = () => {
    titleScreen.classList.remove("visible");
    setTimeout(() => {
        titleScreen.classList.add("hidden");
        instructionsScreen.classList.remove("hidden");
        setTimeout(() => instructionsScreen.classList.add("visible"), 50);
    }, 1000);
};

beginButton.onclick = () => {
    instructionsScreen.classList.remove("visible");
    setTimeout(() => {
        instructionsScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        initGame();
    }, 1000);
};

let state = {
    time: 180,
    node1: false,
    node2: false,
    node3: false,
    complete: false,
    inventory: {},
    emotions: {},
    codePrefix: "4299", // will be set randomly
};

let interval;

function randomPrefix() {
    return (
        Math.floor(Math.random() * 10).toString() +
        Math.floor(Math.random() * 10).toString() +
        Math.floor(Math.random() * 10).toString() +
        Math.floor(Math.random() * 10).toString()
    );
}

function initGame() {
    state.codePrefix = randomPrefix();
    document.getElementById("timer").innerText = `Time: ${state.time}`;
    interval = setInterval(() => {
        state.time--;
        document.getElementById("timer").innerText = `Time: ${state.time}`;
        if (state.time <= 0) {
            clearInterval(interval);
            loadPassage("timeout");
        }
    }, 1000);
    loadPassage("start");
}

function loadPassage(passage) {
    const game = document.getElementById("game");
    game.innerHTML = "";

    if (passage === "start") {
        game.innerHTML = `
      <p>You awaken floating around in one of the corridors.</p>
      <span class="choice" onclick="loadPassage('opt1')">Go to research bay</span>
      <span class="choice" onclick="loadPassage('opt2')">Go to medbay</span>
      <span class="choice" onclick="loadPassage('opt3')">Go to control room</span>
      <span class="choice" onclick="loadPassage('opt4')">Go to escape pod</span>
    `;

    }
    if (passage === "opt1") {
        if (!state.inventory.ouroborosPapers) {
            game.innerHTML = `
        <p>As you enter the bay, you see a lot of papers scattered around the place. You pick one up and it reveals to be a paper on how to wipe a portion of one's memory. Glancing around, there appears to be pieces of helmets that look exactly like yours on the floor as well as an electronic safe.</p>
        <span class="choice" onclick="loadPassage('search_papers')">Continue searching through papers</span>
        <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
        <span class="choice" onclick="loadPassage('check_safe')">Check the safe</span>
        <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        } else {
            game.innerHTML = `
        <p>As you enter the bay, you see a lot of papers scattered around the place which you ignore. Glancing around, there appears to be pieces of helmets that look exactly like yours on the floor as well as an electronic safe.</p>
        <span class="choice" onclick="loadPassage('search_papers')">Continue searching through papers</span>    
        <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
        <span class="choice" onclick="loadPassage('check_safe')">Check the safe</span>
        <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        }
    }
    if (passage === "search_papers") {
        if (!state.inventory.medicalCard) {
            state.inventory.medicalCard = true;
            game.innerHTML = `
            <p>You head towards a pile of papers on a nearby workbench. You notice that there is an access card underneath another report. It's the head medical chiefs card access card! You take it and put it in your pocket. As you turn to leave the workbench, you wonder if you should read that paper.</p>
            <span class="choice" onclick="loadPassage('search_papers')">Continue searching through papers</span>
            <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
            <span class="choice" onclick="loadPassage('check_safe')">Check the safe</span>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        } else {
            state.inventory.ouroborosPapers = true;
            game.innerHTML = `
            <p>Curiosity killed the cat huh. The project file is called <h1>Ouroboros</h1> which details an experimental neural loop—a system designed to erase one's memory. Some diagrams and annotations imply test subjects were unaware they were part of the program. Near the bottom, your name is listed as a participant. You take a step back in shock. Just what exactly is going on. You roll up this report and stuff it into your pockets.</p>
            <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
            <span class="choice" onclick="loadPassage('check_safe')">Check the safe</span>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        }
    }
    if (passage === "investigate_helmets") {
        game.innerHTML = `
        <p>You see a row of helmets resting on foam supports, each one wired into a set of humming, heat-emitting servers. The visors glow faintly. Each helmet is tagged with a crew member’s name—faded, scratched, but legible. Your own name is etched into the fourth. It looks recently used. The inside is still warm.</p>
        <span class="choice" onclick="loadPassage('wear_helmet')">Wear your helmet</span>
        <span class="choice" onclick="loadPassage('check_safe')">Check the safe</span>
        ${!state.inventory.ouroborosPapers ? `<span class="choice" onclick="loadPassage('search_papers')">Go through papers</span>` : ""}
        <span class="choice" onclick="loadPassage('start')">Leave the room</span>
    `;
    }
    if (passage === "wear_helmet") {
        clearInterval(interval);
        game.innerHTML = `
        <p>You lower the helmet over your head. A brief static flickers across your vision, then darkness. You reach to lift it off, but it doesn't budge. Locks hiss shut around your neck.</p>
        <p>“Cleansing memory” a voice says calmly into your ears. You freeze. “What?!” you shout, panic rising.</p>
        <p>Your hands scratch at the sides as a cold numbness creeps in. The servers whine louder and your vision begins to blur.</p>
    `;
        setTimeout(() => {
            game.innerHTML = `
            <p class="death-message">YOU DIED</p>
            <button onclick="restart()">Try Again</button>
        `;
        }, 10000);
    }
    if (passage === "check_safe") {
        if (!state.inventory.codeA) {
            game.innerHTML = `
        <p>The safe is electronic and secured with a question-based lockout. Instead of a typical password, it presents a prompt: <em>"In what year did human space travel begin?"</em></p>
        <input id="safe-answer" type="text" maxlength="4" />
        <br><br>
        <button onclick="submitSafeAnswer()">Submit</button>
       
    `;
        } else {
            game.innerHTML = `
        <p>You come back to find that one of the digits is ${state.codePrefix[0]}</p>
        <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
            ${!state.inventory.ouroborosPapers ? `<span class="choice" onclick="loadPassage('search_papers')">Go through papers</span>` : ""}
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
       
    `;
        }

    }



    if (passage === "opt2") {
        if (!state.inventory.medicalCard) {
            game.innerHTML = `
            <p>As you approach the cockpit door, it remains firmly sealed. Unlike the others, this one appears to require authorisation. A scanner next to the frame flashes red. You spot a slot labeled: <em>Medical Chief’s Access Card Required</em>.</p>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        } else {
            game.innerHTML = `
      <p>As you enter the medbay, a sharp headache pulses behind your eyes. Your vision blurs slightly, and your limbs feel heavy. The effects of prolonged oxygen deprivation are starting to show.</p>
      <p>You scan the room instinctively - beds to rest, cabinets lined with medication. Relief is close, but so is risk.</p>
      <span class="choice" onclick="loadPassage('access_computer')">Access computer</span>
      <span class="choice" onclick="loadPassage('look_medicine')">Look for medicine</span>
      <span class="choice" onclick="loadPassage('sleep_bed')">Sleep in the bed</span>
      <span class="choice" onclick="loadPassage('start')">Leave the room</span>
    `;
        }
    }

    if (passage === "look_medicine") {
        game.innerHTML = `
      <p>The headache has gotten worse fast but you just found a box of tablets that appears to be painkillers.</p>
      <span class="choice" onclick="loadPassage('take_painkiller')">Take painkiller</span>
      <span class="choice" onclick="loadPassage('keep_searching')">Ignore the pills and search for something else</span>
      <span class="choice" onclick="loadPassage('stop_searching')">Close cabinet</span>
    `;
    }

    if (passage === "keep_searching") {
        if (!state.inventory.screwdriver) {
            state.inventory.screwdriver = true;
            game.innerHTML = `
        <p>You have found a screwdriver. You take it in case you need it later.</p>
        <span class="choice" onclick="loadPassage('take_painkiller')">Take painkiller</span>
        <span class="choice" onclick="loadPassage('stop_searching')">Close cabinet</span>
      `;
        } else {
            game.innerHTML = `
        <p>The cabinet is empty. There's nothing else to be found.</p>
        <span class="choice" onclick="loadPassage('take_painkiller')">Take painkiller</span>
        <span class="choice" onclick="loadPassage('stop_searching')">Close cabinet</span>
      `;
        }
    }
    if (passage === "sleep_bed") {
        game.innerHTML = `
    <p>You are nice and comfy in the bed, it's hard not to fall asleep.</p>
    <span class="choice" onclick="loadPassage('stay_in_bed')">Continue to stay in the bed</span>
    <span class="choice" onclick="loadPassage('flip_pillow')">Flip your pillow</span>
    <span class="choice" onclick="loadPassage('opt2')">Get out of bed</span>
  `;
    }

    if (passage === "stay_in_bed") {
        clearInterval(interval);
        game.innerHTML = `
    <p>As you continued to lie in bed, you hear a strange voice, "Patient detected, commencing scanning".</p>
    <p>Suddenly your hands and feet have been clamped by the bed as you start getting scanned by the bed.</p>
    <p>"Detected memory loss of patient, initiating recovery" the system says as the bed slowly gets covered by a lid. You sigh as you slowly fall back to sleep</p>
  `;
        setTimeout(() => {
            game.innerHTML = `
      <p class="death-message">YOU DIED</p>
      <button onclick="restart()">Try Again</button>
    `;
        }, 10000);
    }

    if (passage === "flip_pillow") {
        if (!state.inventory.usb) {
            state.inventory.usb = true;
            game.innerHTML = `
            <p>You flip your pillow and feel a cool spot. A USB pops falls out. You decide to take it.</p>
            <span class="choice" onclick="loadPassage('stay_in_bed')">Continue to stay in the bed</span>
            <span class="choice" onclick="loadPassage('opt2')">Get out of bed</span>
        `;
        } else {
            game.innerHTML = `
            <p>You flip your pillow and feel a cool spot. Dust falls out.</p>
            <span class="choice" onclick="loadPassage('stay_in_bed')">Continue to stay in the bed</span>
            <span class="choice" onclick="loadPassage('opt2')">Get out of bed</span>
        `;
        }
    }


    if (passage === "take_painkiller") {
        clearInterval(interval);
        game.innerHTML = `
      <p>You flip the box and notice a label saying: <em>Do not consume. Experimental pills for sleep.</em></p>
      <p>As you start to lose consciousness, you notice the screensaver on the computer looks like a snake.</p>
      <p>But why would it be a snake, you think as you fall asleep...</p>
    `;

        setTimeout(() => {
            game.innerHTML = `
        <p class="death-message">YOU DIED</p>
        <button onclick="restart()">Try Again</button>
      `;
        }, 10000);
    }

    if (passage === "stop_searching") {
        loadPassage("opt2");
    }

    if (passage === "access_computer") {
        game.innerHTML = `
        <p>You deactivate the snake screensaver and are presented the desktop. You notice that this is logged into the head medical officers account. Two applications are visible: Medical History and Activity Monitor.</p>
        <span class="choice" onclick="loadPassage('medical_history')">Open Medical History</span>
        <span class="choice" onclick="loadPassage('activity_monitor')">Open Activity Monitor</span>
        ${state.inventory.usb ? `<span class="choice" onclick="loadPassage('usb_app')">Plug in USB</span>` : ""}
        <span class="choice" onclick="loadPassage('opt2')">Leave computer</span>
    `;
    }

    if (passage === "medical_history") {
        if (!state.inventory.ouroborosPapers) {
            if (!state.emotions.medshock) {
                state.emotions.medshock = true
                game.innerHTML = `
        <p>You search for your medical history: Age 28, blood type B-, history of migraines, enrolled in experimental neural enhancement program. You take a step back in shock. What exactly was going on in this ship?</p>
        <span class="choice" onclick="loadPassage('access_computer')">Close application</span>
    `;
            } else {
                game.innerHTML = `
        <p>You search for your medical history: Age 28, blood type B-, history of migraines, enrolled in experimental neural enhancement program.</p>
        <span class="choice" onclick="loadPassage('access_computer')">Close application</span>
    `;
            }

        } else {
            game.innerHTML = `
        <p>You search for your medical history: Age 28, blood type B-, history of migraines, enrolled in experimental neural enhancement program.</p>
        <span class="choice" onclick="loadPassage('access_computer')">Close application</span>
    `;
        }

    }

    if (passage === "activity_monitor") {
        game.innerHTML = `
        <p>This application reveals the status of all crew members in real time. You watch as your own heart rate on the monitor begins to spike. What a terrifying thing it is to be alone.</p>
    `;

        if (!state.inventory.accessCard) {
            state.inventory.accessCard = true;
            game.innerHTML += `
            <p>In frustration, you slam your foot against a drawer. It clatters open, and something falls to the floor—it's the captain's access card. You grab it without hesitation.</p>
        `;
        }

        game.innerHTML += `
        <span class="choice" onclick="loadPassage('access_computer')">Close application</span>
    `;
    }



    if (passage === "usb_app") {
        game.innerHTML = `
        <p>The USB loads a single hidden file: a snake game. It's crude, primitive even, but it's running.</p>
        <span class="choice" onclick="loadPassage('play_snake')">Play the game</span>
        <span class="choice" onclick="loadPassage('access_computer')">Close application</span>
    `;
    }

    if (passage === "play_snake") {

        game.innerHTML = `
    <p>Use W/A/S/D or Arrow Keys to move the snake. Eat 6 red dots to win.</p>
    <div id="snake-grid" ></div>
  `;

        const grid = document.getElementById("snake-grid");
        const size = 4;
        let snake = [{ x: 2, y: 2 }];
        let food = placeFood();
        let direction = { x: 0, y: 0 };
        let points = 0;
        let gameInterval;

        function drawGrid() {
            grid.innerHTML = "";
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const cell = document.createElement("div");
                    cell.style.width = "40px";
                    cell.style.height = "40px";
                    cell.style.backgroundColor = "#001a00";
                    cell.style.border = "1px solid #003300";

                    if (snake.some(p => p.x === x && p.y === y)) {
                        cell.style.backgroundColor = "limegreen";
                    } else if (food.x === x && food.y === y) {
                        cell.style.backgroundColor = "red";
                    }

                    grid.appendChild(cell);
                }
            }
        }

        function placeFood() {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * size),
                    y: Math.floor(Math.random() * size),
                };
            } while (snake.some(p => p.x === pos.x && p.y === pos.y));
            return pos;
        }

        function moveSnake() {
            if (direction.x === 0 && direction.y === 0) return;

            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

            const collision =
                head.x < 0 || head.y < 0 ||
                head.x >= size || head.y >= size ||
                snake.some(p => p.x === head.x && p.y === head.y);

            if (collision) {
                endGame("fail");
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                points++;
                if (points === 6) {
                    endGame("win");
                    return;
                }
                food = placeFood();
            } else {
                snake.pop();
            }

            drawGrid();
        }

        function endGame(result) {
            clearInterval(gameInterval);
            document.removeEventListener("keydown", handleKey);

            if (result === "win") {
                state.inventory.codeB = true;
                game.innerHTML = `
        <p>As you won the game, the screen went pitch black. Suddenly the number ${state.codePrefix[1]} flashed on the screen and as quickly as it came, it disappeared. You note that ${state.codePrefix[1]} is the second digit.</p>
        <span class="choice" onclick="loadPassage('opt2')">Leave computer and take USB</span>
      `;
            } else {
                game.innerHTML = `
        <p>Your snake died</p>
        <span class="choice" onclick="loadPassage('play_snake')">Try again</span>
        <span class="choice" onclick="loadPassage('access_computer')">Leave game</span>
      `;
            }
        }

        function handleKey(e) {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                    if (direction.y === 0) direction = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                case "s":
                    if (direction.y === 0) direction = { x: 0, y: 1 };
                    break;
                case "ArrowLeft":
                case "a":
                    if (direction.x === 0) direction = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
                case "d":
                    if (direction.x === 0) direction = { x: 1, y: 0 };
                    break;
            }
        }

        document.addEventListener("keydown", handleKey);
        drawGrid();
        gameInterval = setInterval(moveSnake, 500);
    }





    if (passage === "opt3") {
        if (!state.inventory.accessCard) {
            game.innerHTML = `
            <p>As you approach the cockpit door, it remains firmly sealed. Unlike the others, this one appears to require authorisation. A scanner next to the frame flashes red. You spot a slot labeled: <em>Captain’s Access Card Required</em>.</p>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        } else {
            game.innerHTML = `
            <p>You swipe the access card. The door opens with a soft hiss. Inside the cockpit, a panoramic view of deep space spreads before you. On one side, a PC terminal glows faintly. Opposite it, the viewing deck is cluttered with loose pages, tablets, and broken equipment.</p>
            <span class="choice" onclick="loadPassage('cockpit_pc')">Go to PC</span>
            <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        }
    }
    if (passage === "viewing_deck") {
        clearInterval(interval);
        game.innerHTML = `
        <p>As you step toward the viewing deck, a glint catches your eye—a spacesuit, slumped in the corner, intact. It could be critical for surviving longer outside.</p>
        <p>You lunge toward it in hope, but the floor beneath you gives way with a sharp crack. A hairline fracture on the transparent paneling you hadn't noticed collapses inward.</p>
        <p>Your leg is impaled between twisted metal. No alarms, no klaxons—just silence and the slow pressurised hiss of life leaving the room. You’re pinned, unable to reach the suit.</p>
        <p>All you can do is wait. Not for rescue. Just for time to run out.</p>
    `;

        setTimeout(() => {
            game.innerHTML = `
            <p class="death-message">YOU DIED</p>
            <button onclick="restart()">Try Again</button>
        `;
        }, 10000);
    }

    if (passage === "cockpit_pc") {
        game.innerHTML = `<p>The captain's terminal is still active. They're logged in. Every ship log, mission transcript, system failure—it's all here. This data is irreplaceable. More important than your own survival.</p>`;

        if (state.inventory.usb) {
            game.innerHTML += `<p>You search for a USB input to offload the records. The port is covered by a secured panel.</p>`;

            if (state.inventory.screwdriver) {
                game.innerHTML += `
                <p>Etched faintly into the metal is a string of digits: <strong>${state.codePrefix[0]}${state.codePrefix[1]}56</strong>.  You now face a decision: escape with your life, or risk everything to take the data.</p>
                <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
                <span class="choice" onclick="loadPassage('open_panel')">Open panel</span>
                <span class="choice" onclick="loadPassage('start')">Leave the room</span>
            `;
            } else {
                game.innerHTML += `
                <p>You tug at the panel, but it’s fixed tight. You wish you had a screwdriver.</p>
                <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
                <span class="choice" onclick="loadPassage('start')">Leave the room</span>
            `;
            }
        } else {
            game.innerHTML += `
            <p>You scan the terminal and feel the urgency—but without a USB, you can’t extract anything. You curse under your breath.</p>
            <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        }
    }
    if (passage === "open_panel") {
        game.innerHTML = `
        <p>You insert the USB into the exposed port. Lines of encrypted data begin flooding into the drive at near-instant speed.</p>
        <p>Just before completion—at 99%—a prompt appears on screen: <em>"Enter Project Name for Final Confirmation"</em>.</p>
        <input id="project-name" type="text" />
        <br><br>
        <button onclick="submitProjectName()">Submit</button>
        <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
        <span class="choice" onclick="loadPassage('start')">Leave the room</span>
    `;
    }



    if (passage === "opt4") {
        game.innerHTML = `
    <p>You're ready to escape. Enter the 4-digit code or Leave the room.</p>
    <input id="escape-code" type="text" maxlength="4" />
    <br><br>
    <button onclick="checkEscapeCode()">Enter Code</button>
    <span class="choice" onclick="loadPassage('start')">Leave the room</span>
  `;
    }
    if (passage === "timeout") {
        game.innerHTML = `
      <p class="death-message">YOU DIED</p>
        <button onclick="restart()">Try Again</button>
    `;
    }
}




function submitProjectName() {
    const input = document.getElementById("project-name").value.trim().toLowerCase();
    const game = document.getElementById("game");

    if (input === "ouroboros") {
        state.inventory.codeC = true;
        game.innerHTML = `
            <p>Project name accepted. Transfer complete.</p>
            <p>You yank the USB out. As you turn to leave, your fingers brush the back of the device—etched into the casing is the phrase: <strong>__${state.codePrefix[2]}${state.codePrefix[3]}</strong>.</p>
            <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
    } else {
        game.innerHTML = `
            <p>Incorrect project name. Transfer halted.</p>
            <span class="choice" onclick="loadPassage('open_panel')">Try Again</span>
            <span class="choice" onclick="loadPassage('viewing_deck')">Go to viewing deck</span>
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
    }
}

function checkEscapeCode() {
    const code = document.getElementById("escape-code").value;
    const game = document.getElementById("game");

    if (code === state.codePrefix) {
        clearInterval(interval);
        game.innerHTML = `
      <p >You entered the correct code. The hatch opens, and you launch the escape pod just in time.</p>
      <h1>YOU SURVIVED</h1>
      <span class="choice" id="play-again-btn">Play Again</span>
    `;
        setTimeout(() => {
            const playAgainBtn = document.getElementById("play-again-btn");
            if (playAgainBtn) {
                playAgainBtn.onclick = () => {
                    restart(); // <-- Reset inventory and state
                    gameScreen.classList.add("hidden");
                    instructionsScreen.classList.remove("hidden");
                    setTimeout(() => instructionsScreen.classList.add("visible"), 50);
                };
            }
        }, 500);
    } else {
        clearInterval(interval);
        game.innerHTML = `
        <p>You enter the code: ${code}. The keypad beeps—then flashes red. The hatch stays shut.</p>
        <p>An automated voice echoes through the corridor: <em>"Incorrect override. Self-destruct protocol activated."</em></p>
        <p>You back away in disbelief. Lights dim. Sirens rise. You close your eyes and lean against the wall, thinking about every mistake that led you here.</p>
        
    `;

        setTimeout(() => {
            game.innerHTML = `
            <p class="death-message">YOU DIED</p>
            <button onclick="restart()">Try Again</button>
        `;
        }, 10000);
    }
}

function submitSafeAnswer() {
    const input = document.getElementById("safe-answer").value.trim();
    const game = document.getElementById("game");


    if (input === "1957") {

        game.innerHTML = `
            <p>The safe beeps twice and unlocks. Inside, you find a post-it note with a single number written on it: <strong>${state.codePrefix[0]}</strong>. This is the first digit.</p>
            <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
            ${!state.inventory.ouroborosPapers ? `<span class="choice" onclick="loadPassage('search_papers')">Go through papers</span>` : ""}
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
        state.inventory.codeA = true;
    } else {
        game.innerHTML = `
            <p>The safe remains locked. Incorrect answer.</p>
            <span class="choice" onclick="loadPassage('check_safe')">Try Again</span>
            <span class="choice" onclick="loadPassage('investigate_helmets')">Investigate the helmets</span>
            ${!state.inventory.ouroborosPapers ? `<span class="choice" onclick="loadPassage('search_papers')">Go through papers</span>` : ""}
            <span class="choice" onclick="loadPassage('start')">Leave the room</span>
        `;
    }
}


function restart() {
    state = {
        time: 180,
        complete: false,
        inventory: {},
        emotions: {},
        codePrefix: randomPrefix(),
    };
    document.getElementById("timer").innerText = `Time: ${state.time}`;
    clearInterval(interval);
    interval = setInterval(() => {
        state.time--;
        document.getElementById("timer").innerText = `Time: ${state.time}`;
        if (state.time <= 0) {
            clearInterval(interval);
            loadPassage("timeout");
        }
    }, 1000);
    loadPassage("start");
}
document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "i") {
        showInventory();
    }
});

document.addEventListener("keyup", e => {
    if (e.key.toLowerCase() === "i") {
        hideInventory();
    }
});

function showInventory() {
    const panel = document.getElementById("inventory-panel");
    panel.style.display = "block";
    panel.innerHTML = "<strong>Inventory</strong><br>" + Object.entries(state.inventory)
        .filter(([_, v]) => v)
        .map(([k]) => `- ${k}`)
        .join("<br>");
}

function hideInventory() {
    const panel = document.getElementById("inventory-panel");
    panel.style.display = "none";
}
