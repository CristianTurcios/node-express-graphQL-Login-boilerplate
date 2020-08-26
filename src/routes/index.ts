import { Router } from 'express';
import basicAuth from './basicAuth';

const router = Router();

router.use('/authentication', basicAuth);
router.get('/', async (req, res) => {
  res.send('Welcome');
});

export default router;
