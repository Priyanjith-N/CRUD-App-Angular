import express, { Router } from 'express';
import userController from '../controllers/userCtrl';
import verifyToken from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post('/user',userController.loginUser);

router.post('/createUser', userController.createUser);

router.get('/verifyToken',userController.verifyUser);

router.get('/getUser', verifyToken, userController.getUser);

router.put('/updateUser', verifyToken, userController.updateUser);


export default router;