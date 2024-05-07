exports.dashboard = async (req, res) => {
    const locals = {
        title: "Dashboard",
        description: "Node.js app"
    }
    res.render('dashboard/index', {
        locals,
        layout: '../views/layouts/dashboard'
    });
}