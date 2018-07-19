const Memcached = require('memcached'),
    memcached = new Memcached('127.0.0.1:11211');
goodsID = [0];

async function getGoodsId(ctx, next) {
    try {
        await memcached.get(ctx.params.id, function (err, data) {
            err ? ctx.status = 404 : ctx.status = 200;
            console.log(data);

            console.log(ctx.status);
            return data;
        });
        await next();
    }
    catch (e) {
        console.log(e);
        ctx.status = 404;
    }
}

async function postGoods(ctx, next) {
    try {

        await memcached.set(goodsID[goodsID.length-1], ctx.request.body, 7200, function (err) {
            if (err){
                ctx.status = 400;
                ctx.throw(400, "Bad Request");
            }else {
                console.log(goodsID);
                ctx.body = "Created";
                ctx.status = 201;
                console.log(ctx.status);
            }
            goodsID.push(goodsID[goodsID.length-1] + 1);
        });
        await next();
    } catch (e) {
        ctx.status = 400;
    }
}

async function deleteGoods(ctx, next) {
    try {
        await memcached.del(ctx.params.id, function (err) {
            err ? ctx.status = 400 : ctx.status = 204;
            console.log(ctx.status);
        });
        await next();
    } catch (e) {
        console.log(e);
        ctx.status = 400;
    }

}

module.exports = {getGoodsId, deleteGoods, postGoods};
