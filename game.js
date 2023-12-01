document.addEventListener("DOMContentLoaded", function () {
    // Retrieve name and nickname from local storage
    const name = localStorage.getItem("name");
    const nickname = localStorage.getItem("nickname");
  
    // Display name and nickname in the name-box
    const nameBox = document.querySelector(".name-box");
    nameBox.textContent = `Name: ${name} | Nickname: ${nickname}`;
  
    // Style for text in name-box
    nameBox.style.color = "#FFFFFF";
    nameBox.style.fontSize = "20px";
    nameBox.style.textAlign = "center";
  
    // Audio elements
    var hitPaddleSound = document.getElementById("hitPaddleSound");
    var hitBrickSound = document.getElementById("hitBrickSound");
    var loseLifeSound = document.getElementById("loseLifeSound");
  
    // Canvas setup
    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");
  
    // Ball properties
    var ballRadius = 7;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 3;
    var dy = -3;
  
    // Paddle properties
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var gameStarted = false;
  
    // Brick properties
    var brickRowCount = 5;
    var brickColumnCount = 12;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var bricks = [];
  
    // Initialize bricks
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: "standing" };
        }
    }
  
    // Game state
    var lives = 3;
    var score = 0;
  
    // Event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("touchstart", touchStartHandler, false);
    document.addEventListener("touchmove", touchMoveHandler, false);
    canvas.addEventListener("touchend", touchEndHandler, false);
    document.addEventListener("keydown", startGameHandler, false);
  
    // Event handler functions
    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }
  
    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }
  
    function touchStartHandler(e) {
        e.preventDefault();
        var touch = e.touches[0];
        touchX = touch.clientX;
    }
  
    function touchMoveHandler(e) {
        e.preventDefault();
        var touch = e.touches[0];
        var relativeX = touch.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }
  
    function touchEndHandler(e) {
        e.preventDefault();
        if (!gameStarted) {
            gameStarted = true;
            draw();
        }
    }
  
    function startGameHandler(e) {
        if (e.code === "Space" && !gameStarted) {
            gameStarted = true;
            draw();
        }
    }
  
    // Initialize bricks to "standing" state
    function resetBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = "standing";
            }
        }
  
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2.5;
        dy = -2.5;
    }
  
    // Redirect to game-over.html when the game is over
    function gameOver() {
        localStorage.setItem("finalScore", score);
        window.location.href = "game-over.html";
    }
  
    // Check for collisions with paddle and bricks
    function collisionDetection() {
        // Paddle collision
        if (x > paddleX && x < paddleX + paddleWidth && y + dy > canvas.height - ballRadius - paddleHeight) {
            dy = -dy;
            hitPaddleSound.play(); // Play hit paddle sound
        }
  
        // Bricks collision
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == "standing") {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = "broken";
                        score++;
                        hitBrickSound.play(); // Play hit brick sound
                        if (score == brickRowCount * brickColumnCount) {
                            resetBricks();
                        }
                    }
                }
            }
        }
    }
  
    // Draw the ball on the canvas
    function drawBall() {
        context.beginPath();
        context.arc(x, y, ballRadius, 0, Math.PI * 2);
        context.fillStyle = "#FFFFFF";
        context.fill();
        context.closePath();
    }
  
    // Draw the paddle on the canvas
    function drawPaddle() {
        context.beginPath();
        context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        context.fillStyle = "#FFFFFF";
        context.fill();
        context.closePath();
    }
  
    // Draw the bricks on the canvas
    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == "standing") {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    context.beginPath();
                    context.rect(brickX, brickY, brickWidth, brickHeight);
                    context.fillStyle = "#FFFFFF";
                    context.fill();
                    context.closePath();
                }
            }
        }
    }
  
    // Main draw function
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        if (!gameStarted) {
            context.font = "25px Arial";
            context.fillStyle = "#FFFFFF";
            var text = "Press Space Bar to Start";
            var textWidth = context.measureText(text).width;
            context.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);
            return;
        }
  
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
  
        // Display lives and score
        context.font = "15px Arial";
        context.fillStyle = "#FFFFFF";
        context.fillText("Lives: " + lives + "/3", 10, 20);
        context.fillText("Score: " + score, canvas.width - 80, 20);
  
        // Ball movement and collision logic
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            // Paddle collision
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                // Lose life
                lives--;
                loseLifeSound.play(); // Play lose life sound
                if (lives == 0) {
                    gameOver();
                    return;
                } else {
                    // Reset ball and paddle position
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
  
        // Paddle movement
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
  
        // Update ball position
        x += dx;
        y += dy;
  
        // Request animation frame for the next draw cycle
        requestAnimationFrame(draw);
    }
  });
  