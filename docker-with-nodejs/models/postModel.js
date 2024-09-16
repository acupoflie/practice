const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, "Need title"]
    },
    body: {
        type: String,
        required: [true, "Body need"]
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports=Post