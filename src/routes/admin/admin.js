const express = require('express')
const { createUser,
    employeeSignin,
    deleteUser,
    updateUser,
    getUser,
    getUserBySlug,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    getEmployeeBySlug,
    createAdmin,
    employeeSendMail } = require('../../controller/admin/admin.Contronller')
const router = express.Router()
const { validatesSignUpRequest, isRequestValidated, validateSignInRequest } = require('../../validators/user_Validators');
const { requireSignin, adminMiddleware, employeeMiddleware } = require('../../common-middleware/MiddleWare');
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



router.post('/admin/create-admin', createAdmin)
router.post('/admin/signin', employeeSignin)

router.post('/admin/create-user', requireSignin, employeeMiddleware, upload.single('avatar'), createUser)
router.post('/admin/delete-user', requireSignin, adminMiddleware, deleteUser)
router.post('/admin/update-user', requireSignin, employeeMiddleware, upload.single('avatar'), updateUser)
router.get('/admin/get-all-user', requireSignin, employeeMiddleware, getUser)
router.post('/admin/get-user/:slug', requireSignin, employeeMiddleware, getUserBySlug)
router.post('/admin/send-mail', requireSignin, employeeMiddleware, employeeSendMail)

router.post('/admin/create-employee', requireSignin, adminMiddleware, createEmployee)
router.post('/admin/update-employee', requireSignin, employeeMiddleware,updateEmployee)
router.post('/admin/delete-employee', requireSignin, adminMiddleware, deleteEmployee)
router.get('/admin/get-all-employee', requireSignin, adminMiddleware, getEmployee)
router.get('/admin/get-employee/:slug', requireSignin, adminMiddleware, getEmployeeBySlug)

module.exports = router