import * as express from 'express';
import { login, register } from '../controllers/authController';
// import { login } from '../controllers/loginController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/compliance', login);

export default router;