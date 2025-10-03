const express = require('express');
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

const app = express();
const port = process.env.PORT || 8899;


// Serve static files
app.use(express.static('public'));
app.use('/templates', express.static('.'));

// Parse JSON bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Get available PDF templates
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 'altacv',
      name: 'AltaCV Template',
      description: 'Modern CV template based on Marissa Mayer\'s CV style',
      filename: 'altacv-template.pdf',
      preview: '/templates/altacv-template.pdf'
    },
    {
      id: 'autocv',
      name: 'AutoCV Template',
      description: 'Simple, clean CV template with publication support',
      filename: 'autocv.pdf',
      preview: '/templates/autocv.pdf'
    }
  ];
  res.json(templates);
});


// Add this route to handle DOCX export
app.post('/export-docx', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { html, filename } = req.body;
    
    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Resume",
              heading: HeadingLevel.TITLE
            }),
            new Paragraph({
              text: "This is a basic conversion of your resume to DOCX format. For better formatting, please use the PDF export option."
            })
            // In a real implementation, you would parse the HTML and convert it to docx elements
          ]
        }
      ]
    });
    
    // Generate the document
    const buffer = await Packer.toBuffer(doc);
    
    // Set response headers
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // Send the document
    res.send(buffer);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    res.status(500).json({ error: 'Failed to generate DOCX file' });
  }
});

// Export using PDF template
app.post('/export-template-pdf', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { templateId, resumeData, filename } = req.body;
    
    // Generate LaTeX content based on template and resume data
    const latexContent = generateLaTeXFromTemplate(templateId, resumeData);
    
    // For now, we'll return the LaTeX content as a downloadable file
    // In a full implementation, you would compile this to PDF using pdflatex
    res.setHeader('Content-Disposition', `attachment; filename=${filename || 'resume.tex'}`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(latexContent);
  } catch (error) {
    console.error('Error generating template PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF from template' });
  }
});

// Generate LaTeX content based on template
function generateLaTeXFromTemplate(templateId, resumeData) {
  const { personalInfo, summary, experience, education, skills, projects, languages, references } = resumeData;
  
  if (templateId === 'altacv') {
    return generateAltaCVLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references);
  } else if (templateId === 'autocv') {
    return generateAutoCVLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references);
  }
  
  return generateDefaultLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references);
}

function generateAltaCVLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references) {
  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage[empty]{fullpage}
\\usepackage{enumitem}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{times}
\\usepackage{helvet}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=blue,
    urlcolor=blue,
    citecolor=blue
}

\\setlength{\\parindent}{0in}
\\setlength{\\parskip}{0in}
\\setlength{\\itemsep}{0in}
\\setlength{\\topmargin}{-0.5in}
\\setlength{\\topskip}{0in}
\\setlength{\\topsep}{0in}

