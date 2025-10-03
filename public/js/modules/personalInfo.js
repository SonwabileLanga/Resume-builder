export function setupPersonalInfo() {
  const fullNameInput = document.getElementById('fullName');
  const jobTitleInput = document.getElementById('jobTitle');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const locationInput = document.getElementById('location');
  const linkedinInput = document.getElementById('linkedin');
  const portfolioInput = document.getElementById('portfolio');
  const githubInput = document.getElementById('github');
  
  // Update preview when inputs change
  fullNameInput.addEventListener('input', updatePersonalInfo);
  jobTitleInput.addEventListener('input', updatePersonalInfo);
  emailInput.addEventListener('input', updatePersonalInfo);
  phoneInput.addEventListener('input', updatePersonalInfo);
  locationInput.addEventListener('input', updatePersonalInfo);
  linkedinInput.addEventListener('input', updatePersonalInfo);
  portfolioInput.addEventListener('input', updatePersonalInfo);
  githubInput.addEventListener('input', updatePersonalInfo);
  
  function updatePersonalInfo() {
    document.getElementById('preview-name').textContent = fullNameInput.value || 'Your Name';
    document.getElementById('preview-title').textContent = jobTitleInput.value || 'Your Job Title';
    document.getElementById('preview-email').textContent = emailInput.value || 'email@example.com';
    document.getElementById('preview-phone').textContent = phoneInput.value || 'Phone Number';
    document.getElementById('preview-location').textContent = locationInput.value || 'Location';
    
    // Update social links
    updateSocialLinks();
  }
  
  function updateSocialLinks() {
    const linksContainer = document.getElementById('preview-links');
    const links = [];
    
    if (linkedinInput.value) {
      links.push(`<a href="${linkedinInput.value}" target="_blank" rel="noopener">LinkedIn</a>`);
    }
    if (portfolioInput.value) {
      links.push(`<a href="${portfolioInput.value}" target="_blank" rel="noopener">Portfolio</a>`);
    }
    if (githubInput.value) {
      links.push(`<a href="${githubInput.value}" target="_blank" rel="noopener">GitHub</a>`);
    }
    
    if (links.length > 0) {
      linksContainer.innerHTML = links.join(' | ');
    } else {
      linksContainer.innerHTML = '';
    }
  }
  
} 