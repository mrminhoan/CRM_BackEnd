const express = require('express')
const { requireSignin, adminMiddleware, userMiddleware } = require('../../common-middleware/MiddleWare')
const { signup, signin, createUser, userSendMail, updateUser } = require('../../controller/user/user.Controller')
const { validateSignInRequest, isRequestValidated, validatesSignUpRequest } = require('../../validators/user_Validators')
const router = express.Router()
const path = require('path')
const multer = require('multer');
const shortid = require('shortid');

// __dirname: đường dẫn tới thư mục chứa file đang thực thi lệnh dirname
// path.dirname(__dirname): dẫn tới thư mục chứa thư  mục mà chưa file đang thực thi lệnh dirname
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //   cb(null, path.resolve(__dirname, '../uploads'))
        cb(null, path.join(path.dirname(__dirname), '../upload'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post('/signup', validatesSignUpRequest, isRequestValidated, signup)
router.post('/signin', validateSignInRequest, isRequestValidated, signin)
router.post('/update-user', requireSignin, userMiddleware, upload.single('avatar'), updateUser)
router.post('/send-mail', requireSignin, userSendMail)

module.exports = router