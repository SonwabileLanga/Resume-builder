export function setupExport() {
  const exportPDFBtn = document.getElementById('exportPDF');
  const exportDOCXBtn = document.getElementById('exportDOCX');
  const resumePreview = document.getElementById('resume-preview');
  
  // Export as PDF
  exportPDFBtn.addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value || 'Resume';
    const filename = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    
    // Configure html2pdf options
    const options = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF
    html2pdf().set(options).from(resumePreview).save();
  });
  
  // Export as DOCX
  exportDOCXBtn.addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value || 'Resume';
    const filename = `${fullName.replace(/\s+/g, '_')}_Resume.docx`;
    
    // Get HTML content
    const htmlContent = resumePreview.innerHTML;
    
    // Convert to DOCX using server-side conversion
    fetch('/export-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html: htmlContent,
        filename: filename
      })
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error('Network response was not ok');
    })
    .then(blob => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error exporting to DOCX:', error);
      alert('Failed to export as DOCX. Please try exporting as PDF instead.');
    });
  });
} 