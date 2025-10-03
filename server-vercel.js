const express = require('express');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

const app = express();
const port = process.env.PORT || 8899;

// Serve static files
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Resume Builder API is working',
    timestamp: new Date().toISOString()
  });
});

// Get available PDF templates
app.get('/api/templates', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

// Simplified DOCX export
app.post('/export-docx', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { resumeData, filename } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    
    // Create a simple document with resume data
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalInfo?.fullName || "Resume",
                bold: true,
                size: 32,
              }),
            ],
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalInfo?.jobTitle || "",
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${resumeData.personalInfo?.email || ''}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Phone: ${resumeData.personalInfo?.phone || ''}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Location: ${resumeData.personalInfo?.location || ''}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Summary",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.summary || "",
                size: 20,
              }),
            ],
          }),
        ],
      }],
    });

    // Generate the DOCX file
    const buffer = await Packer.toBuffer(doc);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'resume.docx'}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    res.status(500).json({ error: 'Failed to generate DOCX file: ' + error.message });
  }
});

// Simplified LaTeX export
app.post('/export-template-pdf', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { templateId, resumeData, filename } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    
    // Generate LaTeX content
    const latexContent = generateLaTeXFromTemplate(templateId, resumeData);
    
    // Return LaTeX content as text file
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'resume.tex'}"`);
    res.send(latexContent);
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    res.status(500).json({ error: 'Failed to generate LaTeX file: ' + error.message });
  }
});

// Generate LaTeX from template
function generateLaTeXFromTemplate(templateId, resumeData) {
  const { personalInfo, summary, experience, education, skills, projects, languages, references } = resumeData;
  
  if (templateId === 'altacv') {
    return generateAltaCVLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references);
  } else if (templateId === 'autocv') {
    return generateAutoCVLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references);
  } else {
    return generateDefaultLaTeX(personalInfo, summary, experience, education, skills, projects, languages, references);
  }
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
${skills.map(skill => `\\textbf{${skill}}`).join(' $\\cdot$ ')}

\\section*{Projects}
${projects.map(proj => `
\\textbf{${proj.name || 'Project Name'}} - ${proj.technologies || 'Technologies'}
\\begin{itemize}
    \\item ${proj.description || 'Project description goes here.'}
\\end{itemize}
`).join('')}

\\section*{Languages}
${languages.map(lang => `\\textbf{${lang.name}}: ${lang.level}`).join(' $\\cdot$ ')}

\\section*{References}
${references.map(ref => `
\\textbf{${ref.name || 'Reference Name'}} \\\\
${ref.title ? `${ref.title}` : ''} ${ref.company ? `at ${ref.company}` : ''} \\\\
${ref.email ? `Email: ${ref.email}` : ''} ${ref.phone ? `Phone: ${ref.phone}` : ''} \\\\
${ref.relationship ? `Relationship: ${ref.relationship}` : ''}
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
${skills.map(skill => `\\textbf{${skill}}`).join(' $\\cdot$ ')}

\\section*{Projects}
${projects.map(proj => `
\\textbf{${proj.name || 'Project Name'}} - ${proj.technologies || 'Technologies'}
\\begin{itemize}
    \\item ${proj.description || 'Project description goes here.'}
\\end{itemize}
`).join('')}

\\section*{Languages}
${languages.map(lang => `\\textbf{${lang.name}}: ${lang.level}`).join(' $\\cdot$ ')}

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
