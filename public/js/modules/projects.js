export function setupProjects() {
  const addProjectBtn = document.getElementById('add-project');
  const projectItems = document.getElementById('project-items');
  const previewProjects = document.getElementById('preview-projects');
  const projectTemplate = document.getElementById('project-template');
  
  let projectCount = 0;
  
  // Add project item
  addProjectBtn.addEventListener('click', () => {
    addProjectItem();
  });
  
  function addProjectItem(data = {}) {
    projectCount++;
    const id = `project-${projectCount}`;
    
    // Clone template
    const clone = document.importNode(projectTemplate.content, true);
    const container = clone.querySelector('.item-container');
    container.id = id;
    
    // Get form elements
    const nameInput = clone.querySelector('.project-name-input');
    const descriptionInput = clone.querySelector('.project-description-input');
    const techInput = clone.querySelector('.project-tech-input');
    const linkInput = clone.querySelector('.project-link-input');
    const removeBtn = clone.querySelector('.btn-remove');
    
    // Set values if data provided
    if (data.name) nameInput.value = data.name;
    if (data.description) descriptionInput.value = data.description;
    if (data.technologies) techInput.value = data.technologies;
    if (data.link) linkInput.value = data.link;
    
    // Add event listeners
    nameInput.addEventListener('input', updateProjectsPreview);
    descriptionInput.addEventListener('input', updateProjectsPreview);
    techInput.addEventListener('input', updateProjectsPreview);
    linkInput.addEventListener('input', updateProjectsPreview);
    
    // Handle remove button
    removeBtn.addEventListener('click', () => {
      document.getElementById(id).remove();
      updateProjectsPreview();
    });
    
    // Append to DOM
    projectItems.appendChild(clone);
    
    // Update preview
    updateProjectsPreview();
    
    // Return the ID for reference
    return id;
  }
  
  function updateProjectsPreview() {
    const items = projectItems.querySelectorAll('.item-container');
    
    if (items.length === 0) {
      previewProjects.innerHTML = '<p class="empty-notice">Add projects to see them here.</p>';
      return;
    }
    
    let html = '';
    
    items.forEach(item => {
      const name = item.querySelector('.project-name-input').value;
      const description = item.querySelector('.project-description-input').value;
      const technologies = item.querySelector('.project-tech-input').value;
      const link = item.querySelector('.project-link-input').value;
      
      if (name) {
        html += `
          <div class="project-item">
            <div class="item-header">
              <div class="item-title">${name}</div>
              ${link ? `<a href="${link}" target="_blank" class="project-link">View Project</a>` : ''}
            </div>
            ${description ? `<div class="item-description">${description}</div>` : ''}
            ${technologies ? `<div class="item-subtitle">Technologies: ${technologies}</div>` : ''}
          </div>
        `;
      }
    });
    
    previewProjects.innerHTML = html || '<p class="empty-notice">Add projects to see them here.</p>';
  }
  
  // Return functions for external use (e.g., sample data)
  return {
    addProjectItem
  };
} 