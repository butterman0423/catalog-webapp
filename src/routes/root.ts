import express from 'express';

import Table from '../templates/table';

// Serve rendered html files

const router = express.Router();

router.get("/", (_req, res) => {
    res.redirect("/home/");
})

router.get("/home/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Catalog</title>
                <link rel="stylesheet" type="text/css" href="/styles/style.css"/>
            </head>
            <body>
                ${Table.build()}
            </body>
        </html>
    `);
})

export default router;