const Note = require('../models/Notes');
const mongoose = require('mongoose');

exports.dashboard = async (req, res) => {
    let perPage = 8;
    let page = req.query.page || 1;
    
    const locals = {
        title: "Dashboard",
        description: "Node.js app"
    }
    try {
        const notes = await Note.aggregate([
          { $sort: { updatedAt: -1 } },
          { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
          {
            $project: {
              title: { $substr: ["$title", 0, 30] },
              body: { $substr: ["$body", 0, 100] },
            },
          }
          ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
    
        const count = await Note.countDocuments().exec();
    
        res.render('dashboard/index', {
          username: req.user.firstName,
          locals,
          notes,
          layout: "../views/layouts/dashboard",
          current: page,
          pages: Math.ceil(count / perPage)
        });
        
 
    } catch(error) {
        console.log(error);
    }
    
}