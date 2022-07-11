const User = require('../models/User');
const checkToken = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.public = (req,res) => {
    res.status(200).json({ msg: 'Bem vindo a API'})
};

exports.id = checkToken, async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id, '-password');

    if(!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado'});
    }

    res.status(200).json({ user });
}

exports.register = async (req,res) => {
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
};

exports.login = async (req, res) => {
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
        console.log(err)

        res.status(500).json({
            msg: 'Tente mais tarde!'
        })
    }
};