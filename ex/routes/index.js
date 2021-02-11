const express = require('express');
const { Todo } = require('../models');



const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        if(req.user) {
            const todos = await Todo.findAll({ where: { UserId: req.user.id } });
            res.render('main', {
                title: 'TODOLIST',
                todos,
            });
            console.log(todos);
        } else {
            res.render('main');
        }
        
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/todo', async (req, res, next) => {
    const { content } = req.body;
    try {
        await Todo.create({
            content: content,
            UserId: req.user.id,
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/success/:id', async(req, res, next) => {
    try {
        await Todo.update({
            success: true,
        }, {
            where: {id: req.params.id},
        });
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/delete/:id', async(req, res, next) => {
    try {
        await Todo.destroy({ where: { id: req.params.id } });
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;