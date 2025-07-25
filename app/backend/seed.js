const mongoose = require('mongoose');
const Project = require('./src/models/project');
const fs = require('fs');
const path = require('path');
const {car_wash_app_detailed_description, 
  home_automation_detailed_description,
  health_book_detailed_description,
  kwela_detailed_description,
  unit_converter_detailed_description,
  chat_app_detailed_description,
  home_management_detailed_description,
  meditation_club_app_description,
  recipe_book_detailed_description} = require('./src/utils/decriptions/detailed_descriptions')

  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://programmerumair29:UWscPCqj2zs5pw8E@cluster0.lkipgdk.mongodb.net/portfolio?retryWrites=true&w=majority');

  const getProjectImages = (projectFolder) => {
    const projectPath = path.join(__dirname, '..', '..', 'public', 'images', 'projects', projectFolder);
    try {
      const files = fs.readdirSync(projectPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
      });
      return files.map(file => `/images/projects/${projectFolder}/${file}`);
    } catch (err) {
      console.error(`Error reading ${projectFolder} images: ${err.message}`);
      return [];
    }
  };

const projects = [
  {
    title: 'Car Wash App',
    short_description: 'Book car cleaning services with payments and notifications.',
    detailed_description: car_wash_app_detailed_description,
    images: getProjectImages('car_wash'),
    category: ['Service Booking'],
  },
  {
    title: 'Home Automation',
    short_description: 'An IoT-based home automation system for controlling smart devices.',
    detailed_description: home_automation_detailed_description,
    images: getProjectImages('home_automation'),
    category: ['IoT / Smart Home'],
  },
  {
    title: 'Home Management',
    short_description: 'Track and manage household expenses with visual analytics.',
    detailed_description: home_management_detailed_description,
    images: getProjectImages('home_management'),
    category: ['Personal Finance'],
  },
  {
    title: 'Recipe Book',
    short_description: 'Explore and save thousands of recipes with ease.',
    detailed_description: recipe_book_detailed_description,
    images: getProjectImages('recipe_book'),
    category: ['Food / Lifestyle'],
  },
  {
    title: 'Meditation Club App',
    short_description: 'Tablet-based app for personalized guided meditation sessions.',
    detailed_description: meditation_club_app_description,
    images: getProjectImages('meditation_club_app'),
    category: ['Wellness / Lifestyle'],
  },
  {
    title: 'Chat App',
    short_description: 'A custom messaging app built with Flutter.',
    detailed_description: chat_app_detailed_description,
    images: getProjectImages('watsapp_replica'),
    category: ['Social Interaction'],
  },
  {
    title: 'Kwela',
    short_description: 'Affordable ride-hailing and carpooling with real-time tracking.',
    detailed_description: kwela_detailed_description,
    images: getProjectImages('kwela_app'),
    category: ['Ride Hailing'], // Fixed typo
  },
  {
    title: 'Unit Converter',
    short_description: 'Convert units and calculate health metrics in one app.',
    detailed_description: unit_converter_detailed_description,
    images: getProjectImages('unit_converter'),
    category: ['Utilities / Health'],
  },
  {
    title: 'Health Book',
    short_description: 'Book diagnostic tests and receive reports from home.',
    detailed_description: health_book_detailed_description,
    images: getProjectImages('health_book'),
    category: ['Healthcare'],
  },
];

// Drop the collection and re-seed
Project.deleteMany({})
  .then(() => {
    console.log('Previous projects collection dropped');
    return Project.insertMany(projects);
  })
  .then(() => console.log('Projects seeded successfully'))
  .catch(err => console.log(`Seeding error: ${err.message}`))
  .finally(() => mongoose.connection.close());