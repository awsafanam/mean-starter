import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

let User = new Schema({
    email: String,
    password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
