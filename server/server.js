const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const multer = require('multer');

app.use(cors());
app.use(express.json());
// app.use(express.static(__dirname + '/uploads'));

app.use('/uploads', express.static('uploads'));

// Set up multer
app.use(express.static("uploads"));
mongoose.connect('mongodb+srv://jasimwazir098:khan!!!@cluster0.bbx0tzz.mongodb.net/catagory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('connected to database');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads'); // Store uploaded images in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     cb(null, `${timestamp}-${file.originalname}`);
//   },
// });
const storage = multer.diskStorage({
  destination: 'uploads/', // Store uploaded images in the 'uploads' directory
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const ItemSchema = new mongoose.Schema({
    name: String,
    email: String,
    category: String,
    price: Number, // Add the "price" field as a Number
    image: String,
  });
  

const ItemModel = mongoose.model('Item', ItemSchema);

app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    // Extract form data including the uploaded image file (req.file)
    const { name, email, category, price } = req.body;
    const file = req.file;
    const imagePath = file.filename;
    // Create a new item with the form data
    const newItem = new ItemModel({
      name,
      email,
      category,
      price,
      image: imagePath, // Assign the image path to the 'image' field
    });

    // Save the new item to the database
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/glass', async (req, res) => {
  try {
    const glassItems = await ItemModel.find({ category: 'glass' });
    res.status(200).json(glassItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/glass/search', async (req, res) => {
    try {
      const minPrice = parseFloat(req.query.minPrice);
      const maxPrice = parseFloat(req.query.maxPrice);
  
      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: 'Invalid price range' });
      }
  
      const glassItems = await ItemModel.find({
        category: 'glass',
        price: { $gte: minPrice, $lte: maxPrice },
      });
  
      res.status(200).json(glassItems);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.get('/api/gla/search', async (req, res) => {
    try {
      const query = req.query.query;
      const minPrice = parseFloat(req.query.minPrice || 0);
      const maxPrice = parseFloat(req.query.maxPrice || Number.MAX_SAFE_INTEGER);
  
      const filter = {
        category: 'glass',
        name: { $regex: `^${query}`, $options: 'i' }, // Case-insensitive search
        price: { $gte: minPrice, $lte: maxPrice }, // Price range filter
      };
  
      const glassItems = await ItemModel.find(filter);
  
      res.status(200).json(glassItems);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.delete('/api/glass/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
  
      // Find and delete the product by ID
      await ItemModel.deleteOne({ _id: productId });
  
      res.status(204).send(); // Send a 204 No Content response
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put('/api/glass/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
      const updatedProduct = req.body; // New product data
  
      // Update the product by ID
      await ItemModel.findByIdAndUpdate(productId, updatedProduct);
  
      res.status(204).send(); // Send a 204 No Content response
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
// Backend route to fetch items by category
app.get('/api/items/:category', async (req, res) => {
    try {
      const category = req.params.category;
  
      // Fetch items based on the selected category
      const items = await ItemModel.find({ category });
  
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


app.get('/api/perfume', async (req, res) => {
  try {
    const perfumeItems = await ItemModel.find({ category: 'perfume' });
    res.status(200).json(perfumeItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cloth', async (req, res) => {
    try {
      const clothItems = await ItemModel.find({ category: 'cloth' });
      res.status(200).json(clothItems);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.use(express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
