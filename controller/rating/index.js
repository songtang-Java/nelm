const RatingModel = require('../../database/model/ugc/rating');
const Base = require('../../utils/baseConfig');

class Rating extends Base {
    constructor (props) {
        super(props);
        this.type = ['ratings', 'scores', 'tags'];
    }

    async initData(restaurantId) {
        try {
            const status = await RatingModel.initData(restaurantId);
            if (status) {
                console.log('初始化评论数据成功');
            }
        } catch (err) {
            console.log('初始化评论数据失败');
            throw new Error(err);
        }
    }

    async getRating (req, res, next) {
        const restaurant_id = req.query.restaurant_id;
        this.verifySingleParam(restaurant_id, '餐馆ID参数错误');
        try {
            const ratings = await RatingModel.getData(restaurant_id, this.type[0]);
            this.json(200, 'success', ratings);
        } catch (err) {
            console.log('获取评论列表失败 catch err', err);
            this.json(400, '获取评论列表失败 catch err', {});
        }
    }

    async getScores (req, res, next) {
        const restaurant_id = req.query.restaurant_id;
        this.verifySingleParam(restaurant_id, '餐馆ID参数错误');
        try {
            const scores = await RatingModel.getData(restaurant_id, this.type[1]);
            this.json(200, 'success', scores);
        } catch (err) {
            console.log('获取评论分数失败 getScores catch err', err);
            this.json(400, '获取评论分数失败 getScores catch err', {});
        }
    }

    async getTags (req, res, next) {
        const restaurant_id = req.query.restaurant_id;
        this.verifySingleParam(restaurant_id, '餐馆ID参数错误');
        try {
            const tags = await RatingModel.getData(restaurant_id, this.type[2]);
            this.json(200, 'success', tags);
        } catch (err) {
            console.log('获取评论标签失败 getTags catch err', err);
            this.json(400, '获取评论标签失败 getTags catch err', {});
        }
    }
}

module.exports = Rating;
