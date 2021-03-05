import mongoose from 'mongoose';
import  slug from 'mongoose-slug-generator';

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Post = new Schema({
    title: String,
    author: Object,
    thumbnail: {type: String, default: ''},
    ration: Number,
    time: Number,
    description: String,
    ingredients: {type: Array, default: []},
    steps: {type: Array, default: []},
    likes: {type: Array, default: []},
    comments: {type: Array, default: []},
    slug: {type: String, slug: 'title', unique: true},
    key: String,
    isReported: {type: Boolean, default: false},
}, {
    timestamps: true,
})
Post.index({ key: 'text' });

export default mongoose.model('Post', Post);
