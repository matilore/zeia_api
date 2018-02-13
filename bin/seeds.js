const mongoose = require('mongoose');
const User = require('../models/user');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const user = {
  username: 'matilore',
  password: '1234',
  coins: [
    {
      name: 'BTC',
      label: 'Bitcoin',
      image: '/media/19633/btc.png',
      value: 8000
    },
    {
      name: 'ADA',
      label: 'Ada',
      image: '/media/12318177/ada.png',
      value: 2500
    },
    {
      name: 'XLM',
      label: 'Stellar',
      image: '/media/20696/str.png',
      value: 3500
    }
  ]
};

User.create(user, (err, docs) => {
  if (err) {
    throw err;
  }
  console.log(user);
  mongoose.connection.close();
});
