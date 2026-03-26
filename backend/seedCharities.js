require('dotenv').config();
const mongoose = require('mongoose');
const Charity = require('./models/Charity');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected...');

    const charities = [
      {
        name: 'Global Green Fund',
        description: 'Planting trees and protecting endangered ecosystems.',
      },
      {
        name: "Kids' Code Academy",
        description: 'Teaching children from low-income families how to code.',
      },
      {
        name: 'Meals for All',
        description: 'Providing warm meals to homeless individuals worldwide.',
      }
    ];

    for (let c of charities) {
      const exists = await Charity.findOne({ name: c.name });
      if (!exists) {
        await Charity.create(c);
        console.log(`Created charity: ${c.name}`);
      }
    }
    
    console.log('Charity seeding complete.');
    process.exit();
  })
  .catch(err => {
    console.error('Error connecting to DB', err);
    process.exit(1);
  });