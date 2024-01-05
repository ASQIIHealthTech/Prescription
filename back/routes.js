const User = require('./models/User');
const Patient = require('./models/Patient');
const Protocole = require('./models/Protocole');
const Molecule = require('./models/Molecule');
const Prescription = require('./models/Prescription');
const Cure = require('./models/Cure');
const Product = require('./models/Product');
const Vehicule = require('./models/Vehicule');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const PrepMolecule = require('./models/PrepMolecule');
const Flacon = require('./models/Flacon');
const ParentProtocole = require('./models/ParentProtocole');
const Ajustement = require('./models/Ajustement');

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

router.post('/signup', async (req,res)=>{
    try{
        if(!req.body){
            return res.status(400).send('Missing Fields!')    
        }

        let { name, username, password, type } = req.body;
        
        if(!(name && username && password && type)){
            return res.status(400).send('Missing Fields!')    
        }

        let oldUser = await User.findOne({
            where: {
                username
            }
        })

        const hashedPass = await bcrypt.hash(password, 10);

        if(!oldUser){
            let user = await User.create({
                name,
                username,
                password: hashedPass,
                type
            })

            let tokenUser = user;
            delete tokenUser.dataValues.password;
            const token = jwt.sign({ tokenUser }, process.env.JWT_KEY, { expiresIn: '3d' })
            return res.status(200).send({ user: tokenUser, token })
        }else{
            return res.status(400).send('User already exists!')    
        }

    }catch(err){
        console.log(err)
    }
})

