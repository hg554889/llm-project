const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Community", communitySchema);