const express = require('express');

const router = express.Router();

router.get("/traducirJS", (req, res) => {
    res.json({mensaje:'hola'})
})

module.exports = router;