const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/Post');


router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const { title, body, active, latitude, longitude } = req.body;
    try {
        const newPost = new Post({
            title,
            body,
            createdBy: req.user._id,
            active,
            geoLocation: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const posts = await Post.find({ createdBy: req.user._id });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { title, body, active, latitude, longitude } = req.body;
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                body,
                active,
                geoLocation: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            },
            { new: true }
        );
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.deleteOne();
        res.json({ msg: 'Post Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/location/:latitude/:longitude', async (req, res) => {
    const { latitude, longitude } = req.params;
    try {
        const posts = await Post.find({
            'geoLocation.coordinates': [parseFloat(longitude), parseFloat(latitude)]
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
