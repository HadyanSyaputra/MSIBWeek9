const { generateToken, verifyToken } = require('../helpers/jwt');

module.exports = {
    authenticate: async (req, res, next) => {
        try {
            const accessToken = req.headers.access_token;
            const decoded = verifyToken(accessToken);
            const checkUser = await pool.query('SELECT * FROM public.users WHERE email = $1', [decoded.email]);

            if (checkUser) {
                req.role = checkUser.rows[0].role;
                next()
                return res.status(401).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'Success', result: checkUser.rows });

        } catch (err) {
            console.error('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    authorize: async (req, res, next) => {
        try {
            const isSupervisor = req.role === 'Supervisor'

            if(!isSupervisor) {
                throw new Error
            } else {
                next()
            }
        } catch (err) {
            next({name: 'Unauthorize'})
        }
    }
};
