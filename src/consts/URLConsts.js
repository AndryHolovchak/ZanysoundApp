const DZ_APP_ID = process.env.NODE_ENV == "production" ? "460442" : "457842";
const DefaultCoverUrl = "/public/images/default-cover.jpg";

console.log(process.env.NODE_ENV);
module.exports = { DZ_APP_ID, DefaultCoverUrl };
