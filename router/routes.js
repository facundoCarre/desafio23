const express = require('express');
const router = express.Router();
const controller = require('../api/messages');

router.get('/mensajes', async (req, res) => {
    try {
        let result = await controller.findAll();
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/mensajes/:id', async (req, res) => {
    try {
        let result = await controller.findById(req.params.id);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/mensajes', async (req, res) => {
    console.log(req.body)
    try {
        let result = await controller.create(req.body);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/mensajes/:id', async (req, res) => {
    try {
        let result = await controller.update(req.params.id, req.body);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.delete('/mensajes/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        let result = await controller.remove(req.params.id);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;