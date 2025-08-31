/* initialization */
const canvas = document.getElementById('Accent'); const ctx = canvas.getContext('2d'); // initialize canvas
const expd = 1.5 // expand the canvas to prevent gaussian blur white background in
const colors_orig = ["#00D5FF", "#F5A9B8", "#DC00FF", "#FF814D", "#E4CE00", "#45CE6F", "#0075E9", "#C41E3A"] // colors according to "Accent" designing language
canvas.width = expd * window.innerWidth; canvas.height = expd * window.innerHeight; // set canvas width & height to fill window
console.log(`window: ${canvas.width} * ${canvas.height}`) // for debug
console.log(`canvas: ${window.innerWidth} * ${window.innerHeight}`) // for debug

/* utilities & libs */
function randomRange(min, max) {return ((-Math.random()) + 1) * (max - min) + min;} // random funtion (min,max]
function shuffleArraySequence(array_orig) {
    let array = array_orig.slice(); // copy to avoid changes to the original
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // generate random number & convent to integer. this matter the sequece
        [array[i], array[j]] = [array[j], array[i]]; // swap array element i with j
    }
    return array;
} // rearrange array squence funtion

/* generate values of circles */
const colors = shuffleArraySequence(colors_orig); // generate random layer sequence
const circles = []; // will be filled with circle data later
const numCircles = 8; // 8 ballons according to "Accent" designing language. if changed, remember to edit array color_orig length to match.
function createCircle() {
    const radius = randomRange(0.1 * Math.sqrt(window.innerWidth * window.innerHeight), 0.5 * Math.sqrt(window.innerWidth * window.innerHeight)); // random radius
    return {
        radius: radius, color: colors[col], // set radius & color
        px: randomRange(-radius, window.innerWidth + radius), // random x axis position
        py: randomRange(-radius, window.innerHeight + radius), // random y axis position
        vx: randomRange(-0.00016 * window.innerWidth, 0.00016 * window.innerWidth), // x-direction initial speed
        vy: randomRange(-0.00016 * window.innerHeight, 0.00016 * window.innerHeight),  // y-direction initial speed
        vr: 0, doResize: 0 // set initial radius changing rate and duration to 0
    }
}
for (let i = 0; i < numCircles; i++) {
    col=i; // related to color setting
    circles.push(createCircle()); // populate the circles array with objects
}

/* draw */
function update() {
    circles.forEach(circle => {
        /* move & resize */
        circle.px += circle.vx; circle.py += circle.vy; // move position
        if (circle.doResize > 0) {
            circle.radius += circle.vr; // change size
            if (circle.radius <= 0.1 * Math.sqrt(window.innerWidth * window.innerHeight)) {circle.radius = 0.1 * Math.sqrt(window.innerWidth * window.innerHeight)}; // prevent radius too small also can prevent negative radius
            if (circle.radius >= 0.5 * Math.sqrt(window.innerWidth * window.innerHeight)) {circle.radius = 0.5 * Math.sqrt(window.innerWidth * window.innerHeight)}; // prevent radius too big
        }
        /* bounce off walls */
        if (circle.px > window.innerWidth + circle.radius || circle.px < -circle.radius) {circle.vx = -circle.vx;} // reverse speed on x axis
        if (circle.py > window.innerHeight + circle.radius || circle.py < -circle.radius) {circle.vy = -circle.vy;}  // reverse speed on y axis
        /* change randomly over time */
        if (Math.random() < 0.005) {circle.vx = randomRange(-0.00016 * window.innerWidth, 0.00016 * window.innerWidth);} // random x speed
        if (Math.random() < 0.005) {circle.vy = randomRange(-0.00016 * window.innerHeight, 0.00016 * window.innerHeight);} // random y speed
        if (Math.random() < 0.00005) {
            circle.vr = randomRange(-0.0003 * Math.sqrt(window.innerWidth * window.innerHeight), 0.0003 * Math.sqrt(window.innerWidth * window.innerHeight)); // random radius changing rate
            circle.doResize = randomRange(0, 10); // random radius changing duration
        }
    });
} // calculate & update values
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    circles.forEach(circle => {
        ctx.beginPath(); // begin
        ctx.arc(circle.px, circle.py, circle.radius, 0, 2 * Math.PI); // draw circular arc: ctx.arc(x, y, radius, startAngle(rad), endAngle(rad), counterclockwise(true/false));
        ctx.fillStyle = circle.color; ctx.fill(); // set fill color & fill circle
        ctx.closePath(); // end
    });
} // draw & reveal on screen

/* main */
function animate() {
    update(); draw(); // get new values then draw frame
    requestAnimationFrame(animate); // loop
}
animate() // start animation

/* dealing resizes */
const userAgent = navigator.userAgent;
if(userAgent.includes("iPhone") || userAgent.includes("iPad") ) {} // disable resizing on iOS devices
else{
    window.addEventListener('resize', () => {
        circles.forEach(circle => {
            let kx = window.innerWidth / (canvas.width / expd); let ky = window.innerHeight / (canvas.height / expd); // calculating "scaling coefficient" k, both x & y axes, formula: k = new / orig
            circle.radius *= Math.sqrt(kx * ky); circle.px *= kx; circle.py *= ky; circle.vx *= kx; circle.vy *= ky; // scaling size (radius), position x & y and speed x & y
        })
        canvas.width = expd * window.innerWidth; canvas.height = expd * window.innerHeight; // adjust canvas width & height to fill window
        console.log(`window: ${canvas.width} * ${canvas.height}`) // for debug
        console.log(`canvas: ${window.innerWidth} * ${window.innerHeight}`) // for debug
    });
}