% ATS-friendly formatting
\\newcommand{\\cvsection}[1]{\\section*{#1}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeSubheading}[4]{
  \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{#3} & \\textit{#4}
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\newcommand{\\resumeItem}[1]{\\item #1}

\\begin{document}

%----------HEADING-----------------
\\begin{center}
    {\\LARGE \\textbf{${personalInfo.fullName || 'Your Name'}}} \\\\ \\vspace{2pt}
    \\small ${personalInfo.phone || 'Phone'} $|$ \\href{mailto:${personalInfo.email || 'email@example.com'}}{${personalInfo.email || 'email@example.com'}} $|$ ${personalInfo.location || 'Location'}
    ${personalInfo.linkedin ? `\\\\ \\href{${personalInfo.linkedin}}{LinkedIn: ${personalInfo.linkedin}}` : ''}
    ${personalInfo.portfolio ? `\\\\ \\href{${personalInfo.portfolio}}{Portfolio: ${personalInfo.portfolio}}` : ''}
    ${personalInfo.github ? `\\\\ \\href{${personalInfo.github}}{GitHub: ${personalInfo.github}}` : ''}
\\end{center}

%-----------SUMMARY-----------------
\\cvsection{Summary}
\\begin{itemize}
    \\item ${summary || 'Professional summary goes here'}
\\end{itemize}

%-----------EXPERIENCE-----------------
\\cvsection{Experience}
\\resumeSubHeadingListStart
${experience.map(exp => `
\\resumeSubheading
    {${exp.company || 'Company'}}{${exp.startDate || 'Start Date'} -- ${exp.current ? 'Present' : (exp.endDate || 'End Date')}}
    {${exp.position || 'Position'}}{${exp.location || 'Location'}}
    \\resumeItemListStart
        \\resumeItem{${exp.description || 'Job description goes here'}}
        ${exp.reasonLeaving ? `\\\\ \\resumeItem{\\textit{Reason for leaving:} ${exp.reasonLeaving}}` : ''}
    \\resumeItemListEnd
`).join('')}
\\resumeSubHeadingListEnd

%-----------EDUCATION-----------------
\\cvsection{Education}
\\resumeSubHeadingListStart
${education.map(edu => `
\\resumeSubheading
    {${edu.institution || 'Institution'}}{${edu.startDate || 'Start Date'} -- ${edu.current ? 'Present' : (edu.endDate || 'End Date')}}
    {${edu.degree || 'Degree'}}{${edu.location || 'Location'}}
`).join('')}
\\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\cvsection{Projects}
\\resumeSubHeadingListStart
${projects.map(proj => `
\\resumeSubheading
    {${proj.name || 'Project Name'}}{}
    {${proj.technologies || 'Technologies'}}{}
    \\resumeItemListStart
        \\resumeItem{${proj.description || 'Project description goes here'}}
    \\resumeItemListEnd
`).join('')}
\\resumeSubHeadingListEnd

%-----------SKILLS-----------------
\\cvsection{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
        ${skills.map(skill => `\\textbf{${skill}}`).join(' $\\cdot$ ')}
    }}
\\end{itemize}

%-----------LANGUAGES-----------------
\\cvsection{Languages}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
        ${languages.map(lang => `\\textbf{${lang.name}}: ${lang.level}`).join(' $\\cdot$ ')}
    }}
\\end{itemize}

%-----------REFERENCES-----------------
\\cvsection{References}
\\begin{itemize}[leftmargin=0.15in, label={}]
    ${references.map(ref => `
    \\small{\\item{
        \\textbf{${ref.name || 'Reference Name'}} \\\\
        ${ref.title ? `${ref.title}` : ''} ${ref.company ? `at ${ref.company}` : ''} \\\\
        ${ref.email ? `Email: ${ref.email}` : ''} ${ref.phone ? `Phone: ${ref.phone}` : ''} \\\\
        ${ref.relationship ? `Relationship: ${ref.relationship}` : ''}
    }}
    `).join('')}
\\end{itemize}

\\end{document}`;
}

function generateAutoCVLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references) {
  return `\\documentclass[11pt,a4paper,sans]{moderncv}

\\moderncvstyle{classic}
\\moderncvcolor{blue}

\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.75]{geometry}

\\name{${personalInfo.fullName || 'Your'}}{${personalInfo.fullName || 'Name'}}
\\title{${personalInfo.jobTitle || 'Job Title'}}
\\address{${personalInfo.location || 'Your Location'}}
\\phone[mobile]{${personalInfo.phone || 'Your Phone'}}
\\email{${personalInfo.email || 'your.email@example.com'}}
${personalInfo.linkedin ? `\\social[linkedin]{${personalInfo.linkedin}}` : ''}
${personalInfo.github ? `\\social[github]{${personalInfo.github}}` : ''}
${personalInfo.portfolio ? `\\social[web]{${personalInfo.portfolio}}` : ''}

\\begin{document}

\\makecvtitle

\\section{Summary}
${summary || 'Your professional summary goes here.'}

\\section{Experience}
\\cventry{${experience[0]?.startDate || 'Start Date'} -- ${experience[0]?.current ? 'Present' : (experience[0]?.endDate || 'End Date')}}{${experience[0]?.position || 'Position'}}{${experience[0]?.company || 'Company'}}{${experience[0]?.location || 'Location'}}{}{${experience[0]?.description || 'Job description goes here.'}}

