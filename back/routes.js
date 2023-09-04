const User = require('./models/User');
const Patient = require('./models/Patient');
const Protocole = require('./models/Protocole');
const Molecule = require('./models/Molecule');
const Prescription = require('./models/Prescription');
const Cure = require('./models/Cure');
const Product = require('./models/Product');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment')

router.get('/', (req,res)=>{
    res.send('hey')
})

///////////////////////////////
///////////////////// USER ///
router.post('/login', async (req,res)=>{
    try{
        if(!req.body){
            return res.status(400).send('Missing Fields!')    
        }

        let { username, password } = req.body;
        
        if(!(username && password)){
            return res.status(400).send('Missing Fields!')    
        }

        let user = await User.findOne({
            where: {
                username
            }
        })

        if(user && (await bcrypt.compare(password, user.password))){
            let tokenUser = user;
            delete tokenUser.dataValues.password;
            const token = jwt.sign({ tokenUser }, process.env.JWT_KEY, { expiresIn: '3d' })
            return res.status(200).send({ user: tokenUser, token })
        }else{
            return res.status(400).send('Wrong credentials!')    
        }

    }catch(err){
        console.log(err)
    }
})


///////////////////////////////
////////////////// PATIENT ///
router.post('/addPatient', async (req,res)=>{
    try{
        const patient = await Patient.create(req.body)
        return res.status(200).send(patient);
    }catch(err){
        console.log(err)
    }
})

router.post('/getAllPatients', async (req,res)=>{
    try{
        const patients = await Patient.findAll({
            attributes: ['id', 'DDN', 'DMI', 'nom', 'prenom', 'birthDate', 'sexe']
        })
        return res.status(200).send(patients);
    }catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
})

router.post('/getPatientById', async (req,res)=>{
    try{
        const { id } = req.body;
        const patient = await Patient.findOne({
            where: {
                id
            }
        })
        return res.status(200).send(patient);
    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
})

///////////////////////////////
//////////////// PROTOCOLE ///
router.post('/getAllProtocoles', async (req,res)=>{
    const Protocoles = await Protocole.findAll({});
    return res.status(200).send(Protocoles);
})

router.post('/getMolecules', async (req,res)=>{
    const { id_protocole } = req.body;

    if(!id_protocole){
        return res.sendStatus(400)
    }

    const protocole = await Protocole.findOne({
        where: {
            id_protocole
        }
    })

    const molecules = await Molecule.findAll({
        where: {
            id_protocole
        },
        order: [ ['jour_prod', 'ASC'] ]
    })

    return res.status(200).send([protocole, molecules])

})

///////////////////////////////
///////////// Prescription ///
function addDaysToDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function getDateDifference(date1Str, date2Str) {
    var start = moment(date1Str, "YYYY-MM-DD");
    var end = moment(date2Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
}

router.post('/addPrescription', async (req,res)=>{
    const { patientId, data } = req.body;

    if(! (patientId && data)){
        return res.sendStatus(400)
    }

    const patient = await Patient.findOne({
        where: {
            id: patientId
        }
    })
    const protocole = await Protocole.findOne({
        where: {
            id_protocole: data.protocole
        }
    })
    const molecules = await Molecule.findAll({
        where:{
            id_protocole: data.protocole
        },
        order: [ ['jour_prod', 'ASC'] ]
    })

    const prescription = await Prescription.create({
        id_patient: patientId,
        id_protocole: data.protocole,
        prescripteur: data.prescripteur,
        startDate: data.date,
        nbrCures: data.nbrCures
    })

    for(let i=0; i < data.nbrCures ; i++){
        let date = addDaysToDate(prescription.startDate, parseInt(protocole.intercure) * i);
        let cure = await Cure.create({
            id_prescription: prescription.id,
            name: 'Cure ' + (i + 1),
            startDate: date,
            state: (i==0 ? 'En Cours' : 'Prévu')
        })
        let keys = Object.keys(molecules);
        keys.forEach(async (key)=>{
            let mol = molecules[key];
            let molDate = addDaysToDate(cure.startDate, parseInt(mol.jour_prod) - 1);
            await Product.create({
                id_cure: cure.id,
                id_molecule: mol.id,
                name: mol.molecule,
                dose: mol.dose,
                startDate: molDate,
                validation: 0
            })
        })
    }
    return res.status(200).send(molecules);
})

router.post('/getPrescription', async (req, res)=>{
    const { presId } = req.body;

    let data = await Prescription.findOne({
        where: {
            id: presId
        },
        include: { all: true, nested: true }
    })

    return res.status(200).send(data)

})

router.post('/changePrescriptionCommentaire', async (req, res)=>{
    const { presId, commentaire } = req.body;

    await Prescription.update({ commentaire }, {
        where: {
            id: presId
        },
    })

    return res.sendStatus(200)

})

router.post('/changeCureDate', async (req,res)=>{
    const { cureId, date} = req.body

    let cure = await Cure.findOne({
        where: {
            id: cureId
        },
        include: [Product]
    })

    let diff = getDateDifference(date,cure.startDate);

    cure.startDate = date;

    cure.Products.forEach(product => {
        let newDate = addDaysToDate(product.startDate, diff);
        product.startDate = newDate;
        product.save()
    })

    cure.save()

    console.log(diff)
    return res.status(200).send(cure.Products)

})

router.post('/updateCure', async (req,res)=>{
    const { pass, cure } = req.body;

    if(!pass){
        return res.status(400).send('Missing Fields!')
    }

    cure.forEach(el=>{
        if(el){
            el.forEach(prod=>{
                Product.update({ dose: prod.dose, validation: prod.validation }, {
                    where:{
                        id: prod.id
                    }
                })
            })
        }
    })

    return res.status(200).send('DONE')
})

///////////////////////////////
///////////////// Planning ///
router.post('/getPlanning', async (req, res)=>{
    const { patientId } = req.body;

    let data = await Prescription.findAll({
        where: {
            id_patient: patientId
        },
        include: { all: true, nested: true }
    })

    return res.status(200).send(data)

})

///////////////////////////////
////////////// DataHistory ///
router.post('/addDataHistory', async(req,res)=>{

})

module.exports = router;