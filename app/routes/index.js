/**
 * Main route rules
 * @param {koa} app - Koa appliacation
 * @param {helpers/passport} passport - Adapted passport module
 * @module routes
 */
module.exports = function routes(app, passport) {
    "use strict";

    const
        co   = require('co'),
        Router = require('koa-router'),
        authed = require('../helpers/authedMiddleware'),
        
        
    // Controllers
        indexController  = require('../controllers/indexController'),
        loginController  = require('../controllers/loginController'),
        secureController = require('../controllers/secureController');

    var router = new Router();

    router
        .get('/',          indexController.index)
        .get('/users',     indexController.list)
        .get('/users/:id', indexController.getId)
        .get('/goods/:id', goodsController.get) /* 200 - all ok, 404  not this food*/
        .post('/goods', goodsController.post) /* 201 can add foods, 400 - goods can`t add*/
        .del('/goods/:id', goodsController.delete) /* 204 - can dell food, 400 - can`t dell*/
        .get('/login',     loginController.login)
        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/secure',
                failureRedirect: '/login'
            })
        )
        .get('/logout', co.wrap(function*(ctx) {
            ctx.logout();
            ctx.redirect('/login')
        }))
        .get('/secure', authed, secureController.index);

    app.use(router.routes());
    app.use(router.allowedMethods({
        throw: true,
        notImplemented: () => new Boom.notImplemented(),
        methodNotAllowed: () => new Boom.methodNotAllowed()
    }));
};