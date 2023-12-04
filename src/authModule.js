const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock database to store user data
const users = [];

app.post('/register', async (req, res) => {
  try {
    // Check if the username already exists
    const existingUser = users.find(u => u.username === req.body.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Create a new user object with an incremented ID
    const newUser = {
      id: users.length + 1,
      username: req.body.username,
      password: req.body.password,
    };

    // Add the new user to the 'users' array
    users.push(newUser);

    // Respond with a JSON object containing the new user
    res.json({ user: newUser });
  } catch (error) {
    // If there's an error (e.g., duplicate username), respond with a 400 status code and an error message
    res.status(400).json({ error: error.message });
  }
});



// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    res.json({ token: 'yourAuthToken' }); // Replace with a proper authentication token
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get User endpoint
app.get('/getUser/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update User endpoint
app.put('/updateUser/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.username = req.body.username;
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete User endpoint
app.delete('/deleteUser/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = app;
