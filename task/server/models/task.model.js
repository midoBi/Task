const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({

    name: {type: String, require: true},
    description: {type: String},
    status: {type: Boolean, default: true},
    createdAt: {
        type: Date,
        default: Date.now
    },

});


module.exports = mongoose.model('Task', TaskSchema);
