exports.homepage = async (req, res) => {
    const locals = {
        title: "Notes",
        description: "Node.js app"
    }
    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });
}

exports.about = async (req, res) => {
    const locals = {
        title: "About - Notes",
        description: "Node.js app"
    }
    res.render('about', locals);
}