// Define an Item model! Here are the details:
// Create a new Item file in the models directory
// The Item model should have the following properties:
// name: a string
// image: a string
// price: a number
// vegetarian: a boolean
// Make sure to export the model and import it anywhere you need it.
// Create tests to verify you can perform CRUD operations using the Item model.

const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');

// TODO - create a Menu model
const Item = sequelize.define('Item',{
    name: Sequelize.STRING,
    image: Sequelize.STRING,
    price: Sequelize.INTEGER,
    vegetarian: Sequelize.BOOLEAN,
})

module.exports = {Item};