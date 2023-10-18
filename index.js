const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const fs = require('fs');
const usersFile = 'users.json';

app.get('/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  const users = getUsers();
  newUser.id = users.length + 1;
  users.push(newUser);
  saveUsers(users);
  res.json(newUser);
});

app.get('/users/:userId/employee/:employeeNumber/companyName', (req, res) => {
    const userId = parseInt(req.params.userId);
    const employeeNumber = parseInt(req.params.employeeNumber);
  
    const users = getUsers();
    const user = users.find(user => user.id === userId);
  
    if (user) {
      const companyName = user.companyName;
      res.json({ companyName });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  let users = getUsers();
  users = users.filter(user => user.id !== userId);
  saveUsers(users);
  res.json({ message: 'User deleted successfully' });
});

// Helper functions to read and write user data
function getUsers() {
  const rawData = fs.readFileSync(usersFile);
  return JSON.parse(rawData).users;
}

function saveUsers(users) {
  const data = { users };
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}
