import express from "express";
import db, { ColumnInfo } from "../db";

import Form from "../templates/form";

const router = express.Router();

// Create a better method for this
router.get('/:res', (req, res) => {
    // Temporary
    const headers = (db.pragma("table_info(sample)") as ColumnInfo[])
        .filter(col => !col.pk);
    
    switch(req.params["res"]) {
        case "form":
            res.send(Form.build({ headers: headers }));
            break;
        default:
            res.sendStatus(404);
    }
});

export default router;