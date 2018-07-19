const Memcached = require('memcached'),
    memcached = new Memcached('127.0.0.1:11211');
let dat;
goodsID = [0];


async function getGoodsId(ctx, next) {
    try {
        ctx.body = await memcached.get(ctx.params.id, function (err, data) {
            console.log(data);
            dat = data;
        });
        dat == null ? ctx.status = 404 : ctx.status = 200;
        await next();
    }
    catch (e) {
        console.log(e);
    }
}

async function postGoods(ctx, next) {
    try {

        await memcached.set(goodsID[goodsID.length - 1], ctx.request.body, 7200, function (err) {
            console.log(goodsID[goodsID.length - 1]);
            goodsID.push(goodsID[goodsID.length - 1] + 1);
        });
        ctx.body = "Created";
        ctx.status = 201;
        await next();
    } catch (e) {
        ctx.status = 400;
        ctx.throw(400, "Bad Request");
    }
}

async function deleteGoods(ctx, next) {
    try {
        await memcached.del(ctx.params.id, function (err) {
        });
        ctx.body = "NO CONTENT";
        ctx.status = 204;
        await next();
    } catch (e) {
        console.log(e);
        ctx.status = 400;
        ctx.throw(400, "Bad Request");
    }

}

module.exports = {getGoodsId, deleteGoods, postGoods};
