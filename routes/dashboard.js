const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/Post');


router.get('/counts', async (req, res) => {
    try {
        console.log("Fetching counts...");
        const activeCount = await Post.countDocuments({ active: true });
        const inactiveCount = await Post.countDocuments({ active: false });
        console.log("Counts fetched:", { activeCount, inactiveCount });
        res.json({ activeCount, inactiveCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
