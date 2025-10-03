export function setupNavigation() {
  const sectionButtons = document.querySelectorAll('.section-btn');
  const formSections = document.querySelectorAll('.form-section');
  
  sectionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and sections
      sectionButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-white/30');
        btn.classList.add('bg-white/20');
      });
      formSections.forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
      });
      
      // Add active class to clicked button
      button.classList.add('active', 'bg-white/30');
      button.classList.remove('bg-white/20');
      
      // Show corresponding section
      const sectionId = `${button.dataset.section}-section`;
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
      }
    });
  });
} 