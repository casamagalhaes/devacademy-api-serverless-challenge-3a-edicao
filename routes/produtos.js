const router = require('express').Router();

/* Get All */
router.get('/produtos', (req, res) => {
	res.send('fake find all GET - produtos');
});

router.get('/produtos:id', (req, res) => {
  res.send()
})

/* Insert */
router.post('/produtos', (req, res) => {
	const produto = JSON.stringify(req.body);

	res.send(`successful insertion - product inserted : ${produto}`);
});

module.exports = router;
