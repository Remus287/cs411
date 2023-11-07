document.addEventListener('DOMContentLoaded', function () {
    const changeTextButton = document.getElementById('changeTextButton');
    const fontSizeButton = document.getElementById('fontSizeButton');
    const displayText = document.getElementById('displayText');

    changeTextButton.addEventListener('click', function () {
        // Generate a random font family
        const fonts = ["Arial, sans-serif", "Times New Roman, serif", "Courier New, monospace", "Georgia, serif", "Verdana, sans-serif"];
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

        // Generate a random color
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        // Set the new font family and color
        displayText.style.fontFamily = randomFont;
        displayText.style.color = randomColor;

        // Increase the font size by 20%
        const currentFontSize = window.getComputedStyle(displayText, null).getPropertyValue('font-size');
        const currentSize = parseFloat(currentFontSize);
        const newSize = currentSize * 1.2; // Increase the font size by 20%
        displayText.style.fontSize = newSize + 'px';

        // Disable the button and set a timer to re-enable it after 3 seconds
        changeTextButton.disabled = true;
        setTimeout(() => {
            changeTextButton.disabled = false;
        }, 3000); // 3000 milliseconds = 3 seconds
    });

    fontSizeButton.addEventListener('click', function () {
        const currentFontSize = window.getComputedStyle(displayText, null).getPropertyValue('font-size');
        alert('Current Font Size: ' + currentFontSize);
    });
});
