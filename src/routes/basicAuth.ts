import { Router } from 'express';
import {
  test,
  login,
  register,
  verifyEmail,
  refreshToken,
  forgotPassword,
  changePassword,
  validateResetToken,
} from '../controllers/basicAuth';
import verifyToken from '../middleware/authorize';
import verifyUserRole from '../middleware/verifyUserRole';

const router = Router();
router.post('/login', login);
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);
router.post('/validate-reset-token', validateResetToken);
router.get('/', [verifyToken, verifyUserRole(['Admin', 'Editor'])], test);
// router.post('/revoke-token', revokeToken); // Esta necesita ser validada con autorizacion

export default router;
