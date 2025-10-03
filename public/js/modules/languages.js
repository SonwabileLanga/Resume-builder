export function setupLanguages() {
  const addLanguageBtn = document.getElementById('add-language');
  const languageItems = document.getElementById('language-items');
  const previewLanguages = document.getElementById('preview-languages');
  const languageTemplate = document.getElementById('language-template');
  
  let languageCount = 0;
  
  // Add language item
  addLanguageBtn.addEventListener('click', () => {
    addLanguageItem();
  });
  
  function addLanguageItem(data = {}) {
    languageCount++;
    const id = `language-${languageCount}`;
    
    // Clone template
    const clone = document.importNode(languageTemplate.content, true);
    const container = clone.querySelector('.item-container');
    container.id = id;
    
    // Get form elements
    const nameInput = clone.querySelector('.language-name-input');
    const levelInput = clone.querySelector('.language-level-input');
    const removeBtn = clone.querySelector('.btn-remove');
    
    // Set values if data provided
    if (data.name) nameInput.value = data.name;
    if (data.level) levelInput.value = data.level;
    
    // Add event listeners
    nameInput.addEventListener('input', updateLanguagesPreview);
    levelInput.addEventListener('change', updateLanguagesPreview);
    
    // Handle remove button
    removeBtn.addEventListener('click', () => {
      document.getElementById(id).remove();
      updateLanguagesPreview();
    });
    
    // Append to DOM
    languageItems.appendChild(clone);
    
    // Update preview
    updateLanguagesPreview();
    
    // Return the ID for reference
    return id;
  }
  
  function updateLanguagesPreview() {
    const items = languageItems.querySelectorAll('.item-container');
    
    if (items.length === 0) {
      previewLanguages.innerHTML = '<p class="empty-notice">Add languages to see them here.</p>';
      return;
    }
    
    let html = '';
    
    items.forEach(item => {
      const name = item.querySelector('.language-name-input').value;
      const level = item.querySelector('.language-level-input').value;
      
      if (name) {
        html += `
          <div class="language-item">
            <div class="language-name">${name}</div>
            <div class="language-level">${level}</div>
          </div>
        `;
      }
    });
    
    previewLanguages.innerHTML = html || '<p class="empty-notice">Add languages to see them here.</p>';
  }
  
  // Return functions for external use (e.g., sample data)
  return {
    addLanguageItem
  };
} 