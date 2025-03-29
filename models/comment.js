const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.ObjectId,
        ref: "blog"
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }
}, {timestamps: true}
);

const Comment = mongoose.model('comment',commentSchema);

module.exports = Comment;