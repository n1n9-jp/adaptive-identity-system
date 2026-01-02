
<!-- Implementation Plan - Variable Font Selection -->

# Goal
Allow the user to select different Variable Fonts from a dropdown menu. The application currently uses 'Roboto Flex' and maps the grid cell aspect ratio to the font's `wdth` axis and height to `wght` axis.

# Changes

## 1. Load Additional Google Fonts (index.html)
We will add the following variable fonts that support the `wdth` (width) axis:
- **Open Sans**: `wdth` 75-100, `wght` 300-800
- **Encode Sans**: `wdth` 75-125, `wght` 100-900
- **Inconsolata**: `wdth` 50-200, `wght` 200-900
- **Turret Road**: (Check if variable? Maybe stick to safe ones) -> Let's stick to the 3 above + Roboto Flex.

## 2. Add UI Controls (index.html)
- Add a floating `<select>` element in the top-right corner.

## 3. Style UI (style.css)
- Position the select box absolute, z-index high.
- Style it to look modern (glassmorphism/dark mode compatible).

## 4. Update Logic (sketch.js)
- Define a configuration object for fonts:
```javascript
const fontConfig = {
    'Roboto Flex': { family: 'Roboto Flex', wdth: [25, 151], wght: [100, 1000] },
    'Open Sans': { family: 'Open Sans', wdth: [75, 100], wght: [300, 800] },
    'Encode Sans': { family: 'Encode Sans', wdth: [75, 125], wght: [100, 900] },
    'Inconsolata': { family: 'Inconsolata', wdth: [50, 200], wght: [200, 900] }
};
```
- Add event listener to the dropdown.
- Update the `draw()` loop to use the current font's min/max values for `map()`.
- Update the `font-family` css of the blocks.
