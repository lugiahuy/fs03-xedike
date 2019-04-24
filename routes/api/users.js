const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); //up hinh, nhac, video


const router = express.Router();
const passport = require('passport')
const { authorizing } = require('../../middleware/auth')

const { User } = require('../../models/users');

const validateRegisterInput = require('../../Validation/validateRegisterInput')

// api:     /api/users/register 
// desc:    register a new user
// access:  PUBLIC
router.post('/register', (req, res) => {
    const { email, password, fullName, phone, DOB, userType } = req.body;
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) return res.status(400).json(errors)

    User.findOne({ $or: [{ email }, { phone }] })
        .then(user => {
            // user exists
            if (user) {
                if (user.email == email) errors.email = "Email exists"
                if (user.phone == phone) errors.phone = "Phone exists"
                return res.status(400).json(errors)
            }

            // user not exist
            const newUser = new User({
                email, password, fullName, phone, DOB, userType
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

//upload avatar

//route: /api/users/upload-avatar
//desc: upload an avatar
//private(passenger, driver, admin)
//upload-avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        let type = "";
        if (file.mimetype === 'application/octet-stream') type = '.jpg'
        cb(null, new Date().getTime() + "-" + file.originalname + type)
    }
})

const upload = multer({ storage })

router.post('/upload-avatar',
    passport.authenticate('jwt', { session: false }),
    upload.single('avatar'),
    (req, res) => {
        User.findById(req.user.id)
            .then(user => {
                user.avatar = req.file.path
                return user.save()
            })
            .then(user => res.status(200).json(user))
            .catch(console.log)
    }

)

//API lay danh sach user
//route /api/users/list-user
// desc: get list user

router.get('/list-item',
    (req, res) => {
        User.find()
            .then(users => {
                if (users) res.status(200).json(users)
            })
    }
)

//APi lay thong tin chi tiet 1 user
// route: /api/users/:userId
router.get('/:id',
    (req, res) => {
        User.findOne({ _id: req.param.id })
            .then(user => {
                if (user) res.status(200).json(user)
            })
    }
)

//API update
//desc: mo ta, sua thong tin mot user
router.post('/update',
    (req, res) => {
        const { email, password, fullName, phone, DOB, userType } = req.body;

        User.findOne({ $or: [{ email }, { phone }] })
            .then(user => {
                if (!user) return res.status(400).json({
                    error: "Tai khoan khong ton tai"
                })

                user.password = password;
                user.fullName = fullName;
                user.DOB = DOB;
                user.userType = userType;

                bcrypt.genSalt(10, (err, salt) => {
                    if (err) return res.status(400).json(err)

                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) return res.status(400).json(err)

                        user.password = hash;
                        user.save()
                            .then(user => {
                                res.status(200).json(user)
                            })
                            .catch(err => res.status(400).json(err))
                    })
                })

            })
            .catch(err => res.status(400).json(err))
    }
)

//API delete
//desc: xoa mot user

router.post('/detele-user',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        User.findOneAndRemove(req.user.id)
            .then(user => res.status(200).json(user))
            .catch(console.log)
    }
)