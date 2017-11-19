import express from 'express';
import account from "../controllers/account";
import dashboard from "../controllers/dashboard";

let router = express();

// // api routes v1 (/v1)
router.use('/dashboard', dashboard());
router.use('/account', account());

export default router;
