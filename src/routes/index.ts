import { Router } from 'express';
import basicAuth from './basicAuth';

const router = Router();

router.use('/authentication', basicAuth);
router.get('/', async (req, res) => {
  res.send(`Welcome to SUMADI MANAGEMENT SITE<br>Environment: <b>${process.env.DEBUG === 'true' ? 'DEVELOPMENT' : 'PRODUCTION'}<b>`);
});

export default router;
