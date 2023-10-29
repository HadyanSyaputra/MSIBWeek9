const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

router.use(authorize);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Mendapatkan daftar film
 *     description: Mendapatkan daftar film dengan pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman.
 *     responses:
 *       200:
 *         description: Daftar film berhasil ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 */
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const perPage = 10;


    const offset = (page - 1) * perPage;

    pool.query(
        'SELECT * FROM public.movies OFFSET $1 LIMIT $2',
        [offset, perPage],
        (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                res.status(500).send('Internal Server Error');
            } else {
                const rows = result.rows;
                res.json(rows);
            }
        }
    );
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Menyimpan data film
 *     description: Menyimpan data film ke database.
 *     parameters:
 *       - in: body
 *         name: movie
 *         description: Data film yang akan disimpan.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             title:
 *               type: string
 *             genres:
 *               type: array
 *             year:
 *               type: integer
 *     responses:
 *       201:
 *         description: Data berhasil disimpan.
 *       500:
 *         description: Terjadi kesalahan server.
 */

router.post('/', (req, res) => {
    const { id, title, genres, year } = req.body;

    const queryText = 'INSERT INTO public.movies (id, title, genres, year) VALUES ($1, $2, $3, $4)';

    pool.query(queryText, [id, title, genres, year], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).json({ message: 'Data berhasil disimpan' });
        }
    });
});

/**
 * @swagger
 * /movies/{moviesId}:
 *   put:
 *     summary: Mengupdate data film
 *     description: Mengupdate data genre film berdasarkan ID film.
 *     parameters:
 *       - in: path
 *         name: moviesId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID film yang akan diupdate.
 *       - in: body
 *         name: genres
 *         description: Data genre film yang akan diupdate.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             genres:
 *               type: array
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Data not found.
 *       500:
 *         description: Terjadi kesalahan server.
 */

router.put('/:moviesId', (req, res) => {
    const { genres } = req.body;
    const { moviesId } = req.params;

    const queryText = 'UPDATE public.movies SET genres = $1 WHERE id = $2';

    pool.query(queryText, [genres, moviesId], (err, result) => {
        if (err) {
            console.error('Error executing query', err);

            if (err.message.includes('Data not found')) {
                next({name: 'notFound'});
            } else if (err.message.includes('Unauthorized')) {
                next({name: 'Unauthorize'});
            } else {
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(200).json({ message: 'Success' });
        }
    });
});

/**
 * @swagger
 * /movies/{moviesId}:
 *   delete:
 *     summary: Menghapus data film
 *     description: Menghapus data film berdasarkan ID film.
 *     parameters:
 *       - in: path
 *         name: moviesId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID film yang akan dihapus.
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Data not found.
 *       500:
 *         description: Terjadi kesalahan server.
 */

router.delete('/:moviesId', (req, res) => {
    const { moviesId } = req.params;

    const queryText = 'DELETE FROM public.movies WHERE id = $1';

    pool.query(queryText, [moviesId], (err, result) => {
        if (err) {
            console.error('Error executing query', err);

            if (err.message.includes('Data not found')) {
                next({name: 'notFound'});
            } else if (err.message.includes('Unauthorized')) {
                next({name: 'Unauthorize'});
            } else {
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(200).json({ message: 'Success' });
        }
    });
});

module.exports = router;
