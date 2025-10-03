export function setupEducation() {
  const addEducationBtn = document.getElementById('add-education');
  const educationItems = document.getElementById('education-items');
  const previewEducation = document.getElementById('preview-education');
  const educationTemplate = document.getElementById('education-template');
  
  let educationCount = 0;
  
  // Add education item
  addEducationBtn.addEventListener('click', () => {
    addEducationItem();
  });
  
  function addEducationItem(data = {}) {
    educationCount++;
    const id = `education-${educationCount}`;
    
    // Clone template
    const clone = document.importNode(educationTemplate.content, true);
    const container = clone.querySelector('.item-container');
    container.id = id;
    
    // Get form elements
    const institutionInput = clone.querySelector('.institution-input');
    const degreeInput = clone.querySelector('.degree-input');
    const startDateInput = clone.querySelector('.edu-start-date-input');
    const endDateInput = clone.querySelector('.edu-end-date-input');
    const currentEduInput = clone.querySelector('.current-edu-input');
    const descriptionInput = clone.querySelector('.edu-description-input');
    const removeBtn = clone.querySelector('.btn-remove');
    
    // Set values if data provided
    if (data.institution) institutionInput.value = data.institution;
    if (data.degree) degreeInput.value = data.degree;
    if (data.startDate) startDateInput.value = data.startDate;
    if (data.endDate) endDateInput.value = data.endDate;
    if (data.currentStudent) currentEduInput.checked = data.currentStudent;
    if (data.description) descriptionInput.value = data.description;
    
    // Add event listeners
    institutionInput.addEventListener('input', updateEducationPreview);
    degreeInput.addEventListener('input', updateEducationPreview);
    startDateInput.addEventListener('input', updateEducationPreview);
    endDateInput.addEventListener('input', updateEducationPreview);
    currentEduInput.addEventListener('change', () => {
      endDateInput.disabled = currentEduInput.checked;
      updateEducationPreview();
    });
    descriptionInput.addEventListener('input', updateEducationPreview);
    
    // Handle remove button
    removeBtn.addEventListener('click', () => {
      document.getElementById(id).remove();
      updateEducationPreview();
    });
    
    // Append to DOM
    educationItems.appendChild(clone);
    
    // Update preview
    updateEducationPreview();
    
    // Return the ID for reference
    return id;
  }
  
  function updateEducationPreview() {
    const items = educationItems.querySelectorAll('.item-container');
    
    if (items.length === 0) {
      previewEducation.innerHTML = '<p class="empty-notice">Add education to see it here.</p>';
      return;
    }
    
    let html = '';
    
    items.forEach(item => {
      const institution = item.querySelector('.institution-input').value;
      const degree = item.querySelector('.degree-input').value;
      const startDate = formatDate(item.querySelector('.edu-start-date-input').value);
      const currentStudent = item.querySelector('.current-edu-input').checked;
      const endDate = currentStudent ? 'Present' : formatDate(item.querySelector('.edu-end-date-input').value);
      const description = item.querySelector('.edu-description-input').value;
      
      if (institution || degree) {
        html += `
          <div class="education-item">
            <div class="item-header">
              <div>
                <div class="item-title">${degree || 'Degree'}</div>
                <div class="item-subtitle">${institution || 'Institution'}</div>
              </div>
              <div class="item-date">${startDate} - ${endDate}</div>
            </div>
            ${description ? `<div class="item-description">${description}</div>` : ''}
          </div>
        `;
      }
    });
    
    previewEducation.innerHTML = html || '<p class="empty-notice">Add education to see it here.</p>';
  }
  
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return `${month} ${year}`;
  }
  
  // Return functions for external use (e.g., sample data)
  return {
    addEducationItem
  };
} 