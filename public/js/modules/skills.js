export function setupSkills() {
  const skillInput = document.getElementById('skill-input');
  const addSkillBtn = document.getElementById('add-skill');
  const skillsList = document.getElementById('skills-list');
  const previewSkills = document.getElementById('preview-skills');
  
  const skills = new Set();
  
  // Add skill
  addSkillBtn.addEventListener('click', addSkill);
  
  // Add skill on Enter key
  skillInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  });
  
  function addSkill() {
    const skill = skillInput.value.trim();
    
    if (skill && !skills.has(skill)) {
      skills.add(skill);
      
      // Create tag element
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `
        ${skill}
        <span class="tag-remove" data-skill="${skill}">&times;</span>
      `;
      
      // Add remove event
      tag.querySelector('.tag-remove').addEventListener('click', () => {
        skills.delete(skill);
        tag.remove();
        updateSkillsPreview();
      });
      
      // Add to DOM
      skillsList.appendChild(tag);
      
      // Clear input
      skillInput.value = '';
      
      // Update preview
      updateSkillsPreview();
    }
    
    skillInput.focus();
  }
  
  function updateSkillsPreview() {
    if (skills.size === 0) {
      previewSkills.innerHTML = '<p class="empty-notice">Add skills to see them here.</p>';
      return;
    }
    
    let html = '';
    
    skills.forEach(skill => {
      html += `<div class="skill-item">${skill}</div>`;
    });
    
    previewSkills.innerHTML = html;
  }
  
  // Function to add skills programmatically (for sample data)
  function addSkillItem(skill) {
    if (skill && !skills.has(skill)) {
      skills.add(skill);
      
      // Create tag element
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `
        ${skill}
        <span class="tag-remove" data-skill="${skill}">&times;</span>
      `;
      
      // Add remove event
      tag.querySelector('.tag-remove').addEventListener('click', () => {
        skills.delete(skill);
        tag.remove();
        updateSkillsPreview();
      });
      
      // Add to DOM
      skillsList.appendChild(tag);
      
      // Update preview
      updateSkillsPreview();
    }
  }
  
  // Return functions for external use (e.g., sample data)
  return {
    addSkillItem
  };
} 