const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World! gshankar' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Only needed for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// This is important for Vercel
module.exports = app;



