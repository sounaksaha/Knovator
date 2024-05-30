const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

connectDB();


app.use(express.json());
app.use(passport.initialize());


require('./config/passport')(passport);

app.use('/api/users', require('./routes/users'));
app.use(passport.initialize());
app.use('/api/posts', require('./routes/posts'));
app.use('/api/dashboard', require('./routes/dashboard'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