router.post('/checkToken', async (req,res)=>{
    const { token } = req.body;

    let data = jwt.verify(token, process.env.JWT_KEY)

    if(data){
        return res.status(200).send(data)
    }else{
        return res.sendStatus(400);
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

router.post('/deletePatient', async (req,res)=>{
    const { patientId } = req.body;

    try{
        await Patient.destroy({
            where: {
                id: patientId
            }
        })

        return res.sendStatus(200);
    }catch(err){
        return res.sendStatus(400);
    }
})

router.post('/getAllPatients', async (req,res)=>{
    try{
        const patients = await Patient.findAll({
            attributes: ['id', 'matrimonial', 'DMI', 'nom', 'prenom', 'birthDate', 'sexe']
        })
        return res.status(200).send(patients);
    }catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
})

router.post('/getAllPatientsWithPres', async (req,res)=>{
    try{
        const patients = await Patient.findAll({
            attributes: ['id', 'matrimonial', 'DMI', 'nom', 'prenom', 'birthDate', 'sexe'],
            include: { all: true, nested: true }
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

router.post('/changePatientData', async (req,res)=>{
    const { id, type, value, surfCorp, clairance } = req.body;
    const patient = await Patient.update({ [type]: value, surfCorp, clairance }, {
        where:{
            id
        }
    })
    return res.status(200).send(patient);
})

///////////////////////////////
//////////////// PROTOCOLE ///
router.post('/getAllProtocoles', async (req,res)=>{
    const Protocoles = await Protocole.findAll({});
    return res.status(200).send(Protocoles);
})

router.post('/getParentProtocoles', async (req,res)=>{
    const Protocoles = await Protocole.findAll({
        attributes: ['parent'],
        group: ['parent']
    });
    return res.status(200).send(Protocoles);
})

router.post('/getProtocole', async (req,res)=>{
    const { id } = req.body;

    const protocole = await Protocole.findOne({
        where: {
            id
        }
    });
    return res.status(200).send(protocole);
})

router.post('/getAllMolecules', async (req,res)=>{

    const molecules = await Molecule.findAll({
        attributes: ['molecule'],
        group: ['molecule'],
    })

    return res.status(200).send(molecules)

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

router.post('/getMoleculesParent', async (req,res)=>{
    const { parent } = req.body;

    const protocole = await Protocole.findOne({
        where: {
            parent
        }
    })

    const molecules = await Molecule.findAll({
        where: {
            id_protocole: protocole.id
        },
        order: [ ['jour_prod', 'ASC'] ]
    })

    return res.status(200).send([protocole, molecules])

})

router.post('/addProtocole', async (req,res)=>{
    const { protData, rows } = req.body;

    let prot = await Protocole.create(protData);

    prot.id_protocole = prot.id;
    await prot.save();

    rows.forEach(el=>{
        for(let i=1;i<parseInt(prot.intercure)+1;i++ ){
            if(el['j'+i] && el['j'+i] == 1 && el.name != ''){
                Molecule.create({
                    id_protocole: prot.id_protocole,
                    molecule: el.name,
                    dose: el.dose,
                    unite: el.unite,
                    jour_prod: i,
                })
            }
        }
    })

    return res.status(200).send(prot)

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
        nbrCures: data.nbrCures,
        essaiClin: data.essaiClin
    })
    
    let keys = Object.keys(molecules);
    for(let i=0; i < data.nbrCures ; i++){
        let date = addDaysToDate(prescription.startDate, parseInt(protocole.intercure) * i);
        let cure = await Cure.create({
            id_prescription: prescription.id,
            name: 'Cure ' + (i + 1),
            startDate: date,
            state: (i==0 ? 'En Cours' : 'Prévu')
        })
        keys.forEach(async (key)=>{
            let mol = molecules[key];
            let molDate = addDaysToDate(cure.startDate, parseInt(mol.jour_prod) - 1);
            await Product.create({
                id_cure: cure.id,
                id_molecule: mol.id,
                name: mol.molecule,
                dose: mol.dose,
                startDate: molDate,
                validation: 0,
                adjusted: 0,
                liberer: 0,
                terminer: 0
            })
        })
    }
    return res.status(200).send(molecules);
})

router.post('/addPrescriptionParent', async (req,res)=>{
    const { patientId, data } = req.body;

    if(! (patientId && data)){
        return res.sendStatus(400)
    }

    const protocoles = await Protocole.findAll({
        where: {
            parent: data.parent
        },
        order: [ [ 'id', 'ASC' ]]
    })
    
    const parentProtocole = await ParentProtocole.create({
        name: data.parent
    })

    protocoles.forEach(async (protocole)=>{

        const molecules = await Molecule.findAll({
            where:{
                id_protocole: protocole.id
            },
            order: [ ['jour_prod', 'ASC'] ]
        })
    
        const prescription = await Prescription.create({
            id_patient: patientId,
            id_protocole: protocole.id,
            id_parent: parentProtocole.id,
            prescripteur: data.prescripteur,
            startDate: data.date,
            nbrCures: data.nbrCures,
            essaiClin: data.essaiClin
        })
        
        let keys = Object.keys(molecules);
        for(let i=0; i < data.nbrCures ; i++){
            let date = addDaysToDate(prescription.startDate, parseInt(protocole.intercure) * i);
            let cure = await Cure.create({
                id_prescription: prescription.id,
                name: 'Cure ' + (i + 1),
                startDate: date,
                state: (i==0 ? 'En Cours' : 'Prévu')
            })
            keys.forEach(async (key)=>{
                let mol = molecules[key];
                let molDate = addDaysToDate(cure.startDate, parseInt(mol.jour_prod) - 1);
                await Product.create({
                    id_cure: cure.id,
                    id_molecule: mol.id,
                    name: mol.molecule,
                    dose: mol.dose,
                    startDate: molDate,
                    validation: 0,
                    adjusted: 0,
                    liberer: 0,
                    terminer: 0
                })
            })
        }

    })

    return res.status(200).send('DONE');
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

router.post('/getLatestPrescription', async (req, res)=>{
    const { patientId } = req.body;

    let data = await Prescription.findOne({
        where: {
            id_patient: patientId
        },
        include: { all: true, nested: true },
        order: [ [ 'createdAt', 'DESC' ]]
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
    const { pass, cure, user } = req.body;

    const currentUser = await User.findOne({ 
        where: {
            id: user.id
        }
    }) 

    if(!pass || !currentUser){
        return res.status(400).send('Missing Fields!')
    }

    let verified = await bcrypt.compare(pass, currentUser.password);

    if(verified){
        cure.forEach(el=>{
            if(el){
                el.forEach(prod=>{
                    Product.update({ dose: prod.dose, validation: prod.validation, startDate: prod.startDate }, {
                        where:{
                            id: prod.id
                        }
                    })
                })
            }
        })
    }else{
        return res.status(400).send('Wrong Credentials')
    }

    return res.status(200).send('DONE')
})

router.post('/getAllCures', async (req,res)=>{1
    const { medecin } = req.body;

    let cures = await Prescription.findAll({
        include: { all: true, nested: true },
    })

    return res.status(200).send(cures);
})

///////////////////////////////
///////////////// Planning ///
router.post('/getPlanning', async (req, res)=>{
    const { patientId } = req.body;

    let data = await Prescription.findAll({
        where: {
            id_patient: patientId
        },
        // order: [['id', 'ASC'], ['id_parent', 'DESC']],
        include: { all: true, nested: true }
    })


    let patient = await Patient.findOne({
        where: {
            id: patientId
        }
    })

    return res.status(200).send([data, patient])

})

///////////////////////////////
//////////////// Pharmacie ///
router.post('/changeProductValidation', async (req,res)=>{
    let { row } = req.body;

    let product = await Product.update({ validation: row.validation }, {
        where: {
            id: row.id
        }
    })

    return res.sendStatus(200)
})
router.post('/saveAjustement', async(req,res)=>{
    const { ajustementData, prodId } = req.body;

    await Ajustement.destroy({
        where: {
            id_product: prodId
        }
    })
    
    const ajustement = await Ajustement.create({
        ...ajustementData,
        id_product: prodId
    })

    return res.status(200).send(ajustement)

})

router.post('/getAjustementData', async(req,res)=>{
    const { prodId } = req.body;

    let product = await Product.findOne({
        where: {
            id: prodId
        },
        include: [Molecule, Vehicule]
    })
    let prepMolecules = await PrepMolecule.findAll({
        where: {
            dci: product.name
        }
    })
    let cure = await Cure.findOne({
        where: {
            id: product.id_cure
        }
    })
    let prescription = await Prescription.findOne({
        where: {
            id: cure.id_prescription
        },
        include: [Patient, Protocole]
    })
    
    let ajustement = await Ajustement.findOne({
        where: {
            id_product: prodId
        },
    })

    res.status(200).send([prescription, cure, product, prepMolecules, ajustement])
})

router.post('/setAdjusted', async(req,res)=>{
    const { id, value } = req.body;

    let product = await Product.update({ adjusted: value }, {
        where: {
            id
        }
    })

    res.status(200).send(product)
})

router.post('/setLiberer', async(req,res)=>{
    const { id, value } = req.body;

    let product = await Product.update({ liberer: value }, {
        where: {
            id
        }
    })

    res.status(200).send(product)
})

router.post('/setTerminer', async(req,res)=>{
    const { id, value } = req.body;

    let product = await Product.update({ terminer: value }, {
        where: {    
            id
        }
    })

    res.status(200).send(product)
})

router.post('/saveVehicule', async (req,res)=>{
    const { data } = req.body;

    let veh = await Vehicule
        .findOne({ where: { id_product: data.id_product } })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(data);
            // insert
            return Vehicule.create(data);
        })

    res.sendStatus(200)
})

///////////////////////////////
////////////////////// FAB ///
router.post('/getFABData', async (req,res)=>{
    const { ids } = req.body;

    let products = await Product.findOne({
        where:{
            id: ids
        },
        include: { all: true, nested: true }
    })

    res.status(200).send(products)
})

router.post('/getPrepMolecule', async (req,res)=>{
    const { dci } = req.body;

    let prepMolecule = await PrepMolecule.findOne({
        where:{
            dci
        },
    })

    res.status(200).send(prepMolecule)
})

///////////////////////////////
////////////////// Flacons ///
router.post('/getFlacons', async (req,res)=>{
    const { dci } = req.body;

    let flacons = await PrepMolecule.findAll({
        where:{
            dci
        },
        order: [['dosage', 'DESC']]
    })

    res.status(200).send(flacons)
})

router.post('/getSavedFlacons', async (req,res)=>{
    const { productId } = req.body;

    let flacons = await Flacon.findAll({
        where:{
            productId
        },
        order: [['dosage', 'DESC']]
    })

    res.status(200).send(flacons)
})

router.post('/saveFlacons', async (req,res)=>{
    const { flacons } = req.body;

    if(!flacons){
        res.status(400).send('no flacons')
    }

    let oldFlacons = await Flacon.findAll({
        where: {
            productId: flacons[0].productId
        }
    }) 

    oldFlacons.forEach(async (flac)=>{
        await Flacon.destroy({
            where: {
                id: flac.id
            }
        })
    })

    flacons.forEach(async (flac)=>{
        await Flacon.create(flac)
    })

    res.status(200).send('Done')
})

module.exports = router;