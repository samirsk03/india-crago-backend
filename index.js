import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI ;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Example Mongoose model
const UserSchema = new mongoose.Schema({
   date: {
    type: String,
    required: true,
  },
  vehicleNo: {
    type: String,
    required: true,
  },
  luggageCompany: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  advance: {
    type: Number,
    default: 0,
  },
  advanceSal: {
    type: Number,
    default: 0,
  },
  advanceTags: {
    type: Number,
    default: 0,
  },
  advanceFuel: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    default: 0,
  },
  tripDays: {
    type: Number,
    default: 0,
  },
  costToCustomer: {
    type: Number,
    default: 0,
  },
  maintenance: {
    servicingCost: { type: Number, default: 0 },
    servicingComment: { type: String, default: "" },
    tyreCost: { type: Number, default: 0 },
    tyreComment: { type: String, default: "" },
    roadMaintenance: { type: Number, default: 0 },
    roadMaintenanceComment: { type: String, default: "" },
    roadRTO: { type: Number, default: 0 },
    roadRTOComment: { type: String, default: "" },
    fixedRTO: { type: Number, default: 0 },
    fixedRTOComment: { type: String, default: "" },
  },
  driver: {
    driverAccount: { type: Number, default: 0 },
    driverAccountComment: { type: String, default: "" },
    fuel: { type: Number, default: 0 },
    fuelComment: { type: String, default: "" },
    tags: { type: Number, default: 0 },
    tagsComment: { type: String, default: "" },
  },
  status: {
    type: String,
    enum: ['not_delivered', 'delivered', 'late_delivered', 'late_unload'],
    default: 'not_delivered',
  },
  penalty: {
    type: Number,
    default: 0,
  },
  transporterAdvance: {
    type: Number,
    default: 0,
  },
  transporterRemaining: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,

});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express + MongoDB API!' });
});

// post route 
app.post('/api/trips', async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get route 
app.get('/api/trips', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update a user by ID
app.put('/api/trips/:_id', async (req, res) => {
  const { _id } = req.params;
  const updateData = req.body;

  try {
    // Find user by ID and update with new data, return updated doc
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,           // return the updated document
      runValidators: true, // validate data against schema
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
