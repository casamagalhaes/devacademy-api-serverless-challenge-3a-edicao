const router = require('express').Router();

/* Get All */
router.get('/produtos', (req, res) => {
	res.send('fake find all GET - produtos');
});

/* Insert */
router.post('/produtos', (req, res) => {
	const produto = JSON.stringify(req.body);

	res.send(`successful insertion - product inserted : ${produto}`);
});

module.exports = router;
