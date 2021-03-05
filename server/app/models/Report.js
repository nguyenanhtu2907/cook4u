import mongoose from 'mongoose';
import  slug from 'mongoose-slug-generator';

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Report = new Schema({
    uuid: String,
    type: String,
    target: String,
    userReport: String,
}, {
    timestamps: true,
})

export default mongoose.model('Report', Report);