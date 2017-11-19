import { Router } from 'express';
import User from '../models/user';
import passport from 'passport';

import {generateAccessToken, respond, authenticate} from '../middlewares/authMiddleware';

export default () => {
    let api = Router();

    // '/v1/account'
    api.get('/', (req, res) => {
        res.status(200).send({ user: req.user });
    });

    // '/v1/account/register'
    api.post('/register', (req, res) => {
        User.register(new User({ username: req.body.email}), req.body.password, function(err, user) {
            if (err) {
                return res.status(500).send('An error occurred: ' + err);
            }

            passport.authenticate(
                'local', {
                    session: false
                })(req, res, () => {
                res.status(200).send('Successfully created new account');
            });
        });
    });

    // '/v1/account/login'
    api.post('/login', passport.authenticate(
        'local', {
            session: false,
            scope: []
        }), generateAccessToken, respond);

    // '/v1/account/logout'
    api.get('/logout', authenticate, (req, res) => {
        req.logout();
        res.status(200).send('Successfully logged out');
    });

    api.get('/me', authenticate, (req, res) => {
        res.status(200).json(req.user);
    });

    return api;
}
