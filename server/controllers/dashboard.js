import {Router} from 'express';

import {authenticate} from '../middlewares/authMiddleware';

export default () => {
    let api = Router();

    // '/v1/dashboard'
    api.get('/', authenticate, (req, res) => {
        res.status(200).json({data: "Dashboard Data"});
    });

    return api;
}
