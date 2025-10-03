export function setupSummary() {
  const summaryInput = document.getElementById('summary');
  
  summaryInput.addEventListener('input', () => {
    document.getElementById('preview-summary').textContent = 
      summaryInput.value || 'Your professional summary will appear here.';
  });
} 