// Cover Letter Module
export class CoverLetterManager {
  constructor() {
    this.coverLetterData = {
      template: 'professional',
      jobTitle: '',
      companyName: '',
      hiringManager: '',
      opening: '',
      body: '',
      closing: '',
      includeResume: false,
      followUp: false
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateLivePreview();
  }

  setupEventListeners() {
    // Cover letter form inputs
    const coverLetterInputs = [
      'coverLetterTemplate',
      'coverJobTitle', 
      'companyName',
      'hiringManager',
      'coverLetterOpening',
      'coverLetterBody',
      'coverLetterClosing',
      'includeResume',
      'followUp'
    ];

    coverLetterInputs.forEach(inputId => {
      const element = document.getElementById(inputId);
      if (element) {
        element.addEventListener('input', () => this.updateCoverLetterData());
        element.addEventListener('change', () => this.updateCoverLetterData());
      }
    });

    // Preview and export buttons
    const previewBtn = document.getElementById('previewCoverLetter');
    const exportBtn = document.getElementById('exportCoverLetter');
    const closeModalBtn = document.getElementById('closeCoverLetterModal');

    if (previewBtn) {
      previewBtn.addEventListener('click', () => this.showCoverLetterPreview());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCoverLetter());
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.hideCoverLetterPreview());
    }

    // Close modal on backdrop click
    const modal = document.getElementById('coverLetterModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideCoverLetterPreview();
        }
      });
    }
  }

  updateCoverLetterData() {
    this.coverLetterData = {
      template: document.getElementById('coverLetterTemplate')?.value || 'professional',
      jobTitle: document.getElementById('coverJobTitle')?.value || '',
      companyName: document.getElementById('companyName')?.value || '',
      hiringManager: document.getElementById('hiringManager')?.value || '',
      opening: document.getElementById('coverLetterOpening')?.value || '',
      body: document.getElementById('coverLetterBody')?.value || '',
      closing: document.getElementById('coverLetterClosing')?.value || '',
      includeResume: document.getElementById('includeResume')?.checked || false,
      followUp: document.getElementById('followUp')?.checked || false
    };

    this.updateLivePreview();
  }

  updateLivePreview() {
    const coverLetterPreview = document.getElementById('cover-letter-preview');
    if (!coverLetterPreview) return;

    // Show cover letter preview if any content exists
    const hasContent = this.coverLetterData.jobTitle || 
                      this.coverLetterData.companyName || 
                      this.coverLetterData.opening || 
                      this.coverLetterData.body || 
                      this.coverLetterData.closing;

    if (hasContent) {
      coverLetterPreview.style.display = 'block';
      this.renderCoverLetterPreview();
    } else {
      coverLetterPreview.style.display = 'none';
    }
  }

  renderCoverLetterPreview() {
    const personalInfo = this.getPersonalInfo();
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Update preview elements
    const elements = {
      'preview-cover-date': currentDate,
      'preview-cover-company': this.coverLetterData.companyName || 'Company Name',
      'preview-cover-address': 'Company Address', // You can add address field later
      'preview-cover-greeting': this.getGreeting(),
      'preview-cover-opening': this.coverLetterData.opening || 'Your opening paragraph will appear here.',
      'preview-cover-body': this.coverLetterData.body || 'Your body paragraphs will appear here.',
      'preview-cover-closing': this.coverLetterData.closing || 'Your closing paragraph will appear here.',
      'preview-cover-signature': personalInfo.fullName || 'Your Name'
    };

    Object.entries(elements).forEach(([id, content]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = content;
      }
    });
  }

  getPersonalInfo() {
    return {
      fullName: document.getElementById('fullName')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      location: document.getElementById('location')?.value || ''
    };
  }

  getGreeting() {
    if (this.coverLetterData.hiringManager) {
      return `Dear ${this.coverLetterData.hiringManager},`;
    } else if (this.coverLetterData.companyName) {
      return `Dear ${this.coverLetterData.companyName} Hiring Team,`;
    } else {
      return 'Dear Hiring Manager,';
    }
  }

  showCoverLetterPreview() {
    const modal = document.getElementById('coverLetterModal');
    const content = document.getElementById('coverLetterPreviewContent');
    
    if (modal && content) {
      this.updateCoverLetterData();
      content.innerHTML = this.generateCoverLetterHTML();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  hideCoverLetterPreview() {
    const modal = document.getElementById('coverLetterModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  generateCoverLetterHTML() {
    const personalInfo = this.getPersonalInfo();
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const template = this.getCoverLetterTemplate();
    
    return `
      <div class="cover-letter ${template}">
        <div class="cover-letter-header mb-6">
          <div class="text-right text-sm text-gray-600 mb-4">
            <p>${currentDate}</p>
          </div>
          <div class="mb-4">
            <p class="font-semibold text-gray-800">${this.coverLetterData.companyName || 'Company Name'}</p>
            <p class="text-sm text-gray-600">Company Address</p>
          </div>
          <div class="mb-4">
            <p class="text-gray-800">${this.getGreeting()}</p>
          </div>
        </div>
        
        <div class="cover-letter-body space-y-4 text-gray-700 leading-relaxed">
          <p>${this.coverLetterData.opening || 'Your opening paragraph will appear here.'}</p>
          <p>${this.coverLetterData.body || 'Your body paragraphs will appear here.'}</p>
          <p>${this.coverLetterData.closing || 'Your closing paragraph will appear here.'}</p>
        </div>
        
        <div class="cover-letter-footer mt-8">
          <p class="text-gray-800">Sincerely,</p>
          <p class="mt-4 text-gray-800">${personalInfo.fullName || 'Your Name'}</p>
          ${personalInfo.email ? `<p class="text-sm text-gray-600 mt-2">${personalInfo.email}</p>` : ''}
          ${personalInfo.phone ? `<p class="text-sm text-gray-600">${personalInfo.phone}</p>` : ''}
        </div>
      </div>
    `;
  }

  getCoverLetterTemplate() {
    const templates = {
      professional: 'font-serif text-sm leading-relaxed',
      creative: 'font-sans text-sm leading-relaxed text-blue-800',
      modern: 'font-sans text-sm leading-relaxed text-gray-800',
      minimalist: 'font-sans text-xs leading-relaxed text-gray-700'
    };
    
    return templates[this.coverLetterData.template] || templates.professional;
  }

  async exportCoverLetter() {
    try {
      this.updateCoverLetterData();
      
      const coverLetterHTML = this.generateCoverLetterHTML();
      const personalInfo = this.getPersonalInfo();
      
      // Create a temporary element for html2pdf
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div class="cover-letter-export" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; color: #333;">
          ${coverLetterHTML}
        </div>
      `;
      
      // Use html2pdf to generate PDF
      const opt = {
        margin: 1,
        filename: `Cover_Letter_${personalInfo.fullName || 'Resume'}_${this.coverLetterData.companyName || 'Application'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(tempDiv).save();
      
    } catch (error) {
      console.error('Error exporting cover letter:', error);
      alert('Error exporting cover letter. Please try again.');
    }
  }

  // Method to get cover letter data for other modules
  getCoverLetterData() {
    this.updateCoverLetterData();
    return this.coverLetterData;
  }
}
