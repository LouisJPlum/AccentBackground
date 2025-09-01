const canvas = document.getElementById('Accent');
const ctx = canvas.getContext('2d');
const expd = 1.5;
const colors_orig = ["#00D5FF", "#F5A9B8", "#DC00FF", "#FF814D", "#E4CE00", "#45CE6F", "#0075E9", "#C41E3A"];
canvas.width = expd * window.innerWidth;
canvas.height = expd * window.innerHeight;
console.log(`window: ${canvas.width} * ${canvas.height}`);
console.log(`canvas: ${window.innerWidth} * ${window.innerHeight}`);

function randomRange(min, max) {
    return ((-Math.random()) + 1) * (max - min) + min;
}
function shuffleArraySequence(array_orig) {
    let array = array_orig.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const colors = shuffleArraySequence(colors_orig);
const circles = [];
const numCircles = 8;
function createCircle() {
    const radius = randomRange(0.1 * Math.sqrt(window.innerWidth * window.innerHeight), 0.5 * Math.sqrt(window.innerWidth * window.innerHeight));
    return {
        radius: radius, color: colors[col],
        px: randomRange(-radius, window.innerWidth + radius),
        py: randomRange(-radius, window.innerHeight + radius),
        vx: randomRange(-0.00016 * window.innerWidth, 0.00016 * window.innerWidth),
        vy: randomRange(-0.00016 * window.innerHeight, 0.00016 * window.innerHeight),
        vr: 0,
        doResize: 0
    };
}
for (let i = 0; i < numCircles; i++) {
    col=i;
    circles.push(createCircle());
}

function update() {
    circles.forEach(circle => {
        circle.px += circle.vx;
        circle.py += circle.vy;
        if (circle.doResize > 0) {
            circle.radius += circle.vr; 
            if (circle.radius <= 0.1 * Math.sqrt(window.innerWidth * window.innerHeight)) {circle.radius = 0.1 * Math.sqrt(window.innerWidth * window.innerHeight)};
            if (circle.radius >= 0.5 * Math.sqrt(window.innerWidth * window.innerHeight)) {circle.radius = 0.5 * Math.sqrt(window.innerWidth * window.innerHeight)};
        }
        if (circle.px > window.innerWidth + circle.radius || circle.px < -circle.radius) {circle.vx = -circle.vx;}
        if (circle.py > window.innerHeight + circle.radius || circle.py < -circle.radius) {circle.vy = -circle.vy;}
        if (Math.random() < 0.005) {circle.vx = randomRange(-0.00016 * window.innerWidth, 0.00016 * window.innerWidth);}
        if (Math.random() < 0.005) {circle.vy = randomRange(-0.00016 * window.innerHeight, 0.00016 * window.innerHeight);}
        if (Math.random() < 0.00005) {
            circle.vr = randomRange(-0.0003 * Math.sqrt(window.innerWidth * window.innerHeight), 0.0003 * Math.sqrt(window.innerWidth * window.innerHeight));
            circle.doResize = randomRange(0, 10);
        }
    });
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.px, circle.py, circle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
    });
}

/* main */
function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}
animate()

const userAgent = navigator.userAgent;
if(userAgent.includes("iPhone") || userAgent.includes("iPad") ) {}
else{
    window.addEventListener('resize', () => {
        circles.forEach(circle => {
            let kx = window.innerWidth / (canvas.width / expd);
            let ky = window.innerHeight / (canvas.height / expd);
            circle.radius *= Math.sqrt(kx * ky);
            circle.px *= kx;
            circle.py *= ky;
            circle.vx *= kx;
            circle.vy *= ky;
        })
        canvas.width = expd * window.innerWidth;
        canvas.height = expd * window.innerHeight;
        console.log(`window: ${canvas.width} * ${canvas.height}`);
        console.log(`canvas: ${window.innerWidth} * ${window.innerHeight}`);
    });
}
