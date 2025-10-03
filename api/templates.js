export default function handler(req, res) {
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
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
}
