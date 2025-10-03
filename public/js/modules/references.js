export function setupReferences() {
  const addReferenceBtn = document.getElementById('add-reference');
  const referenceItems = document.getElementById('reference-items');
  const referenceTemplate = document.getElementById('reference-template');

  addReferenceBtn.addEventListener('click', () => {
    const referenceElement = referenceTemplate.content.cloneNode(true);
    referenceItems.appendChild(referenceElement);
    updateReferencesPreview();
  });

  // Handle remove buttons
  referenceItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove')) {
      e.target.closest('.item-container').remove();
      updateReferencesPreview();
    }
  });

  // Handle input changes
  referenceItems.addEventListener('input', (e) => {
    if (e.target.classList.contains('reference-name-input') ||
        e.target.classList.contains('reference-title-input') ||
        e.target.classList.contains('reference-company-input') ||
        e.target.classList.contains('reference-email-input') ||
        e.target.classList.contains('reference-phone-input') ||
        e.target.classList.contains('reference-relationship-input')) {
      updateReferencesPreview();
    }
  });
}

function updateReferencesPreview() {
  const referenceItems = document.querySelectorAll('#reference-items .item-container');
  const previewReferences = document.getElementById('preview-references');
  
  if (referenceItems.length === 0) {
    previewReferences.innerHTML = '<p class="empty-notice">Add references to see them here.</p>';
    return;
  }

  const referencesHTML = Array.from(referenceItems).map(item => {
    const name = item.querySelector('.reference-name-input').value;
    const title = item.querySelector('.reference-title-input').value;
    const company = item.querySelector('.reference-company-input').value;
    const email = item.querySelector('.reference-email-input').value;
    const phone = item.querySelector('.reference-phone-input').value;
    const relationship = item.querySelector('.reference-relationship-input').value;

    if (!name) return '';

    return `
      <div class="reference-item">
        <div class="reference-name">${name}</div>
        ${title ? `<div class="reference-title">${title}</div>` : ''}
        ${company ? `<div class="reference-company">${company}</div>` : ''}
        <div class="reference-contact">
          ${email ? `<span>Email: ${email}</span>` : ''}
          ${phone ? `<span>Phone: ${phone}</span>` : ''}
        </div>
        ${relationship ? `<div class="reference-relationship">${relationship}</div>` : ''}
      </div>
    `;
  }).filter(html => html).join('');

  previewReferences.innerHTML = referencesHTML || '<p class="empty-notice">Add references to see them here.</p>';
}
