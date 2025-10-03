export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Resume Builder API is working',
    timestamp: new Date().toISOString()
  });
}
