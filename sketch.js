let rows = [];
const textContent = ['T', 'O', 'K', 'Y', 'O'];

const fontConfig = {
    'Roboto Flex': { family: "'Roboto Flex', sans-serif", wdth: [25, 151], wght: [100, 1000] },
    'Open Sans': { family: "'Open Sans', sans-serif", wdth: [75, 100], wght: [300, 800] },
    'Encode Sans': { family: "'Encode Sans', sans-serif", wdth: [75, 125], wght: [100, 900] },
    'Inconsolata': { family: "'Inconsolata', monospace", wdth: [50, 200], wght: [200, 900] }
};

const PARAMS = {
    font: 'Roboto Flex',
    motion: 'Wave',
    speed: 0.02,
    baseColor: 50,
    contrast: 205, // 255max - 50base = 205
    text: 'TOKYO'
};

let currentFont = fontConfig['Roboto Flex'];
let time = 0;
let pane;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    clear();

    const container = document.getElementById('overlay-container');
    container.innerHTML = '';

    // Generate 5 Rows
    for (let r = 0; r < 5; r++) {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        container.appendChild(rowDiv);

        let rowBlocks = [];

        // Generate 5 Cols per row
        for (let c = 0; c < 5; c++) {
            let div = document.createElement('div');
            div.className = 'char-block';

            let span = document.createElement('span');
            span.className = 'char-content';
            span.innerText = textContent[c];

            div.appendChild(span);
            rowDiv.appendChild(div);

            rowBlocks.push({
                div: div,
                span: span,
                r: r,
                c: c
            });
        }

        rows.push({
            div: rowDiv,
            blocks: rowBlocks
        });
    }

    // --- Tweakpane Setup ---
    pane = new Tweakpane.Pane({
        title: 'Settings',
    });

    pane.addInput(PARAMS, 'font', {
        options: {
            'Roboto Flex': 'Roboto Flex',
            'Open Sans': 'Open Sans',
            'Encode Sans': 'Encode Sans',
            'Inconsolata': 'Inconsolata',
        },
    }).on('change', (ev) => {
        if (fontConfig[ev.value]) {
            currentFont = fontConfig[ev.value];
        }
    });

    pane.addInput(PARAMS, 'motion', {
        options: {
            'Wave': 'Wave',
            'Breath': 'Breath',
            'Noise': 'Noise',
            'Scan': 'Scan',
        }
    });

    pane.addInput(PARAMS, 'speed', { min: 0, max: 0.1 });
    pane.addInput(PARAMS, 'baseColor', { min: 0, max: 255 });
    pane.addInput(PARAMS, 'contrast', { min: 0, max: 255 });
}

function draw() {
    clear();

    // Accumulate time based on user speed
    time += PARAMS.speed;
    let t = time;

    let rowWeights = [];
    let colWeights = [];
    let totalRowWeight = 0;
    let totalColWeight = 0;

    // --- Calculate Weights based on Motion Type ---
    if (PARAMS.motion === 'Wave') {
        for (let r = 0; r < 5; r++) {
            let w = 1.0 + 0.6 * sin(t * 0.7 + r * 1.2);
            rowWeights.push(w);
            totalRowWeight += w;
        }
        for (let c = 0; c < 5; c++) {
            let w = 1.0 + 0.6 * sin(t * 1.1 + c * 0.8);
            colWeights.push(w);
            totalColWeight += w;
        }
    } else if (PARAMS.motion === 'Breath') {
        for (let r = 0; r < 5; r++) {
            let w = 1.0 + 0.5 * sin(t);
            rowWeights.push(w);
            totalRowWeight += w;
        }
        for (let c = 0; c < 5; c++) {
            let w = 1.0 + 0.5 * sin(t * 0.9); // Slightly different phase freq
            colWeights.push(w);
            totalColWeight += w;
        }
    } else if (PARAMS.motion === 'Noise') {
        for (let r = 0; r < 5; r++) {
            // Use noise(t, index)
            let w = map(noise(t * 0.5, r * 10), 0, 1, 0.4, 2.0);
            rowWeights.push(w);
            totalRowWeight += w;
        }
        for (let c = 0; c < 5; c++) {
            let w = map(noise(t * 0.5, c * 10 + 100), 0, 1, 0.4, 2.0);
            colWeights.push(w);
            totalColWeight += w;
        }
    } else if (PARAMS.motion === 'Scan') {
        // A peak moves across
        let phase = (t * 0.5) % 5; // 0 to 5
        for (let r = 0; r < 5; r++) {
            let dist = abs(r - phase);
            // Create a bell curve bump
            let w = 1.0 + 2.0 * exp(-dist * dist * 2);
            rowWeights.push(w);
            totalRowWeight += w;
        }
        // Horizontal scan with different speed
        let catPhase = (t * 0.7 + 2.5) % 5;
        for (let c = 0; c < 5; c++) {
            let dist = abs(c - catPhase);
            let w = 1.0 + 2.0 * exp(-dist * dist * 2);
            colWeights.push(w);
            totalColWeight += w;
        }
    } else {
        // Fallback default (Wave)
        for (let r = 0; r < 5; r++) {
            let w = 1.0 + 0.6 * sin(t * 0.7 + r * 1.2);
            rowWeights.push(w);
            totalRowWeight += w;
        }
        for (let c = 0; c < 5; c++) {
            let w = 1.0 + 0.6 * sin(t * 1.1 + c * 0.8);
            colWeights.push(w);
            totalColWeight += w;
        }
    }

    // Apply Styles
    for (let r = 0; r < 5; r++) {
        let rowHPercent = (rowWeights[r] / totalRowWeight) * 100;
        rows[r].div.style.height = `${rowHPercent}%`;
        let pxH = windowHeight * (rowHPercent / 100);

        for (let c = 0; c < 5; c++) {
            let block = rows[r].blocks[c];

            let colWPercent = (colWeights[c] / totalColWeight) * 100;
            block.div.style.width = `${colWPercent}%`;
            let pxW = windowWidth * (colWPercent / 100);

            // --- Font Styling ---
            let aspectRatio = pxW / pxH;

            // Font Size: Fill Height aggressively
            // Since "TOKYO" is all caps, Cap Height is the detailed metric.
            // Typical Cap Height is ~70-75% of em size.
            // Multiplier 1.25 ensures Caps touch top/bottom.
            let fontSize = pxH * 1.25;
            block.div.style.fontSize = `${fontSize}px`;

            // Weight: Driven by Height
            let wght = map(pxH, 50, windowHeight / 3, currentFont.wght[0], currentFont.wght[1], true);

            // Width: Driven by Aspect Ratio
            let wdth = map(aspectRatio, 0.4, 1.6, currentFont.wdth[0], currentFont.wdth[1], true);

            block.div.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}`;
            block.div.style.fontFamily = currentFont.family;

            // --- Color Mapping ---
            let relativeArea = rowWeights[r] * colWeights[c];
            let maxLightness = Math.min(255, PARAMS.baseColor + PARAMS.contrast);
            let lightness = map(relativeArea, 0.3, 2.2, PARAMS.baseColor, maxLightness, true);
            block.div.style.backgroundColor = `rgb(${lightness}, ${lightness}, ${lightness})`;

            // --- Geometric Force Stretch ---
            let naturalWidth = block.span.offsetWidth;

            if (naturalWidth > 0 && pxW > 0) {
                // Target width 95% of box width
                let targetW = pxW * 0.95;
                let scaleX = targetW / naturalWidth;

                block.span.style.transform = `scaleX(${scaleX})`;
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