\\section{Education}
\\cventry{${education[0]?.startDate || 'Start Date'} -- ${education[0]?.current ? 'Present' : (education[0]?.endDate || 'End Date')}}{${education[0]?.degree || 'Degree'}}{${education[0]?.institution || 'Institution'}}{${education[0]?.location || 'Location'}}{}{${education[0]?.description || 'Education description goes here.'}}

\\section{Skills}
\\cvitem{Technical Skills}{${skills.join(', ') || 'Your skills go here'}}

\\section{Projects}
\\cventry{${projects[0]?.startDate || 'Date'}}{${projects[0]?.name || 'Project Name'}}{}{}{}{${projects[0]?.description || 'Project description goes here.'}}

\\section{Languages}
\\cvitem{Languages}{${languages.map(lang => `${lang.name} (${lang.level})`).join(', ') || 'Your languages go here'}}

\\section{References}
${references.map(ref => `
\\cvitem{${ref.name || 'Reference Name'}}{${ref.title || ''} ${ref.company ? `at ${ref.company}` : ''} \\\\ ${ref.email ? `Email: ${ref.email}` : ''} ${ref.phone ? `Phone: ${ref.phone}` : ''} \\\\ ${ref.relationship ? `Relationship: ${ref.relationship}` : ''}}
`).join('')}

\\end{document}`;
}

function generateDefaultLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references) {
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\title{${personalInfo.fullName || 'Your Name'} - Resume}
\\author{${personalInfo.email || 'your.email@example.com'}}
\\date{}

\\begin{document}

\\maketitle

\\section*{Contact Information}
\\begin{itemize}
    \\item Email: ${personalInfo.email || 'your.email@example.com'}
    \\item Phone: ${personalInfo.phone || 'Your Phone'}
    \\item Location: ${personalInfo.location || 'Your Location'}
    ${personalInfo.linkedin ? `\\item LinkedIn: \\href{${personalInfo.linkedin}}{${personalInfo.linkedin}}` : ''}
    ${personalInfo.portfolio ? `\\item Portfolio: \\href{${personalInfo.portfolio}}{${personalInfo.portfolio}}` : ''}
    ${personalInfo.github ? `\\item GitHub: \\href{${personalInfo.github}}{${personalInfo.github}}` : ''}
\\end{itemize}

\\section*{Summary}
${summary || 'Your professional summary goes here.'}

\\section*{Experience}
${experience.map(exp => `
\\textbf{${exp.position || 'Position'}} at ${exp.company || 'Company'} \\hfill ${exp.startDate || 'Start Date'} - ${exp.current ? 'Present' : (exp.endDate || 'End Date')}
\\begin{itemize}
    \\item ${exp.description || 'Job description goes here.'}
    ${exp.reasonLeaving ? `\\item \\textit{Reason for leaving:} ${exp.reasonLeaving}` : ''}
\\end{itemize}
`).join('')}

\\section*{Education}
${education.map(edu => `
\\textbf{${edu.degree || 'Degree'}} from ${edu.institution || 'Institution'} \\hfill ${edu.startDate || 'Start Date'} - ${edu.current ? 'Present' : (edu.endDate || 'End Date')}
`).join('')}

\\section*{Skills}
${skills.join(', ') || 'Your skills go here'}

\\section*{Projects}
${projects.map(proj => `
\\textbf{${proj.name || 'Project Name'}}
\\begin{itemize}
    \\item ${proj.description || 'Project description goes here.'}
    \\item Technologies: ${proj.technologies || 'Technologies used'}
\\end{itemize}
`).join('')}

\\section*{Languages}
${languages.map(lang => `${lang.name} (${lang.level})`).join(', ') || 'Your languages go here'}

\\section*{References}
${references.map(ref => `
\\textbf{${ref.name || 'Reference Name'}} \\\\
${ref.title ? `${ref.title}` : ''} ${ref.company ? `at ${ref.company}` : ''} \\\\
${ref.email ? `Email: ${ref.email}` : ''} ${ref.phone ? `Phone: ${ref.phone}` : ''} \\\\
${ref.relationship ? `Relationship: ${ref.relationship}` : ''}
`).join('')}

\\end{document}`;
}

// Start the server (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Resume builder running at http://0.0.0.0:${port}`);
  });
}

// Export for Vercel
module.exports = app; 