const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController');
const assistantController = require('../controllers/assistantController');
const needHelpController = require('../controllers/needHelpController');
const pointHelpController = require('../controllers/pointHelpController');
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-Middleware');
const commentController = require('../controllers/commentController');
const fileMideeleware = require('../middlewares/file-mideeleware');
const rolemoderMiddelware = require('../middlewares/rolemoder-middelware');
const validationMiddlevare = require('../middlewares/validation-middlevare');
const { validationResult } = require('express-validator');
const blogController = require('../controllers/blogController');

router.post('/registration',
    body('nick').isLength({ min: 3, max: 15 }).withMessage('Nick length must be between 3 and 15'),
    body('email').isEmail().withMessage('Email entered incorrectly'),
    body('password').isLength({ min: 5, max: 15 }).withMessage('Password length must be between 5 and 15'),
    validationMiddlevare,
    userController.registration);

router.post('/login',
    body('email').isEmail().withMessage('Email entered incorrectly'),
    body('password').isLength({ min: 2, max: 15 }).withMessage('Password length must be between 2 and 15'),
    validationMiddlevare,
    userController.login)

router.get('/auth', authMiddleware, userController.check)
router.post('/logout', userController.logout);
router.get('/getRole', authMiddleware, userController.getRole)
router.get('/activate/:link', userController.activate);
router.post('/tryremovepassword', userController.tryremovepassword);
router.post('/removepassword', userController.removepassword);

router.get('/getAsistant', assistantController.getAsistant)
router.get('/getOneAsistant/:id', assistantController.getOneAsistant)
router.get('/getAsistPerson', authMiddleware, assistantController.getAsistPerson)
router.post('/deleteassist', authMiddleware, assistantController.deleteassist)
router.post('/updateOneAsistant/:id',
    body('name').isLength({ min: 2, max: 15 }).withMessage('Nick length must be between 2 and 15'),
    body('phone').isMobilePhone().withMessage('Enter phone number'),
    body('description').notEmpty().withMessage('Can not be empty'),
    body('city').notEmpty().withMessage('Can not be empty'),
    body('email').isEmail().withMessage('Email entered incorrectly'),
    body('title').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    assistantController.updateOneAsistant)

router.post('/addAsistant',
    body('name').isLength({ min: 2, max: 15 }).withMessage('Nick length must be between 2 and 15'),
    body('phone').isMobilePhone().withMessage('Enter phone number'),
    body('description').notEmpty().withMessage('Can not be empty'),
    body('city').notEmpty().withMessage('Can not be empty'),
    body('email').isEmail().withMessage('Email entered incorrectly'),
    body('title').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    assistantController.addAsistant)

router.post('/upload', fileMideeleware.single('picture'), assistantController.addAt)

router.post('/deleteneedhelp', authMiddleware, needHelpController.deleteneedhelp)
router.post('/addNeedHelp',
    body('name').isLength({ min: 2, max: 15 }).withMessage('Nick length must be between 2 and 15'),
    body('phone').isMobilePhone().withMessage('Enter phone number'),
    body('description').notEmpty().withMessage('Can not be empty'),
    body('city').notEmpty().withMessage('Can not be empty'),
    body('secondName').notEmpty().withMessage('Email entered incorrectly'),
    body('listThings').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    needHelpController.addNeedHelp)

router.post('/updatepost/:id',
    body('name').isLength({ min: 2, max: 15 }).withMessage('Nick length must be between 2 and 15'),
    body('phone').isMobilePhone().withMessage('Enter phone number'),
    body('description').notEmpty().withMessage('Can not be empty'),
    body('city').notEmpty().withMessage('Can not be empty'),
    body('secondName').notEmpty().withMessage('Email entered incorrectly'),
    body('listThings').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    needHelpController.updatepost)

router.get('/getNeedHelpPerson', authMiddleware, needHelpController.getNeedHelpPerson)

router.get('/getAllNeedHelp', needHelpController.getAllNeedHelp)
router.get('/getOneNeedHelp/:id', needHelpController.getOneNeedHelp)

router.get('/getAllPointHelp', pointHelpController.getAllPointHelp)
router.get('/getOnePointHelp/:id', pointHelpController.getOnePointHelp)

router.post('/addPointHelp',
    body('name').isLength({ min: 2, max: 15 }).withMessage('Nick length must be between 2 and 15'),
    body('nameBoss').isLength({ min: 2, max: 15 }).withMessage('NameBoss length must be between 2 and 15'),
    body('phone').isMobilePhone().withMessage('Enter phone number'),
    body('description').notEmpty().withMessage('Can not be empty'),
    body('city').notEmpty().withMessage('Can not be empty'),
    body('region').notEmpty().withMessage('Can not be empty'),
    body('address').notEmpty().withMessage('Can not be empty'),
    body('email').isEmail().withMessage('Email entered incorrectly'),
    body('listThings').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    rolemoderMiddelware,
    pointHelpController.addPointHelp)

router.post('/requesetaddPointHelp',
    body('name').isLength({ min: 2, max: 15 }).withMessage('Nick length must be between 2 and 15'),
    body('nameBoss').isLength({ min: 2, max: 15 }).withMessage('NameBoss length must be between 2 and 15'),
    body('phone').isMobilePhone().withMessage('Enter phone number'),
    body('description').notEmpty().withMessage('Can not be empty'),
    body('city').notEmpty().withMessage('Can not be empty'),
    body('region').notEmpty().withMessage('Can not be empty'),
    body('address').notEmpty().withMessage('Can not be empty'),
    body('email').isEmail().withMessage('Email entered incorrectly'),
    body('listThings').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    pointHelpController.requesetaddPointHelp)

router.post('/addComment',
    body('text').notEmpty().withMessage('Email entered incorrectly'),
    body('timeCreate').notEmpty().withMessage('Can not be empty'),
    validationMiddlevare,
    authMiddleware,
    commentController.CreateComment)

router.get('/getComment', commentController.GetComments)
router.post('/grade/:id', authMiddleware, commentController.grade)
router.post('/getmark/:id', authMiddleware, commentController.getmark)
router.get('/getDialog',authMiddleware, userController.getDialog);
router.get('/allDialogs',authMiddleware, userController.allDialogs);
router.get('/generalchatinformation',authMiddleware, userController.generalchatinformation);

router.get('/generalchat',authMiddleware, userController.Generalchat);

router.get('/ProfileInformation',authMiddleware,userController.ProfileInformation);
router.post('/changeNick',authMiddleware,userController.changeNick);
router.post('/changeEmail',authMiddleware,userController.changeEmail);
router.post('/changePassword',authMiddleware,userController.changePassword);

router.post('/sendAnswer',authMiddleware,commentController.sendAnswer);

router.post('/changeavatar',authMiddleware,userController.changeAvatar);

router.get('/getposts', pointHelpController.getposts);


router.post('/blogpost',authMiddleware,blogController.postblogpost);
router.get('/blogpost',blogController.getblogpost);
router.get('/oneblogpost',blogController.getoneblogpost);


module.exports = router