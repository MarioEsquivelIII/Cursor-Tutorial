// Initialize Kaboom
kaboom({
    width: 800,
    height: 600,
    background: [0, 0, 0],
});

const PLAYER_SPEED = 200;
const JUMP_FORCE = 450;
const GRAVITY = 800;

// Set global gravity
setGravity(GRAVITY);

scene("main", () => {
    // Game state
    let score = 0;

    // Score display
    const scoreText = add([
        text("Score: 0", { size: 24 }),
        pos(20, 20),
        fixed(),
    ]);

    // Player
    const player = add([
        rect(32, 32),
        pos(100, 528),
        area(),
        body({
            jumpForce: JUMP_FORCE,
            gravityScale: 1,
        }),
        color(0, 255, 0),
        "player"
    ]);

    // Jump indicator
    const jumpIndicator = add([
        rect(32, 4),
        pos(player.pos.x, player.pos.y + 36),
        color(255, 255, 0),
        fixed(),
    ]);

    // Platforms
    add([rect(800, 40), pos(0, 560), area(), body({ isStatic: true }), color(255, 255, 255), "platform"]);
    add([rect(200, 20), pos(100, 400), area(), body({ isStatic: true }), color(255, 255, 255), "platform"]);
    add([rect(200, 20), pos(400, 300), area(), body({ isStatic: true }), color(255, 255, 255), "platform"]);
    add([rect(200, 20), pos(600, 200), area(), body({ isStatic: true }), color(255, 255, 255), "platform"]);

    // Moving platform
    const movingPlatform = add([
        rect(150, 20),
        pos(300, 450),
        area(),
        body({ isStatic: true }),
        color(255, 165, 0),
        "platform",
        "moving"
    ]);

    // Coins
    for (let i = 0; i < 10; i++) {
        add([
            circle(10),
            pos(30 + i * 100, 350),
            area(),
            color(255, 215, 0),
            "coin"
        ]);
    }

    // Player movement
    onKeyDown("left", () => {
        player.move(-PLAYER_SPEED, 0);
    });

    onKeyDown("right", () => {
        player.move(PLAYER_SPEED, 0);
    });

    // Jump mechanics
    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump();
            console.log("Player jumped!");
        }
    });

    // Update jump indicator
    player.onUpdate(() => {
        jumpIndicator.pos = vec2(player.pos.x, player.pos.y + 36);
        jumpIndicator.color = player.isGrounded() ? rgb(255, 255, 0) : rgb(100, 100, 100);
    });

    // Moving platform logic
    let platformDirection = 1;
    movingPlatform.onUpdate(() => {
        movingPlatform.move(100 * platformDirection, 0);
        if (movingPlatform.pos.x > 500) platformDirection = -1;
        if (movingPlatform.pos.x < 100) platformDirection = 1;
    });

    // Coin collection
    player.onCollide("coin", (coin) => {
        destroy(coin);
        score += 10;
        scoreText.text = `Score: ${score}`;
    });

    // Camera follows player
    player.onUpdate(() => {
        camPos(player.pos);
    });

    // Game over if player falls
    player.onUpdate(() => {
        if (player.pos.y > height()) {
            go("gameover", score);
        }
    });
});

// Game over scene
scene("gameover", (finalScore) => {
    add([
        text("Game Over!", { size: 64 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
    ]);

    add([
        text(`Final Score: ${finalScore}`, { size: 32 }),
        pos(width() / 2, height() / 2 + 60),
        anchor("center"),
    ]);

    add([
        text("Press 'r' to restart", { size: 32 }),
        pos(width() / 2, height() / 2 + 120),
        anchor("center"),
    ]);

    onKeyPress("r", () => {
        go("main");
    });
});

// Start the game
go("main"); 