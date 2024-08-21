// dxb-slider.js

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    function initDXBSliders() {
      const sliders = document.querySelectorAll('[data-dxb-slider]');

      sliders.forEach(rangeInput => {
        const container = rangeInput.closest('.dxb-slider-wrapper');

        // Skip creating the number input as it is already created in the Drupal behavior
        const numberInput = container.querySelector('.dxb-slider-value');

        function updateValue() {
          const val = parseFloat(rangeInput.value).toFixed(2); // Ensure the value is treated as a float with two decimal places
          const min = parseFloat(rangeInput.min);
          const max = parseFloat(rangeInput.max);
          const percent = ((val - min) / (max - min)) * 100;

          rangeInput.style.setProperty('--value-percent', `${percent}%`);

          if (numberInput) {
            numberInput.value = val;
            numberInput.min = min;
            numberInput.max = max;
          }

          rangeInput.setAttribute('aria-valuenow', val);
        }

        // Set the initial value based on the 'value' attribute
        rangeInput.value = rangeInput.getAttribute('value');

        // Set initial ARIA attributes
        rangeInput.setAttribute('aria-valuemin', rangeInput.min);
        rangeInput.setAttribute('aria-valuemax', rangeInput.max);

        // Ensure the initial value is correctly set based on the actual input value
        updateValue();

        rangeInput.addEventListener('input', updateValue);

        if (numberInput) {
          numberInput.addEventListener('input', () => {
            rangeInput.value = parseFloat(numberInput.value).toFixed(2);
            updateValue();
          });
        }
      });
    }

    initDXBSliders();
  });
})();


