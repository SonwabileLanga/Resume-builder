import { setupNavigation } from './modules/navigation.js';
import { setupPersonalInfo } from './modules/personalInfo.js';
import { setupExperience } from './modules/experience.js';
import { setupEducation } from './modules/education.js';
import { setupSkills } from './modules/skills.js';
import { setupProjects } from './modules/projects.js';
import { setupLanguages } from './modules/languages.js';
import { setupReferences } from './modules/references.js';
import { setupSummary } from './modules/summary.js';
import { setupExport } from './modules/export.js';
import { loadSampleData } from './modules/sampleData.js';
import { CoverLetterManager } from './modules/coverLetter.js';

// Template functionality
let availableTemplates = [];
let selectedTemplate = null;

async function loadTemplates() {
  try {
    console.log('Loading templates...');
    const response = await fetch('/api/templates');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    availableTemplates = await response.json();
    console.log('Loaded templates:', availableTemplates);
    
    const templateSelect = document.getElementById('templateSelect');
    if (!templateSelect) {
      console.error('Template select element not found');
      return;
    }
    
    templateSelect.innerHTML = '<option value="">Select a template...</option>';
    
    availableTemplates.forEach(template => {
      const option = document.createElement('option');
      option.value = template.id;
      option.textContent = template.name;
      templateSelect.appendChild(option);
    });
    
    console.log('Templates loaded successfully');
  } catch (error) {
    console.error('Error loading templates:', error);
  }
}

function setupTemplateSelector() {
  const templateSelect = document.getElementById('templateSelect');
  const previewBtn = document.getElementById('previewTemplate');
  const exportTemplateBtn = document.getElementById('exportTemplatePDF');
  const modal = document.getElementById('templateModal');
  const closeBtn = document.querySelector('.close');
  const templateFrame = document.getElementById('templateFrame');

  templateSelect.addEventListener('change', (e) => {
    selectedTemplate = e.target.value;
  });

  previewBtn.addEventListener('click', () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    
    // Generate live preview with user data
    generateLivePreview();
  });

  exportTemplateBtn.addEventListener('click', async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }

    try {
      const resumeData = getResumeData();
      const response = await fetch('/export-template-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          resumeData: resumeData,
          filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.fullName || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting template PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

async function generateLivePreview() {
  try {
    const resumeData = getResumeData();
    const response = await fetch('/export-template-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: selectedTemplate,
        resumeData: resumeData,
        filename: 'preview.tex'
      })
    });

    if (response.ok) {
      const latexContent = await response.text();
      
      // Create a preview of the LaTeX content
      const previewContent = generateHTMLPreview(latexContent, resumeData);
      
      // Show in modal
      const modal = document.getElementById('templateModal');
      const templateFrame = document.getElementById('templateFrame');
      
      // Create a data URL with the preview content
      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      templateFrame.src = url;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else {
      throw new Error('Preview generation failed');
    }
  } catch (error) {
    console.error('Error generating preview:', error);
    alert('Error generating preview. Please try again.');
  }
}

