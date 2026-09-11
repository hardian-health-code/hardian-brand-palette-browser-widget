const container = document.getElementById('color-list');
const inputField = document.getElementById('new-color-input');
const addBtn = document.getElementById('add-btn');

// Updated storage key and default brand colors
const storageKey = 'hardianColors';
const defaultColors = [
  "#A37AF5", // Clinical
  "#5BCFFF", // Strategy
  "#49DAB0", // Regulatory
  "#3A6DF5", // IP
  "#FF9FF2", // HEOR
  "#FDD821"  // Operations
];

function renderColors(colors) {
  container.innerHTML = ''; 

  colors.forEach(hex => {
    const item = document.createElement('div');
    item.className = 'color-item';

    const dot = document.createElement('div');
    dot.className = 'color-dot';
    dot.style.backgroundColor = hex;

    const text = document.createElement('span');
    text.className = 'hex-code';
    text.textContent = hex;

    item.appendChild(dot);
    item.appendChild(text);

    item.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(hex);
        window.close();
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });

    container.appendChild(item);
  });
}

// Load Hardian colors from Chrome Storage
chrome.storage.sync.get([storageKey], (result) => {
  let colors = result[storageKey];
  
  if (!colors) {
    colors = defaultColors;
    chrome.storage.sync.set({ [storageKey]: colors });
  }
  
  renderColors(colors);
});

function addNewColor() {
  let newHex = inputField.value.trim().toUpperCase();
  
  if (!newHex.startsWith('#') && newHex.length > 0) {
    newHex = '#' + newHex;
  }

  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(newHex);

  if (isValidHex) {
    chrome.storage.sync.get([storageKey], (result) => {
      let colors = result[storageKey] || defaultColors;
      
      if (!colors.includes(newHex)) {
        colors.push(newHex); 
        
        chrome.storage.sync.set({ [storageKey]: colors }, () => {
          renderColors(colors);
          inputField.value = ''; 
        });
      } else {
        alert("This color is already in your list.");
      }
    });
  } else {
    alert("Please enter a valid hex code (e.g. #FF5733)");
  }
}

addBtn.addEventListener('click', addNewColor);
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addNewColor();
});