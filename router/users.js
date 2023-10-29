const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { generateToken } = require('../helpers/jwt');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan daftar pengguna
 *     description: Mendapatkan daftar semua pengguna.
 *     responses:
 *       200:
 *         description: Daftar pengguna berhasil ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 */
router.get('/', (req, res) => {
    pool.query('SELECT * FROM public.users', (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Mendaftar pengguna baru
 *     description: Mendaftarkan pengguna baru.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *           example:
 *             id: "1"
 *             email: "user@example.com"
 *             gender: "male"
 *             password: "password123"
 *             role: "user"
 *     responses:
 *       201:
 *         description: Pengguna berhasil didaftarkan.
 *       500:
 *         description: Terjadi kesalahan server.
 */
router.post('/register', (req, res) => {
    const { id, email, gender, password, role } = req.body;
    const queryText = 'INSERT INTO public.users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5)';

    pool.query(queryText, [id, email, gender, password, role], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Data berhasil disimpan' });
        }
    });
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Masuk pengguna
 *     description: Mengizinkan pengguna masuk dengan email dan kata sandi.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Pengguna berhasil masuk.
 *       401:
 *         description: Email atau password salah.
 *       500:
 *         description: Terjadi kesalahan server.
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const queryText = 'SELECT * FROM public.users WHERE email = $1 AND password = $2';

    pool.query(queryText, [email, password], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const token = generateToken({ email: user.email, password: user.password });
                res.status(200).json({ access_token: token, result: user });
            } else {
                next({name: 'SignInError'});
            }
        }
    });
});

module.exports = router;
