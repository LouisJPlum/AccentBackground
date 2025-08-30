/* initialization */
const canvas = document.getElementById('Accent'); const ctx = canvas.getContext('2d'); // initialize canvas
const colors_orig = ["#00D5FF", "#F5A9B8", "#DC00FF", "#FF814D", "#E4CE00", "#45CE6F", "#0075E9", "#C41E3A"] // colors according to "Accent" designing language
canvas.width = window.innerWidth; canvas.height = window.innerHeight; // set canvas width & height to fill window
console.log("resolution: " + canvas.width + "*" + canvas.height) // for debug

/* utilities & libs */
function randomRange(min, max) {return ((-Math.random()) + 1) * (max - min) + min;} // random funtion (min,max], also can prevent generating 0
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
const numCircles = 8; // 8 ballons according to "Accent" designing language. anyway you can change it if u want, but remember to edit color_orig array to match this number as its length
function createCircle() {
    const radius = randomRange(0.07 * Math.sqrt(canvas.width * canvas.height), 0.7 * Math.sqrt(canvas.width * canvas.height)); // random radius
    return {
        radius: radius, color: colors[col], // set radius & color
        px: randomRange(-radius, canvas.width + radius), // random x axis position
        py: randomRange(-radius, canvas.height + radius), // random y axis position
        vx: randomRange(-0.00026 * canvas.width, 0.00026 * canvas.width), // x-direction initial speed
        vy: randomRange(-0.00026 * canvas.height, 0.00026 * canvas.height),  // y-direction initial speed
        vr: 0, doResize: 0 // set initial radius changing rate and duration to 0
    }
}
for (let i = 0; i < numCircles; i++) {
    col=i; // related to color setting
    circles.push(createCircle()); // populate the circles array with objects
}

/* draw */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    circles.forEach(circle => {
        ctx.beginPath(); // begin
        ctx.arc(circle.px, circle.py, circle.radius, 0, 2 * Math.PI); // draw circular arc: ctx.arc(x, y, radius, startAngle(rad), endAngle(rad), counterclockwise(true/false));
        ctx.fillStyle = circle.color; ctx.fill(); // set fill color & fill circle
        ctx.closePath(); // end
    });
} // draw & reveal on screen
function update() {
    circles.forEach(circle => {
        /* move & resize */
        circle.px += circle.vx; circle.py += circle.vy; // move position
        if (circle.doResize > 0) {
            circle.radius += circle.vr; // change size
            if (circle.radius <= 0) {circle.radius = 0}; // prevent negative radius
            if (circle.radius >= 0.7 * Math.sqrt(canvas.width * canvas.height)) {circle.radius = 0.7 * Math.sqrt(canvas.width * canvas.height)}; // prevent radius too large
        }
        /* bounce off walls */
        if (circle.px - circle.radius > canvas.width || circle.px + circle.radius < 0) {circle.vx = -circle.vx;} // reverse speed on x axis
        if (circle.py - circle.radius > canvas.height || circle.py + circle.radius < 0) {circle.vy = -circle.vy;}  // reverse speed on y axis
        /* change randomly over time */
        if (Math.random() < 0.005) {circle.vx = randomRange(-0.00026 * canvas.width, 0.00026 * canvas.width);} // random x speed
        if (Math.random() < 0.005) {circle.vy = randomRange(-0.00026 * canvas.height, 0.00026 * canvas.height);} // random y speed
        if (Math.random() < 0.0005) {
            circle.vr = randomRange(-0.0007 * Math.sqrt(canvas.width * canvas.height), 0.0007 * Math.sqrt(canvas.width * canvas.height)); // random radius changing rate
            circle.doResize = randomRange(0, 10); // random radius changing duration
        }
    });
} // update values

/* main */
function animate() {
    update(); draw(); // get new values & draw frame
    requestAnimationFrame(animate); // loop
}
animate() // start animation

/* dealing resizes */
window.addEventListener('resize', () => {
    circles.forEach(circle => {
        let kx = window.innerWidth / canvas.width; let ky = window.innerHeight / canvas.height; // calculating "scaling coefficient" k, both x & y axes, formula: k = new / orig
        circle.radius *= Math.sqrt(kx * ky); circle.px *= kx; circle.py *= ky; circle.vx *= kx; circle.vy *= ky; // scaling size (radius), position x & y and speed x & y
    })
    canvas.width = window.innerWidth; canvas.height = window.innerHeight; // adjust canvas width & height to fill window
    console.log("resolution: " + canvas.width + "*" + canvas.height) // for debug
});
