require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();

const jsonParser = bodyParser.json();
app.use(express.json());
app.use(router);

const totalStorage = 1048576;
const actualStorage = [];
let actualStorageFree = [];
let totalFilesUser = [];
let totalFiles = [];

const uploadMiddleware = (req, res) => {
 
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: err.message })
        } else if (err) {
            return res.status(400).send({ message: err.message })
        }
  
        const file  = req.file;
        const size  = file.size;
        
        actualStorage.push(size);
    
        sum = lodash.sum(actualStorage);;
  
        if(totalFiles !== 0) {
          if(sum  > actualStorageFree){
           return res.status(400).send({ message:"no space" });
          }
        }
    
        actualStorageFree = totalStorage - sum;
        console.log(actualStorageFree);
    
        if(sum > totalStorage){
              return res.status(400).send({ message:"Insuficient space" });
              }
         
        totalFiles++;
        totalFilesUser++;
  
        res.status(200).send({
            file: file.originalname,
            filename: file.filename,
            size: file.size +"kb",
         });
     });
  };

exports.index = function(req,res) {
    res.status(200).json({ msg: 'Bem vindo a API'})
};

router.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id, '-password');

    if(!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado'});
    }

    res.status(200).json({ user });
});

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!'});
    }

    try {

        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();

    } catch(error) {
      res.status(400).json({ msg: "Token inválido!"});  
    }
}

router.post('/auth/register', jsonParser, async (req,res) => {
    const { name, email, password, confirmpassword } = req.body;
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório'});
    }

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório'});
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória'});
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!'});
    }

    const userExists = await User.findOne({ email:email });

    if (userExists) {
        return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!'});
    }

    //create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso!'});

    } catch(error) {
        res.status(500).json({ msg: 'Tente mais tarde'});
    }
});

router.post('/auth/login', jsonParser, async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório'});
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória'});
    }

    const user = await User.findOne({ email:email });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!'});
    }

    const checkPassword = await bcrypt.compare(password, user.password );

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!'});
    }

    try {
        const secret = process.env.SECRET;

        const token = jwt.sign(
            {
                id: user.id,
            },
            secret,
        )

        res.status(200).json({ msg: 'Autenticação realizada', token })
    } catch (err) {
        console.log(error)

        res.status(500).json({
            msg: 'Tente mais tarde!'
        })
    }

    router.get("/upload/:filename", (req, res) => {
        const filename = req.params.filename;
        const upload = `${__dirname}/uploads/${filename}`;
        res.download(upload);
    });
    
    router.post("/upload", uploadMiddleware,(req,res) => {
        res.send({ message:"Arquivo recebido"});
    });
    
    router.get("/actualStorageFree",(req,res) => {
        res.send(`Espaço livre de ${actualStorageFree}kb`);
    });
    
    router.get("/totalFiles",(req,res) => {
        res.send(totalFiles === 1 ? totalFiles + " arquivo" : totalFiles + " arquivos");
    });
});

module.exports = router;
