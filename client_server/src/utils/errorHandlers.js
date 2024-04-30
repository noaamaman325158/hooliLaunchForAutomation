const notFound = (req, res, next) => {
    res.status(404).send('Route does not exist');
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

module.exports = {
    notFound,
    errorHandler,
};
