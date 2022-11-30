const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;