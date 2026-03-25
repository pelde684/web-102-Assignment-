// controllers/userController.js

exports.getUsers = (req, res) => {
    res.json([{ id: 1, name: 'Pelden' }]);
};

exports.getUser = (req, res) => {
    const id = req.params.id;
    res.json({ id, name: 'Pelden' });
};

exports.createUser = (req, res) => {
    res.json({ message: 'User created' });
};

exports.updateUser = (req, res) => {
    const id = req.params.id;
    res.json({ message: `User ${id} updated` });
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    res.json({ message: `User ${id} deleted` });
};