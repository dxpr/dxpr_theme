# DXB Slider - Customizable Range + Number Input Slider with RTL Support and WCAG AA Accessibility features

[DXB Slider demo page](https://dxpr.github.io/DXB-Slider/)

DXB Slider is a lightweight, customizable range slider component with a programmatically added number input. It's designed to be easy to implement, accessible, styleable, and supports both LTR and RTL layouts.

<img width="1359" alt="dxb-slider-chrome-firefox-safari" src="https://github.com/user-attachments/assets/f236c778-6377-4172-adb6-9e1408a1c6b7">


## Features

*   Customizable range slider with a dynamically added, synchronized number input
*   Accessible design with ARIA attributes
*   Namespaced CSS for easy integration
*   Minimal JavaScript footprint
*   Support for both LTR (Left-to-Right) and RTL (Right-to-Left) layouts
*   Language-specific numeral display (pending broader browser adoption)
*   Optimized for mobile devices with appropriate software keyboard support

## Installation

To use DXB Slider, include the CSS and JavaScript files in your project, and follow the usage instructions below.

## Usage

1.  Include the CSS in your `<head>` tag:
    
    ```
    <link rel="stylesheet" href="path/to/dxb-slider.min.css">
    ```
    
2.  Add the HTML structure for your slider:
    
    ```
    <div class="dxb-slider-container">
        <label id="mySliderLabel" for="mySlider">Slider Label</label>
        <div class="dxb-slider-wrapper">
            <div class="dxb-slider-track">
                <input type="range" id="mySlider" class="dxb-slider" 
                       min="0" max="100" value="50" step="1" 
                       data-dxb-slider
                       aria-labelledby="mySliderLabel">
            </div>
        </div>
    </div>
    ```
    
3.  Include the JavaScript at the end of your `<body>` tag:
    
    ```
    <script src="path/to/dxb-slider.min.js"></script>
    ```
    
4.  The sliders will be automatically initialized for all elements with the `data-dxb-slider` attribute, including those added dynamically after page load.
    
5.  The sliders will automatically adjust for mobile devices, displaying the appropriate software keyboard (numeric or decimal) based on the slider's configuration.

## RTL Support and Language-Specific Numerals

To use the slider in RTL mode, add the `dir="rtl"` attribute to the container:

```
<div class="dxb-slider-container" dir="rtl" lang="ar">
    <!-- ... slider content ... -->
</div>
```

The slider will automatically adjust its layout for RTL, including:

*   Reversing the order of the slider and number input
*   Adjusting the slider track fill direction
*   Properly aligning text and elements for RTL languages

For language-specific numerals, DXB Slider uses CSS `font-variant-numeric` properties. Currently supported languages include:

*   Arabic (`lang="ar"`)
*   Persian (`lang="fa"`)
*   Bengali (`lang="bn"`)
*   Hindi, Marathi, Nepali (`lang="hi"`, `lang="mr"`, `lang="ne"`)

**Note:** The language-specific numeral feature is currently fully supported in Firefox. Other browsers may have limited or no support for this feature. As browser adoption increases, this feature will become more widely available without any changes to the DXB Slider code.

## Customization

You can customize the appearance of the slider by modifying the CSS variables in the `:root` selector:

```
:root {
    --dxb-slider-width: 270px;
    --dxb-slider-height: 5px;
    --dxb-slider-thumb-size: 20px;
    --dxb-slider-primary-color: #0550e6;
    --dxb-slider-secondary-color: #dadfe7;
}
```

## DXB Slider Feature Comparison

| Feature                       | DXB Slider          | AlRangeSlider      | Ion.RangeSlider     | Simple Slider        | Bootstrap Slider    |
|-------------------------------|---------------------|--------------------|---------------------|----------------------|---------------------|
| **File Size**                  | 1 KB                | 75 KB              | 85 KB               | 15 KB                | 11 KB               |
| **Dependency-free**            | ✅                  | ❌ (jQuery)        | ❌ (jQuery)         | ❌ (jQuery)          | ✅ (Optional)       |
| **Supports Double Handle**     | ❌                  | ✅                 | ✅                  | ❌                   | ✅                  |
| **RTL Support**                | ✅                  | ❌                 | ❌                  | ❌                   | ✅                  |
| **Mobile Optimization**        | ✅                  | ❌                 | ✅                  | ❌                   | ✅                  |
| **Accessibility Features**     | ✅                  | ❌                 | ❌                  | ❌                   | ✅                  |
| **Built-in Themes/Skins**      | ❌                  | ❌                 | ✅ (6 skins)        | ✅                   | ✅                  |
| **Touch Support**              | ✅                  | ❌                 | ✅                  | ✅                   | ✅                  |

*Comparison of range slider plugins based on key features.*

## Accessibility

DXB Slider is designed with accessibility in mind:

*   The range input is properly labeled using `aria-labelledby`.
*   ARIA attributes (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`) are dynamically updated to reflect the current state of the slider.
*   The number input is added programmatically and hidden from screen readers (`aria-hidden="true"`) to avoid redundancy and potential confusion.
*   The slider can be operated using keyboard controls (arrow keys for fine adjustment, Page Up/Down for larger steps).

### Keyboard Navigation

*   Arrow Left/Down: Decrease value by one step
*   Arrow Right/Up: Increase value by one step
*   Page Down: Decrease value by 10% of the range
*   Page Up: Increase value by 10% of the range
*   Home: Set to minimum value
*   End: Set to maximum value

## Mobile Support

DXB Slider is optimized for mobile devices, providing an enhanced user experience:

*   The number input field automatically triggers the appropriate software keyboard on mobile devices:
    *   For whole number inputs, a numeric keyboard is displayed.
    *   For decimal inputs (when the slider's `step` attribute includes decimals), a decimal keyboard is shown.
*   The `pattern` attribute ensures that only valid numeric input is accepted.
*   These optimizations work across modern mobile browsers, including Safari.

## Roadmap

1.  Make default design fully WCAG AA or AAA compliant
2.  Add support for tickmarks to aide stepped slider user experience
3.  Add more design customization options, for example for the handle shape
4.  Optimize performance for pages with frequent DOM changes

## Frequently Asked Questions (FAQ)

*   **Q: How do I customize the slider's appearance?**
    
    A: You can customize the slider by modifying the CSS variables in the `:root` selector. Refer to the Customization section for more details.
    
*   **Q: Does DXB Slider support touch devices?**
    
    A: Yes, DXB Slider is designed to work on both desktop and touch devices.
    
*   **Q: How do I enable RTL support?**
    
    A: Add the `dir="rtl"` attribute to the container. Refer to the RTL Support section for more details.
    
*   **Q: What browsers are supported?**
    
    A: DXB Slider supports all modern browsers. Note that language-specific numeral features are currently best supported in Firefox.
    
*   **Q: How can I contribute to the project?**
    
    A: Contributions are welcome! Please open an issue or submit a pull request. Refer to the Contributing section for more details.
    
*   **Q: How does DXB Slider handle input on mobile devices?**
    
    A: DXB Slider automatically displays the appropriate software keyboard (numeric or decimal) on mobile devices based on the slider's configuration. This ensures a smooth input experience for users on touch devices.
    
*   **Q: Does DXB Slider support dynamically added content?**

    A: Yes, DXB Slider automatically detects and initializes new sliders added to the page after the initial load.
    
*   **Q:Is DXB Slider really only 1KB?**

    A: Yes, DXB Slider's minified payload is only 894 bytes at the time of writing. This is possible due to modern browsers supprting CSS styling of native HTML range inputs. Feel free to count the bytes yourself:![image](https://github.com/user-attachments/assets/6ac9ad91-aebc-4c1d-b9ab-922bd6f6b51d)


## License

This project is licensed under the GNU General Public License v2.0 (GPL-2.0) - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
