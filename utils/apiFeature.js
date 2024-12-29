class APIFeature {
    constructor(query, queryStr, querySkip) {
        this.query = query
        this.queryStr = queryStr
        this.querySkip = querySkip
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            product_name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        // console.log(keyword)

        this.query = this.query.find({...keyword}).sort({create_time:-1}).skip(this.querySkip).limit(6).select('+create_time').lean()
        return this

    }
}

module.exports = APIFeature