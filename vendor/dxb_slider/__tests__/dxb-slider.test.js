   // tests/dxb-slider.test.js
   import { JSDOM } from 'jsdom';
   import fs from 'fs';
   import path from 'path';

   describe('DXB Slider', () => {
     let document;
     let window;

     beforeEach(() => {
       const scriptContent = fs.readFileSync(path.resolve(__dirname, '../dxb-slider.js'), 'utf8');

       const dom = new JSDOM(`
         <html>
           <body>
             <label for="mySlider">Slider Label</label>
             <input type="range" id="mySlider" class="dxb-slider" 
                    min="0" max="100" value="50" step="1" 
                    data-dxb-slider>
             <script>${scriptContent}</script>
           </body>
         </html>
       `, { runScripts: "dangerously", resources: "usable" });

       document = dom.window.document;
       window = dom.window;
       global.document = document;
       global.window = window;
     });

     it('should initialize sliders with data-dxb-slider attribute', () => {
       const slider = document.querySelector('#mySlider');
       expect(slider.hasAttribute('data-dxb-initialized')).toBe(true);
     });

     it('should create number input programmatically', () => {
       const numberInput = document.querySelector('.dxb-slider-value');
       expect(numberInput).not.toBeNull();
       expect(numberInput.type).toBe('number');
     });

     it('should synchronize range and number input values', () => {
       const slider = document.querySelector('#mySlider');
       const numberInput = document.querySelector('.dxb-slider-value');
       slider.value = 75;
       slider.dispatchEvent(new window.Event('input'));
       expect(numberInput.value).toBe('75');
     });

     it('should initialize dynamically added sliders', async () => {
       const newSlider = document.createElement('input');
       newSlider.type = 'range';
       newSlider.setAttribute('data-dxb-slider', '');
       
       // Append the new slider to the DOM
       document.body.appendChild(newSlider);

       // Wait for the MutationObserver to trigger
       await new Promise(resolve => setTimeout(resolve, 100));

       expect(newSlider.hasAttribute('data-dxb-initialized')).toBe(true);
     });

     it('should dispatch change event on number input change', () => {
       const slider = document.querySelector('#mySlider');
       const numberInput = document.querySelector('.dxb-slider-value');
       const changeHandler = vi.fn();

       slider.addEventListener('change', changeHandler);
       numberInput.value = 80;
       numberInput.dispatchEvent(new window.Event('change'));

       expect(changeHandler).toHaveBeenCalled();
     });

     it('should synchronize values on number input change', () => {
       const slider = document.querySelector('#mySlider');
       const numberInput = document.querySelector('.dxb-slider-value');
       numberInput.value = 80;
       numberInput.dispatchEvent(new window.Event('input'));

       expect(slider.value).toBe('80');
     });

     it('should set initial ARIA attributes', () => {
       const slider = document.querySelector('#mySlider');
       expect(slider.getAttribute('aria-valuemin')).toBe('0');
       expect(slider.getAttribute('aria-valuemax')).toBe('100');
       expect(slider.getAttribute('aria-valuenow')).toBe('50');
     });

     it('should update aria-valuenow on input', () => {
       const slider = document.querySelector('#mySlider');
       slider.value = 75;
       slider.dispatchEvent(new window.Event('input'));
       expect(slider.getAttribute('aria-valuenow')).toBe('75');
     });
   });