import express, { Router } from 'express';
import adminController from '../controllers/adminCtrl';
import verifyToken from '../middleware/authAdminMiddleware';

const router: Router = express.Router();

router.get('/getAllUsers', verifyToken, adminController.getAllUsers);

router.get('/getUserDetails/:userId', verifyToken, adminController.getUserDetails);

router.put('/updateUser/:userId', verifyToken, adminController.updateUser);

router.delete('/deleteUser/:userId', verifyToken, adminController.deleteUser);

router.post('/addUser', verifyToken, adminController.addUser);

router.post('/login', adminController.login);

router.get('/verifyToken', adminController.verifyAdmin);


export default router;