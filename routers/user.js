const { signup, login, user, updateUser, deleteUser, getProfile } = require('../controllers/user');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: User signup
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1995-06-25
 *                 description: Date of birth in YYYY-MM-DD format
 *             required:
 *               - name
 *               - email
 *               - password
 *               - dob
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */

router.post('/signup', signup);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/user', auth, user);

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               dob:
 *                 type: string
 *                 example: "12-02-2000"
 *               country_code:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               interests:
 *                 type: string
 *               about_me:
 *                 type: string
 *               looking_for:
 *                 type: string
 *               age_from:
 *                 type: integer
 *               age_to:
 *                 type: integer
 *               weight:
 *                 type: number
 *               race:
 *                 type: string
 *               height:
 *                 type: number
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               profilePic:
 *                 type: string
 *                 format: binary
 *               otherPics:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/user', auth, upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'otherPics', maxCount: 5 }
]), updateUser);

/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */

router.delete('/user', auth, deleteUser);

/**
 * @swagger
 * /api/allusers:
 *   get:
 *     summary: Get all user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/allusers',getProfile);

module.exports = router;