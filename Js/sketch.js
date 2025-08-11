let sliderData = [0, 0.05, 0, 0, 0, 0, 0, 0];
let particles = [];
const num = 2000;
const colors = ["#EEEEEE", "#32E0C4", "#0D7377", "#212121", "#33C6FF"];

const noiseScale = 0.20 / 50;
const swirlFactor = 0.5;

let angle;
let activeSlider = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Text style for title
    textSize(32);
    textFont('Doto');
    fill(255);
    noStroke();

    let sliderContainer = createSliders();
    createCredits();

    for (let i = 0; i < num; i++) {
        particles.push({
            position: createVector(random(width), random(height)),
            color: color(random(colors))
        });
    }
    noStroke();
}

function createSliders() {
    const labels = [
        "Dot Size",
        "Particle Count",
        "Red",
        "Green",
        "Blue",
        "Speed",
        "Swirl",
        "Rotation"
    ];

    let container = createDiv();
    container.id("slider-container");
    container.style("position", "fixed");
    container.style("bottom", "40px");  // leave space for credits below
    container.style("left", "0");
    container.style("width", "100%");
    container.style("background", "rgba(0,0,0,0.7)");
    container.style("display", "flex");
    container.style("justify-content", "space-around");
    container.style("align-items", "center");
    container.style("padding", "10px");
    container.style("z-index", "10");

    for (let i = 0; i < sliderData.length; i++) {
        let group = createDiv();
        group.style("color", "white");
        group.style("text-align", "center");
        group.style("font-family", "sans-serif");
        group.style("user-select", "none");

        let label = createDiv(labels[i]);
        label.style("margin-bottom", "4px");
        let startVal = (i === 1) ? 0.05 : 0;
        let slider = createSlider(0, 1, startVal, 0.01);
        slider.input(() => {
            sliderData[i] = slider.value();
        });

        group.child(label);
        group.child(slider);
        container.child(group);

        sliderData[i] = startVal;
    }

    return container;
}

function createCredits() {
    let credits = createDiv("Created by Samantha Mharie, Evelin Flamis, Christian Brown & Kimberly Bradfield | Creative Computing 2024");
    credits.id("credits");
    credits.style("position", "fixed");
    credits.style("bottom", "10px");  // below slider container at 40px + 10px gap
    credits.style("left", "0");
    credits.style("width", "100%");
    credits.style("text-align", "center");
    credits.style("color", "white");
    credits.style("font-family", "doto");
    credits.style("font-size", "14px");
    credits.style("pointer-events", "none");
    credits.style("user-select", "none");
    credits.style("z-index", "10");
}

// function mouseWheel(event) {
//     sliderData[activeSlider] = constrain(
//         sliderData[activeSlider] + event.delta / -1000,
//         0,
//         1
//     );
// }

// function keyPressed() {
//     if (key >= '1' && key <= '8') {
//         activeSlider = parseInt(key) - 1;
//         console.log(`Active slider: ${activeSlider + 1}`);
//     }
// }

function draw() {
    background(0, 50);

    // Draw title top-left
    fill(255);
    textAlign(LEFT, TOP);
    text("Cosmic Rays", 20, 20);

    for (let i = 0; i < num * sliderData[1]; i++) {
        let p = particles[i];

        if (sliderData[2] < 0.01 && sliderData[3] < 0.01 && sliderData[4] < 0.01) {
            fill(255);
        } else {
            fill(sliderData[2] * 500, sliderData[3] * 500, sliderData[4] * 500);
        }

        ellipse(p.position.x, p.position.y, 20 * sliderData[0]);

        let n = noise(
            p.position.x * noiseScale + sliderData[1],
            p.position.y * noiseScale + sliderData[1],
            frameCount * noiseScale * noiseScale + sliderData[1]
        );

        n *= sliderData[6];

        // Smooth, slow rotation scaling sliderData[7] by 0.1
        angle = TAU * n + frameCount * swirlFactor * (sliderData[7] * 0.1);
        let radius = 3 + 20 * noise(frameCount * 0.01 + i);

        p.position.x += cos(angle) * radius * sliderData[5];
        p.position.y += sin(angle) * radius * sliderData[5];

        if (!onScreen(p.position)) {
            p.position.x = random(width);
            p.position.y = random(height);
        }
    }
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
}
 function sendHeight() {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ iframeHeight: height }, '*');
  }

  window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);