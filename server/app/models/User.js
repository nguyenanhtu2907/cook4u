import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
    uuid: String,
    username: { type: String, required: true },
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    phone: { type: String, default: '' },
    password_hash: { type: String, default: '' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: 'https://lh3.googleusercontent.com/NKDVc76d3IHxblYEK7QrscuxzgCmnoaqeln76hEbx0LnjIZDmrNuraAP5qlphH0RDR8VxFEUHsGOWJSBVBGx4jFZ8XHRIu_Nkqr_rCgoOiSLSAA4MF_y89vwrLbkn0pFA1-WL5WEvsW3Q3flaaV3TDjFbTDJH-wdT0WVBAHoq5db1Jyk2iqO-BXLgNSCpBSoP1hQJ1eB3v7D4K9Rn6ts3Bh6HKwcmUef6egsjUUuTCOg3v-yKdLMgtPVwsU4ct20ezJ6JT-8gm6xKmHBFq9aSZ03F-vwIAkYX1Xs9JcQQqOSnAvt1OsNGFTlL1aJvt5tO_JAJgrVxk_Y_wIF_NsOt923DBBw4llkrsLrk7hOVVu7OerYtakPxCkSLEY7U4XVkjVUIabD4_NdXiOyxE6kdnR5bZ7AJUS9921cWckqDwjJxjyiXd4hgf4Kr780O6MPqcDFcg_WEgv7ytZHSwWGRb0LKSiU-zht0HPZQ7Y8y3r03yOwJ5taYtbwXTVHStNf4lQ56gTdvI08-QyxbDFsPsmyaO5rnksh_rB1cTnLPbP8GmRmJFKoD4HfMwGlJuM3vRL_OC5dLZOpcDM8YoF0K7G0r9_CWKa-247NZbhb7o8kkqetj_eMu_ktObB6zqE1H_p4yzNMMxbvqI5n32b-CEKWuQSQUrepajA0seUzVsKENmNopUQwOSoQJaz4=s937-no?authuser=0' },
    posts: Number,
    liked_posts: { type: Array, default: [] },
    likedPosts: Array,
    following: { type: Array, default: [] },
    followed: { type: Array, default: [], },
    isReported: {type: Boolean, default: false},
    level: {type: String, default: 'user'},
},{
    timestamps: true,
})

export default mongoose.model('User', User);