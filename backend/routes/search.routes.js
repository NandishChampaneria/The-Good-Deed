import express from 'express';

import { searchEvents } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', searchEvents);

export default router;