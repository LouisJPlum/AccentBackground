/* initialization */
const canvas = document.getElementById('Accent');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/* Utilities */
function randomRange(min, max) /* Random (min,max] */ {
    return ((-1 * Math.random()) + 1) * (max - min) + min;
}
function shuffleArraySequence(arr) /* Rearrange array squence */ {
    let array = arr.slice(); // copy to avoid changing the original
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
}

/* vars */
const colors_orig = ["#00D5FF", "#F5A9B8", "#DC00FF", "#FF814D", "#E4CE00", "#45CE6F", "#0075E9", "#C41E3A"]
const colors = shuffleArraySequence(colors_orig)
const circles = [];
const numCircles = 8;

/* generate circles */
function createCircle() {
    const radius = randomRange(100,1000);
    return {
        radius: radius,
        px: (canvas.width / 2) + randomRange((-1 * canvas.width / 2) - radius, (canvas.width / 2) + radius), //center position x axis
        py: (canvas.height / 2) + randomRange((-1 * canvas.height / 2) - radius, (canvas.height / 2) + radius), //center position y axis
        color: colors[col],
        Vx: randomRange(-0.5,0.5), //x-direction initial speed
        Vy: randomRange(-0.5,0.5)  //y-direction initial speed
    }
}
for (let i = 0; i < numCircles; i++) {
    col=i;
    circles.push(createCircle()); // Populate the circles array
}

/* draw */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.px, circle.py, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
    });
}
function update() {
    circles.forEach(circle => {
        /* Update position */
        circle.px += circle.Vx;
        circle.py += circle.Vy; 
        /* Bounce off walls */
        if (circle.px - circle.radius > canvas.width || circle.px + circle.radius < 0) {
            circle.Vx = -1 * circle.Vx; // Reset speed on x axis
        }
        if (circle.py - circle.radius > canvas.height || circle.py + circle.radius < 0) {
            circle.Vy = -1 * circle.Vy; // Reset speed on y axis 
        }
        /* change direction randomly over time */
        if (Math.random() < 0.01) { // Small chance to change direction
        circle.Vx = randomRange(-0.5,0.5);
        circle.Vy = randomRange(-0.5,0.5);
        }
    });
}

/* main */
function animate() {
    update();
    draw();
    const background = canvas.toDataURL();
    requestAnimationFrame(animate); /* Loop */ 
}
animate()


// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Optionally, reposition the circle if it goes off-screen
    if (circle.x > canvas.width + circle.radius) circle.x = canvas.width + circle.radius;
    if (circle.y > canvas.height + circle.radius) circle.y = canvas.height + circle.radius;
    if (circle.x < circle.radius) circle.x = circle.radius;
    if (circle.y < circle.radius) circle.y = circle.radius;
});

$('body').css({'background-image':"url(" + Canvas.toDataURL("assets/background")+ ")" });