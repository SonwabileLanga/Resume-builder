export function setupExperience() {
  const addExperienceBtn = document.getElementById('add-experience');
  const experienceItems = document.getElementById('experience-items');
  const previewExperience = document.getElementById('preview-experience');
  const experienceTemplate = document.getElementById('experience-template');
  
  let experienceCount = 0;
  
  // Add experience item
  addExperienceBtn.addEventListener('click', () => {
    addExperienceItem();
  });
  
  function addExperienceItem(data = {}) {
    experienceCount++;
    const id = `experience-${experienceCount}`;
    
    // Clone template
    const clone = document.importNode(experienceTemplate.content, true);
    const container = clone.querySelector('.item-container');
    container.id = id;
    
    // Get form elements
    const companyInput = clone.querySelector('.company-input');
    const positionInput = clone.querySelector('.position-input');
    const startDateInput = clone.querySelector('.start-date-input');
    const endDateInput = clone.querySelector('.end-date-input');
    const currentJobInput = clone.querySelector('.current-job-input');
    const descriptionInput = clone.querySelector('.description-input');
    const reasonLeavingInput = clone.querySelector('.reason-leaving-input');
    const removeBtn = clone.querySelector('.btn-remove');
    
    // Set values if data provided
    if (data.company) companyInput.value = data.company;
    if (data.position) positionInput.value = data.position;
    if (data.startDate) startDateInput.value = data.startDate;
    if (data.endDate) endDateInput.value = data.endDate;
    if (data.currentJob) currentJobInput.checked = data.currentJob;
    if (data.description) descriptionInput.value = data.description;
    if (data.reasonLeaving) reasonLeavingInput.value = data.reasonLeaving;
    
    // Add event listeners
    companyInput.addEventListener('input', updateExperiencePreview);
    positionInput.addEventListener('input', updateExperiencePreview);
    startDateInput.addEventListener('input', updateExperiencePreview);
    endDateInput.addEventListener('input', updateExperiencePreview);
    currentJobInput.addEventListener('change', () => {
      endDateInput.disabled = currentJobInput.checked;
      updateExperiencePreview();
    });
    descriptionInput.addEventListener('input', updateExperiencePreview);
    reasonLeavingInput.addEventListener('input', updateExperiencePreview);
    
    // Handle remove button
    removeBtn.addEventListener('click', () => {
      document.getElementById(id).remove();
      updateExperiencePreview();
    });
    
    // Append to DOM
    experienceItems.appendChild(clone);
    
    // Update preview
    updateExperiencePreview();
    
    // Return the ID for reference
    return id;
  }
  
  function updateExperiencePreview() {
    const items = experienceItems.querySelectorAll('.item-container');
    
    if (items.length === 0) {
      previewExperience.innerHTML = '<p class="empty-notice">Add work experience to see it here.</p>';
      return;
    }
    
    let html = '';
    
    items.forEach(item => {
      const company = item.querySelector('.company-input').value;
      const position = item.querySelector('.position-input').value;
      const startDate = formatDate(item.querySelector('.start-date-input').value);
      const currentJob = item.querySelector('.current-job-input').checked;
      const endDate = currentJob ? 'Present' : formatDate(item.querySelector('.end-date-input').value);
      const description = item.querySelector('.description-input').value;
      const reasonLeaving = item.querySelector('.reason-leaving-input').value;
      
      if (company || position) {
        html += `
          <div class="experience-item">
            <div class="item-header">
              <div>
                <div class="item-title">${position || 'Position'}</div>
                <div class="item-subtitle">${company || 'Company'}</div>
              </div>
              <div class="item-date">${startDate} - ${endDate}</div>
            </div>
            <div class="item-description">${description}</div>
            ${reasonLeaving ? `<div class="item-reason-leaving"><strong>Reason for leaving:</strong> ${reasonLeaving}</div>` : ''}
          </div>
        `;
      }
    });
    
    previewExperience.innerHTML = html || '<p class="empty-notice">Add work experience to see it here.</p>';
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
    addExperienceItem
  };
} 