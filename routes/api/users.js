const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const {User} = require('../../models/users');

// api:     /api/users/register
// desc:    register a new user
// access:  PUBLIC
router.post('/register', (req, res) => {
    const {email, password, fullName, phone, DOB} = req.body;

    User.findOne({$or: [{email}, {phone}]})
        .then(user => {
            // user exists
            if(user) return res.status(400).json({
                errors: 'Email or phone exists'})

            // user not exist
            const newUser = new User({
                email, password, fullName, phone, DOB
            })

            bcrypt.genSalt(10, (err, salt) => {
                if(err) return res.status(400).json(err)

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) return res.status(400).json(err)

                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.status(200).json(user)
                        })
                        .catch(err => res.status(400).json(err))
                })
            })
        })
        .catch(err => res.status(400).json(err))        
})

// api:     /api/users/login
// desc:    login into system
// access:  PUBLIC
router.post('/login' , (req, res) => {
    const {email, password} = req.body;

    User.findOne({email})
        .then(user => {
            if(!user) return res.status(400).json({errors: "Email: ko ton tai"})

            bcrypt.compare(password , user.password)
                .then(result => {
                    if(!result) return res.status(400).json({errors: "Sai Mat Khau"})

                    res.status(200).json({msg: "Dang nhap thanh cong"})
                })
        })
})

module.exports = router;