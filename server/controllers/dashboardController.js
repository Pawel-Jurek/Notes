const Note = require('../models/Notes');
const mongoose = require('mongoose');

exports.dashboard = async (req, res) => {
    let perPage = 5;
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

exports.viewNote = async(req, res) => {
    const note = await Note.findById(req.params.id)
    .where({user: req.user.id}).lean();

    if (note) {
        res.render('dashboard/view-note', {
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        });
    } else {
        res.send("Something went wrong")
    }
}

exports.updateNote = async(req, res) => {
    try {
        await Note.findByIdAndUpdate(
            { _id: req.params.id },
            { 
                title: req.body.title,
                body: req.body.body,
                updatedAt: Date.now()
            } 
        ).where({user: req.user.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

exports.deleteNote = async(req, res) => {
    try {
        await Note.deleteOne({ _id: req.params.id })
        .where({user: req.user.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

exports.addNote = async(req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    })
}

exports.submitNote = async(req, res) => {
    try {
        await Note.create(
            { 
                title: req.body.title,
                body: req.body.body,
                user: req.user.id
            } 
        );
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

exports.search = async(req, res) => {
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: '../views/layouts/dashboard'
        })
    } catch (error){
        console.log(error);
    }
}

exports.submitSearch = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const cleanSearch = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const results = await Note.find({
            $or: [
                {title: {$regex:new RegExp(cleanSearch, 'i')}},
                {body: {$regex:new RegExp(cleanSearch, 'i')}}
            ]
        }).where({user: req.user.id});

        res.render('dashboard/search', {
            searchResults: results,
            layout: '../views/layouts/dashboard'
        })

    } catch (error){
        console.log(error);
    }
}