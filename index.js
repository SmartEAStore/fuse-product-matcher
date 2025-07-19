const express = require('express');
const Fuse = require('fuse.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/match-products', (req, res) => {
  const { query, products } = req.body;

  if (!query || !products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Missing or invalid query/products' });
  }

  const options = {
    keys: ['name', 'short_description'],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(products, options);
  const results = fuse.search(query).slice(0, 10).map(r => r.item);

  res.json({ matchedProducts: results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Fuse.js API running on port ${PORT}`));