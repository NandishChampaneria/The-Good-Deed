import express from 'express';

import { searchEventsAndOrganizations } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', searchEventsAndOrganizations);

export default router;