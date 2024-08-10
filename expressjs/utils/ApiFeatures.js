

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    filter() {
        let queryString = JSON.stringify(this.queryStr)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        const queryObj = JSON.parse(queryString)
        
        delete queryObj.sort
        delete queryObj.fields
        delete queryObj.page
        delete queryObj.limit

        this.query = this.query.find(queryObj)
        return this
    }

    sort() {
        if(this.queryStr.sort) {
            console.log(this.queryStr.sort)
            const sortby = this.queryStr.sort.split(',').join(' ')
            console.log(sortby)
            this.query = this.query.sort(sortby)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if(this.queryStr.fields) {
            const queryfields = this.queryStr.fields.split(',').join(' ')
            this.query.select(queryfields)
        } else {
            this.query.select('-__v')
        }
        return this
    }

    paginate() {
        let page = +this.queryStr.page || 1
        let limit = +this.queryStr.limit || 5
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit).sort('name')

        // if(this.queryStr.page) {
        //     const movieCount = await Movie.countDocuments()
        //     if(skip >= movieCount) {
        //         throw new Error('No more movies last')
        //     }
        // }
        return this
    }
}


module.exports = ApiFeatures