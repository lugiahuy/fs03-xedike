const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const passport = require('passport')
const {authorizing} = require('../../middleware/auth')

const { User } = require('../../models/users');

// api:     /api/users/register
// desc:    register a new user
// access:  PUBLIC
router.post('/register', (req, res) => {
    const { email, password, fullName, phone, DOB, userType } = req.body;

    User.findOne({ $or: [{ email }, { phone }] })
        .then(user => {
            // user exists
            if (user) return res.status(400).json({
                errors: 'Email or phone exists'
            })

            // user not exist
            const newUser = new User({
                email, password, fullName, phone, DOB,userType
            })

            bcrypt.genSalt(10, (err, salt) => {
                if (err) return res.status(400).json(err)

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) return res.status(400).json(err)

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
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ errors: "Email: ko ton tai" })

            bcrypt.compare(password, user.password)
                .then(result => {
                    if (!result) return res.status(400).json({ errors: "Sai Mat Khau" })

                    const payload = {
                        id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        userType: user.userType
                    }

                    jwt.sign(
                        payload,
                        //secret key: tu dat ten
                        'lugiahuy',
                        //dat thoi gian hieu luc cho tai khoan
                        { expiresIn: '1h' },
                        (err, token) => {
                            if (err) return res.status(400).json(err)

                            res.status(200).json({
                                message: "Dang Nhap Thanh Cong",
                                //them Bearer de phu hop voi tat ca trinh duyet
                                token: "Bearer " + token
                            })
                        }
                    )
                    // res.status(200).json({msg: "Dang nhap thanh cong"})
                })
                .catch(err => res.status(400).json(err))
        })
})
//TEST
router.get('/test',
    (req, res, next) => { //next: them khi thuc hien nhieu middleware
        console.log('md1');
        next();
    },
    (req, res, next) => {
        console.log('md2');
        next();
    },
    (req, res) => {
        res.json({ msg: 'Ket thuc' })
    }
)
//test-current
router.get('/test-private',
    passport.authenticate('jwt', { session: false }),
    authorizing('driver'),
    (req, res) => {
        res.json({ msg: 'success' })
    }
)
module.exports = router;