let rows = [];
const textContent = ['T', 'O', 'K', 'Y', 'O'];

const fontConfig = {
    'Roboto Flex': { family: "'Roboto Flex', sans-serif", wdth: [25, 151], wght: [100, 1000] },
    'Open Sans': { family: "'Open Sans', sans-serif", wdth: [75, 100], wght: [300, 800] },
    'Encode Sans': { family: "'Encode Sans', sans-serif", wdth: [75, 125], wght: [100, 900] },
    'Inconsolata': { family: "'Inconsolata', monospace", wdth: [50, 200], wght: [200, 900] }
};

let currentFont = fontConfig['Roboto Flex'];

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

    const selector = document.getElementById('font-selector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            if (fontConfig[e.target.value]) {
                currentFont = fontConfig[e.target.value];
            }
        });
    }
}

function draw() {
    clear();
    let t = millis() * 0.002;

    // --- 1. Calculate and Normalize Row Heights ---
    let rowWeights = [];
    let totalRowWeight = 0;

    for (let r = 0; r < 5; r++) {
        let w = 1.0 + 0.6 * sin(t * 0.7 + r * 1.2);
        rowWeights.push(w);
        totalRowWeight += w;
    }

    // --- 2. Calculate and Normalize Col Widths (Global) ---
    let colWeights = [];
    let totalColWeight = 0;

    for (let c = 0; c < 5; c++) {
        let w = 1.0 + 0.6 * sin(t * 1.1 + c * 0.8);
        colWeights.push(w);
        totalColWeight += w;
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
            let lightness = map(relativeArea, 0.3, 2.2, 50, 255, true);
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
