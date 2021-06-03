export const multipleMongooseToObj = function (mongooses) {
    return mongooses.map(mongoose => mongoose.toObject());
}
export const mongooseToObj = function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
}

