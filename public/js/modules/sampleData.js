export function loadSampleData() {
  // Import modules to access their functions
  const experienceModule = setupExperience();
  const educationModule = setupEducation();
  const skillsModule = setupSkills();
  const projectsModule = setupProjects();
  const languagesModule = setupLanguages();
  
  // Set personal info
  document.getElementById('fullName').value = 'John Doe';
  document.getElementById('jobTitle').value = 'Full Stack Developer';
  document.getElementById('email').value = 'john.doe@example.com';
  document.getElementById('phone').value = '+1 (555) 123-4567';
  document.getElementById('location').value = 'San Francisco, CA';
  
  // Trigger personal info update
  document.getElementById('fullName').dispatchEvent(new Event('input'));
  
  // Set summary
  document.getElementById('summary').value = 'Experienced Full Stack Developer with 5+ years of experience building web applications using JavaScript, React, and Node.js. Passionate about creating clean, efficient, and user-friendly solutions.';
  document.getElementById('summary').dispatchEvent(new Event('input'));
  
  // Add experience items
  experienceModule.addExperienceItem({
    company: 'Tech Innovations Inc.',
    position: 'Senior Full Stack Developer',
    startDate: '2020-01',
    currentJob: true,
    description: '• Led development of company\'s flagship product, increasing user engagement by 35%\n• Mentored junior developers and implemented code review processes\n• Optimized database queries, reducing load times by 40%'
  });
  
  experienceModule.addExperienceItem({
    company: 'WebSolutions Co.',
    position: 'Frontend Developer',
    startDate: '2018-03',
    endDate: '2019-12',
    description: '• Developed responsive web interfaces using React and Redux\n• Collaborated with UX designers to implement user-friendly interfaces\n• Reduced bundle size by 30% through code optimization'
  });
  
  // Add education items
  educationModule.addEducationItem({
    institution: 'University of Technology',
    degree: 'Bachelor of Science in Computer Science',
    startDate: '2014-09',
    endDate: '2018-05',
    description: 'Graduated with honors. Specialized in web technologies and software engineering.'
  });
  
  // Add skills
  const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'SQL', 'Git', 'AWS', 'Docker'];
  skills.forEach(skill => skillsModule.addSkillItem(skill));
  
  // Add projects
  projectsModule.addProjectItem({
    name: 'E-commerce Platform',
    description: 'Built a full-featured e-commerce platform with product management, cart functionality, and payment processing.',
    technologies: 'React, Node.js, MongoDB, Stripe API',
    link: 'https://github.com/johndoe/ecommerce'
  });
  
  projectsModule.addProjectItem({
    name: 'Task Management App',
    description: 'Developed a collaborative task management application with real-time updates.',
    technologies: 'React, Firebase, Material-UI',
    link: 'https://github.com/johndoe/taskmanager'
  });
  
  // Add languages
  languagesModule.addLanguageItem({
    name: 'English',
    level: 'Native'
  });
  
  languagesModule.addLanguageItem({
    name: 'Spanish',
    level: 'Intermediate'
  });
  
  languagesModule.addLanguageItem({
    name: 'French',
    level: 'Basic'
  });
}

// Helper function to access the setup functions
function setupExperience() {
  return document.querySelector('script[src="js/modules/experience.js"]').__module.exports.setupExperience();
}

function setupEducation() {
  return document.querySelector('script[src="js/modules/education.js"]').__module.exports.setupEducation();
}

function setupSkills() {
  return document.querySelector('script[src="js/modules/skills.js"]').__module.exports.setupSkills();
}

function setupProjects() {
  return document.querySelector('script[src="js/modules/projects.js"]').__module.exports.setupProjects();
}

function setupLanguages() {
  return document.querySelector('script[src="js/modules/languages.js"]').__module.exports.setupLanguages();
} 