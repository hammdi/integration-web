// Accessibility Settings Manager
document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle switches
    const toggles = {
      simplifiedReading: document.getElementById('simplified-reading'),
      readableFont: document.getElementById('readable-font'),
      voiceSynthesis: document.getElementById('voice-synthesis'),
      voiceCommand: document.getElementById('voice-command'),
      largeButtons: document.getElementById('large-buttons'),
      darkMode: document.getElementById('dark-mode')
    };
  
    // Get contrast radio buttons
    const contrastRadios = document.querySelectorAll('input[name="contrast"]');
    
    // Get text size radio buttons
    const textSizeRadios = document.querySelectorAll('input[name="text-size"]');
    
    // Get save button
    const saveButton = document.getElementById('save-settings');
  
    // Style toggle switches - Correction du problème de style des toggles
    Object.values(toggles).forEach(toggle => {
      if (toggle) {
        toggle.addEventListener('change', function() {
          const slider = this.nextElementSibling;
          if (this.checked) {
            slider.style.backgroundColor = '#61A9B9';
            slider.querySelector('span') ? slider.querySelector('span').style.transform = 'translateX(24px)' : null;
          } else {
            slider.style.backgroundColor = '#ccc';
            slider.querySelector('span') ? slider.querySelector('span').style.transform = 'translateX(0)' : null;
          }
        });
      }
    });
  
    // Load saved settings from localStorage
    function loadSettings() {
      // Load toggle states
      Object.entries(toggles).forEach(([key, toggle]) => {
        if (toggle) {
          const savedState = localStorage.getItem(key) === 'true';
          toggle.checked = savedState;
          
          // Update toggle appearance
          const slider = toggle.nextElementSibling;
          if (savedState) {
            slider.style.backgroundColor = '#61A9B9';
            slider.querySelector('span') ? slider.querySelector('span').style.transform = 'translateX(24px)' : null;
          }
        }
      });
      
      // Load contrast setting
      const savedContrast = localStorage.getItem('contrast') || 'normal';
      contrastRadios.forEach(radio => {
        if (radio.value === savedContrast) {
          radio.checked = true;
        }
      });
      
      // Load text size setting
      const savedTextSize = localStorage.getItem('textSize') || 'medium';
      textSizeRadios.forEach(radio => {
        if (radio.value === savedTextSize) {
          radio.checked = true;
        }
      });
      
      // Apply settings to the page
      applySettings();
    }
  
    // Apply settings to the page
    function applySettings() {
      // Apply simplified reading mode
      if (toggles.simplifiedReading && toggles.simplifiedReading.checked) {
        document.body.classList.add('simplified-reading');
      } else {
        document.body.classList.remove('simplified-reading');
      }
      
      // Apply readable font
      if (toggles.readableFont && toggles.readableFont.checked) {
        document.body.classList.add('dyslexic-font');
      } else {
        document.body.classList.remove('dyslexic-font');
      }
      
      // Apply large buttons
      if (toggles.largeButtons && toggles.largeButtons.checked) {
        document.body.classList.add('large-buttons');
      } else {
        document.body.classList.remove('large-buttons');
      }
      
      // Apply dark mode
      if (toggles.darkMode && toggles.darkMode.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      // Apply contrast settings
      document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-daltonien');
      contrastRadios.forEach(radio => {
        if (radio.checked) {
          document.body.classList.add(`contrast-${radio.value}`);
        }
      });
      
      // Apply text size settings
      document.body.classList.remove('text-small', 'text-medium', 'text-large');
      textSizeRadios.forEach(radio => {
        if (radio.checked) {
          document.body.classList.add(`text-${radio.value}`);
        }
      });
      
      // Apply voice synthesis (just a placeholder - real implementation would require more work)
      if (toggles.voiceSynthesis && toggles.voiceSynthesis.checked) {
        console.log('Voice synthesis enabled');
        // In a real implementation, you would initialize a speech synthesis engine here
      }
      
      // Apply voice commands (just a placeholder)
      if (toggles.voiceCommand && toggles.voiceCommand.checked) {
        console.log('Voice commands enabled');
        // In a real implementation, you would initialize speech recognition here
      }
    }
  
    // Save settings to localStorage - Correction du problème de sauvegarde
    function saveSettings() {
      try {
        // Save toggle states
        Object.entries(toggles).forEach(([key, toggle]) => {
          if (toggle) {
            localStorage.setItem(key, toggle.checked);
          }
        });
        
        // Save contrast setting
        let contrastValue = 'normal';
        contrastRadios.forEach(radio => {
          if (radio.checked) {
            contrastValue = radio.value;
          }
        });
        localStorage.setItem('contrast', contrastValue);
        
        // Save text size setting
        let textSizeValue = 'medium';
        textSizeRadios.forEach(radio => {
          if (radio.checked) {
            textSizeValue = radio.value;
          }
        });
        localStorage.setItem('textSize', textSizeValue);
    
        // Apply settings to all pages by storing a flag
        localStorage.setItem('accessibilitySettingsApplied', 'true');
        
        console.log('Settings saved successfully:', {
          toggles: Object.fromEntries(Object.entries(toggles).map(([key, toggle]) => [key, toggle ? toggle.checked : false])),
          contrast: contrastValue,
          textSize: textSizeValue
        });
        
        return true;
      } catch (error) {
        console.error('Error saving settings:', error);
        return false;
      }
    }
  
    // Add event listeners to all inputs
    Object.values(toggles).forEach(toggle => {
      if (toggle) {
        toggle.addEventListener('change', applySettings);
      }
    });
    
    contrastRadios.forEach(radio => {
      radio.addEventListener('change', applySettings);
    });
    
    textSizeRadios.forEach(radio => {
      radio.addEventListener('change', applySettings);
    });
    
    // Add event listener to save button - Correction du problème de sauvegarde
    if (saveButton) {
      saveButton.addEventListener('click', function() {
        const success = saveSettings();
        if (success) {
          // Show confirmation message
          alert('Paramètres sauvegardés avec succès!');
          // Apply settings immediately
          applySettings();
        } else {
          alert('Erreur lors de la sauvegarde des paramètres. Veuillez réessayer.');
        }
      });
    }
    
    // Load saved settings on page load
    loadSettings();
    
    // Add CSS for accessibility features
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
      /* Slider styles */
      input:checked + .slider {
        background-color: #61A9B9 !important;
      }
      
      input:checked + .slider:before {
        transform: translateX(24px) !important;
      }
      
      /* Simplified reading mode */
      .simplified-reading {
        line-height: 1.8;
      }
      
      .simplified-reading img:not([alt="important"]) {
        display: none;
      }
      
      /* Dyslexic font */
      .dyslexic-font {
        font-family: "OpenDyslexic", "Comic Sans MS", sans-serif;
        letter-spacing: 0.05em;
        word-spacing: 0.1em;
      }
      
      /* Large buttons */
      .large-buttons button, 
      .large-buttons .button, 
      .large-buttons input[type="button"], 
      .large-buttons input[type="submit"] {
        font-size: 1.2em;
        padding: 0.75em 1.5em;
      }
      
      /* Dark mode */
      .dark-mode {
        background-color: #121212 !important;
        color: #E0E0E0 !important;
      }
      
      .dark-mode .bg-white,
      .dark-mode .bg-background {
        background-color: #1E1E1E !important;
        color: #E0E0E0 !important;
      }
      
      .dark-mode .bg-gray-100,
      .dark-mode .bg-gray-50 {
        background-color: #2D2D2D !important;
        color: #E0E0E0 !important;
      }
      
      .dark-mode button.bg-accent {
        background-color: #AFE3F1 !important;
        color: #121212 !important;
      }
      
      .dark-mode button.bg-accent:hover {
        background-color: #61A9B9 !important;
        color: white !important;
      }
      
      /* Contrast modes */
      .contrast-high {
        background-color: #000 !important;
        color: #FFF !important;
      }
      
      .contrast-high .bg-white,
      .contrast-high .bg-gray-100,
      .contrast-high .bg-gray-50,
      .contrast-high .bg-background {
        background-color: #000 !important;
        color: #FFF !important;
      }
      
      .contrast-high button {
        background-color: #FFF !important;
        color: #000 !important;
        border: 2px solid #FFF !important;
      }
      
      /* Daltonien mode */
      .contrast-daltonien .bg-primary {
        background-color: #0072B2 !important; /* Blue that's distinguishable for most color deficiencies */
      }
      
      .contrast-daltonien .text-primary {
        color: #0072B2 !important;
      }
      
      .contrast-daltonien .bg-accent {
        background-color: #E69F00 !important; /* Orange that's distinguishable for most color deficiencies */
      }
      
      /* Text sizes */
      .text-small {
        font-size: 0.85em !important;
      }
      
      .text-medium {
        font-size: 1em !important;
      }
      
      .text-large {
        font-size: 1.2em !important;
      }
      
      /* Fix for slider appearance */
      .slider:before {
        content: "";
        position: absolute;
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(styleSheet);
  });
  
  // Function to apply settings to all pages
  function applyGlobalSettings() {
    try {
      if (localStorage.getItem('accessibilitySettingsApplied') === 'true') {
        // Apply dark mode
        if (localStorage.getItem('darkMode') === 'true') {
          document.body.classList.add('dark-mode');
        }
        
        // Apply simplified reading
        if (localStorage.getItem('simplifiedReading') === 'true') {
          document.body.classList.add('simplified-reading');
        }
        
        // Apply readable font
        if (localStorage.getItem('readableFont') === 'true') {
          document.body.classList.add('dyslexic-font');
        }
        
        // Apply large buttons
        if (localStorage.getItem('largeButtons') === 'true') {
          document.body.classList.add('large-buttons');
        }
        
        // Apply contrast settings
        const savedContrast = localStorage.getItem('contrast');
        if (savedContrast) {
          document.body.classList.add(`contrast-${savedContrast}`);
        }
        
        // Apply text size settings
        const savedTextSize = localStorage.getItem('textSize');
        if (savedTextSize) {
          document.body.classList.add(`text-${savedTextSize}`);
        }
        
        console.log('Global settings applied:', {
          darkMode: localStorage.getItem('darkMode') === 'true',
          simplifiedReading: localStorage.getItem('simplifiedReading') === 'true',
          readableFont: localStorage.getItem('readableFont') === 'true',
          largeButtons: localStorage.getItem('largeButtons') === 'true',
          contrast: localStorage.getItem('contrast'),
          textSize: localStorage.getItem('textSize')
        });
      }
    } catch (error) {
      console.error('Error applying global settings:', error);
    }
  }
  
  // Apply global settings on page load for all pages
  document.addEventListener('DOMContentLoaded', applyGlobalSettings);