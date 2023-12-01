const express = require('express');
require('dotenv').config(); 
const app = express();
const port = 3030;
var bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());

//connect DB
const sequelize = require('./config/db');

// Test the database connection
(async () => {
try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
})();

const User = require('./models/User');
const Patient = require('./models/Patient');
const Protocole = require('./models/Protocole');
const Molecule = require('./models/Molecule');
const Prescription = require('./models/Prescription');
const Cure = require('./models/Cure');
const Product = require('./models/Product');
const DataHistory = require('./models/DataHistory');
const Vehicule = require('./models/Vehicule');
const PrepMolecule = require('./models/PrepMolecule');
const Flacon = require('./models/Flacon');

Patient.hasMany(Prescription, {foreignKey: 'id_patient'});
Prescription.belongsTo(Patient, {foreignKey: 'id_patient'});

Prescription.belongsTo(Protocole, {foreignKey: 'id_protocole'});  //error
// Protocole.hasMany(Prescription, {foreignKey: 'id_protocole'});

Prescription.hasMany(Cure, {foreignKey: 'id_prescription'});
Cure.belongsTo(Prescription, {foreignKey: 'id_prescription'});

Cure.hasMany(Product, {foreignKey: 'id_cure'});
Product.belongsTo(Cure, {foreignKey: 'id_cure'});

Product.hasOne(Vehicule, {foreignKey: 'id_product'});
Vehicule.belongsTo(Product, {foreignKey: 'id_product'});

Product.belongsTo(Molecule, {foreignKey: 'id_molecule'});

DataHistory.belongsTo(Patient, {foreignKey: 'id_patient'});
DataHistory.belongsTo(User, {foreignKey: 'id_user'});

// Sync models with the database
(async () => {
try {
    await sequelize.sync({ alter: false });
    console.log('Models synchronized with the database.');
} catch (error) {
    console.error('Unable to sync models with the database:', error);
}
})();

app.use(require('./routes'));

app.listen(port, ()=>{
    console.log('app is listening on http://localhost:' + port)
})