function generateHTMLPreview(latexContent, resumeData) {
  const { personalInfo, summary, experience, education, skills, projects, languages, references } = resumeData;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resume Preview - ${selectedTemplate}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .contact { font-size: 14px; color: #666; }
        .section { margin: 25px 0; }
        .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
        .experience-item, .education-item, .project-item { margin-bottom: 20px; }
        .job-title { font-weight: bold; font-size: 16px; }
        .company { font-style: italic; color: #666; }
        .date { float: right; color: #666; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
        .languages { display: flex; flex-wrap: wrap; gap: 10px; }
        .language-item { font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.fullName || 'Your Name'}</div>
        <div class="contact">
            ${personalInfo.email || 'email@example.com'} | 
            ${personalInfo.phone || 'Your Phone'} | 
            ${personalInfo.location || 'Your Location'}
            ${personalInfo.linkedin || personalInfo.portfolio || personalInfo.github ? `
            <br>
            ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}
            ${personalInfo.portfolio ? `<a href="${personalInfo.portfolio}" target="_blank">Portfolio</a>` : ''}
            ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank">GitHub</a>` : ''}
            ` : ''}
        </div>
    </div>

    ${summary ? `
    <div class="section">
        <div class="section-title">Summary</div>
        <p>${summary}</p>
    </div>
    ` : ''}

    ${experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map(exp => `
        <div class="experience-item">
            <div class="job-title">${exp.position || 'Position'}</div>
            <div class="company">${exp.company || 'Company'}</div>
            <div class="date">${exp.startDate || 'Start Date'} - ${exp.current ? 'Present' : (exp.endDate || 'End Date')}</div>
            <p>${exp.description || 'Job description goes here.'}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
        <div class="education-item">
            <div class="job-title">${edu.degree || 'Degree'}</div>
            <div class="company">${edu.institution || 'Institution'}</div>
            <div class="date">${edu.startDate || 'Start Date'} - ${edu.current ? 'Present' : (edu.endDate || 'End Date')}</div>
            ${edu.description ? `<p>${edu.description}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map(proj => `
        <div class="project-item">
            <div class="job-title">${proj.name || 'Project Name'}</div>
            ${proj.technologies ? `<div class="company">Technologies: ${proj.technologies}</div>` : ''}
            <p>${proj.description || 'Project description goes here.'}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${languages.length > 0 ? `
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="languages">
            ${languages.map(lang => `<span class="language-item">${lang.name} (${lang.level})</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${references.length > 0 ? `
    <div class="section">
        <div class="section-title">References</div>
        ${references.map(ref => `
        <div class="reference-item">
            <div class="job-title">${ref.name || 'Reference Name'}</div>
            ${ref.title ? `<div class="company">${ref.title}</div>` : ''}
            ${ref.company ? `<div class="company">${ref.company}</div>` : ''}
            <div class="contact">
                ${ref.email ? `<span>Email: ${ref.email}</span>` : ''}
                ${ref.phone ? `<span>Phone: ${ref.phone}</span>` : ''}
            </div>
            ${ref.relationship ? `<div class="company">${ref.relationship}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div style="margin-top: 40px; padding: 20px; background: #f9f9f9; border-radius: 5px;">
        <h3>Template: ${selectedTemplate}</h3>
        <p>This is a preview of how your resume will look in the selected template. The actual PDF will have the exact formatting of the ${selectedTemplate} template.</p>
        <p><strong>Note:</strong> This preview shows the content structure. The final PDF will have the professional styling of the ${selectedTemplate} template.</p>
    </div>
</body>
</html>`;
}

function getResumeData() {
  return {
    personalInfo: {
      fullName: document.getElementById('fullName').value,
      jobTitle: document.getElementById('jobTitle').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      location: document.getElementById('location').value,
      linkedin: document.getElementById('linkedin').value,
      portfolio: document.getElementById('portfolio').value,
      github: document.getElementById('github').value
    },
    summary: document.getElementById('summary').value,
    experience: Array.from(document.querySelectorAll('#experience-items .item-container')).map(item => ({
      company: item.querySelector('.company-input').value,
      position: item.querySelector('.position-input').value,
      startDate: item.querySelector('.start-date-input').value,
      endDate: item.querySelector('.end-date-input').value,
      current: item.querySelector('.current-job-input').checked,
      description: item.querySelector('.description-input').value,
      reasonLeaving: item.querySelector('.reason-leaving-input').value
    })),
    education: Array.from(document.querySelectorAll('#education-items .item-container')).map(item => ({
      institution: item.querySelector('.institution-input').value,
      degree: item.querySelector('.degree-input').value,
      startDate: item.querySelector('.edu-start-date-input').value,
      endDate: item.querySelector('.edu-end-date-input').value,
      current: item.querySelector('.current-edu-input').checked,
      description: item.querySelector('.edu-description-input').value
    })),
    skills: Array.from(document.querySelectorAll('#skills-list .skill-tag')).map(tag => tag.textContent),
    projects: Array.from(document.querySelectorAll('#project-items .item-container')).map(item => ({
      name: item.querySelector('.project-name-input').value,
      description: item.querySelector('.project-description-input').value,
      technologies: item.querySelector('.project-tech-input').value,
      link: item.querySelector('.project-link-input').value
    })),
    languages: Array.from(document.querySelectorAll('#language-items .item-container')).map(item => ({
      name: item.querySelector('.language-name-input').value,
      level: item.querySelector('.language-level-input').value
    })),
    references: Array.from(document.querySelectorAll('#reference-items .item-container')).map(item => ({
      name: item.querySelector('.reference-name-input').value,
      title: item.querySelector('.reference-title-input').value,
      company: item.querySelector('.reference-company-input').value,
      email: item.querySelector('.reference-email-input').value,
      phone: item.querySelector('.reference-phone-input').value,
      relationship: item.querySelector('.reference-relationship-input').value
    }))
  };
}

// Live preview functionality
function updateLivePreview() {
  const data = getResumeData();
  
  // Update personal info
  document.getElementById('preview-name').textContent = data.personalInfo.fullName || 'Your Name';
  document.getElementById('preview-title').textContent = data.personalInfo.jobTitle || 'Your Job Title';
  document.getElementById('preview-email').innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
    ${data.personalInfo.email || 'email@example.com'}
  `;
  document.getElementById('preview-phone').innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
    </svg>
    ${data.personalInfo.phone || 'Phone Number'}
  `;
  document.getElementById('preview-location').innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
    ${data.personalInfo.location || 'Location'}
  `;
  
  // Update social links
  const linksContainer = document.getElementById('preview-links');
  const links = [];
  if (data.personalInfo.linkedin) {
    links.push(`<a href="${data.personalInfo.linkedin}" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-800">LinkedIn</a>`);
  }
  if (data.personalInfo.portfolio) {
    links.push(`<a href="${data.personalInfo.portfolio}" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-800">Portfolio</a>`);
  }
  if (data.personalInfo.github) {
    links.push(`<a href="${data.personalInfo.github}" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-800">GitHub</a>`);
  }
  linksContainer.innerHTML = links.length > 0 ? links.join(' | ') : '';
  
  // Update summary
  document.getElementById('preview-summary').textContent = data.summary || 'Your professional summary will appear here.';
  
  // Update experience
  const experienceContainer = document.getElementById('preview-experience');
  if (data.experience.length > 0) {
    experienceContainer.innerHTML = data.experience.map(exp => `
      <div class="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-bold text-lg text-gray-800">${exp.position || 'Position'}</h3>
        <p class="text-primary-600 font-medium">${exp.company || 'Company'} • ${exp.startDate || 'Start Date'} - ${exp.current ? 'Present' : (exp.endDate || 'End Date')}</p>
        <p class="text-gray-700 mt-2">${exp.description || 'Job description goes here'}</p>
        ${exp.reasonLeaving ? `<p class="text-gray-600 mt-2 text-sm italic"><strong>Reason for leaving:</strong> ${exp.reasonLeaving}</p>` : ''}
      </div>
    `).join('');
  } else {
    experienceContainer.innerHTML = '<p class="text-gray-500 italic">Add work experience to see it here.</p>';
  }
  
  // Update education
  const educationContainer = document.getElementById('preview-education');
  if (data.education.length > 0) {
    educationContainer.innerHTML = data.education.map(edu => `
      <div class="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-bold text-lg text-gray-800">${edu.degree || 'Degree'}</h3>
        <p class="text-primary-600 font-medium">${edu.institution || 'Institution'} • ${edu.startDate || 'Start Date'} - ${edu.current ? 'Present' : (edu.endDate || 'End Date')}</p>
        ${edu.description ? `<p class="text-gray-700 mt-2">${edu.description}</p>` : ''}
      </div>
    `).join('');
  } else {
    educationContainer.innerHTML = '<p class="text-gray-500 italic">Add education to see it here.</p>';
  }
  
  // Update skills
  const skillsContainer = document.getElementById('preview-skills');
  if (data.skills.length > 0) {
    skillsContainer.innerHTML = data.skills.map(skill => `
      <span class="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">${skill}</span>
    `).join('');
  } else {
    skillsContainer.innerHTML = '<p class="text-gray-500 italic">Add skills to see them here.</p>';
  }
  
  // Update projects
  const projectsContainer = document.getElementById('preview-projects');
  if (data.projects.length > 0) {
    projectsContainer.innerHTML = data.projects.map(proj => `
      <div class="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-bold text-lg text-gray-800">${proj.name || 'Project Name'}</h3>
        <p class="text-primary-600 font-medium">${proj.technologies || 'Technologies'}</p>
        <p class="text-gray-700 mt-2">${proj.description || 'Project description goes here'}</p>
        ${proj.link ? `<a href="${proj.link}" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-800 text-sm">View Project →</a>` : ''}
      </div>
    `).join('');
  } else {
    projectsContainer.innerHTML = '<p class="text-gray-500 italic">Add projects to see them here.</p>';
  }
  
  // Update languages
  const languagesContainer = document.getElementById('preview-languages');
  if (data.languages.length > 0) {
    languagesContainer.innerHTML = data.languages.map(lang => `
      <div class="inline-block bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
        ${lang.name || 'Language'}: ${lang.level || 'Level'}
      </div>
    `).join('');
  } else {
    languagesContainer.innerHTML = '<p class="text-gray-500 italic">Add languages to see them here.</p>';
  }
  
  // Update references
  const referencesContainer = document.getElementById('preview-references');
  if (data.references.length > 0) {
    referencesContainer.innerHTML = data.references.map(ref => `
      <div class="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-bold text-lg text-gray-800">${ref.name || 'Reference Name'}</h3>
        ${ref.title ? `<p class="text-primary-600 font-medium">${ref.title}${ref.company ? ` at ${ref.company}` : ''}</p>` : ''}
        <div class="text-gray-700 mt-2">
          ${ref.email ? `<p>Email: ${ref.email}</p>` : ''}
          ${ref.phone ? `<p>Phone: ${ref.phone}</p>` : ''}
          ${ref.relationship ? `<p class="text-sm text-gray-600 italic">${ref.relationship}</p>` : ''}
        </div>
      </div>
    `).join('');
  } else {
    referencesContainer.innerHTML = '<p class="text-gray-500 italic">Add references to see them here.</p>';
  }
}

// Setup live preview updates
function setupLivePreview() {
  // Update preview when form data changes
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('input', updateLivePreview);
    input.addEventListener('change', updateLivePreview);
  });
  
  // Initial update
  updateLivePreview();
}

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupPersonalInfo();
  setupSummary();
  setupExperience();
  setupEducation();
  setupSkills();
  setupProjects();
  setupLanguages();
  setupReferences();
  setupExport();
  setupTemplateSelector();
  loadTemplates();
  setupLivePreview();
  
  // Initialize cover letter manager
  window.coverLetterManager = new CoverLetterManager();
  
  // Uncomment to load sample data for testing
  // loadSampleData();
}); 