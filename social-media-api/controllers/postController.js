exports.getPosts = (req, res) => {
    res.json([{ id: 1, title: 'First Post', author: 'Pelden' }]);
};

exports.getPost = (req, res) => {
    const id = req.params.id;
    res.json({ id, title: `Post ${id}`, author: 'Pelden' });
};

exports.createPost = (req, res) => {
    res.json({ message: 'Post created', author: 'Pelden' });
};

exports.updatePost = (req, res) => {
    const id = req.params.id;
    res.json({ message: `Post ${id} updated`, author: 'Pelden' });
};

exports.deletePost = (req, res) => {
    const id = req.params.id;
    res.json({ message: `Post ${id} deleted`, author: 'Pelden' });
};