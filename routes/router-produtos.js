const router = require('express').Router();
const Produto = require('../models/Produto');

/* Get All Produtos */
router.get('/produtos', async (req, res) => {
	const filterName = req.query.filter;
	let produtos = [];

	const regex = new RegExp(`.*${filterName}.*`, 'i');
	const query = filterName ? { nome: regex } : null;

	try {
		produtos = await Produto.find(query);
		res.status(200).json(produtos);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Get Produto by Id */
router.get('/produtos/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const produto = await Produto.findById(id);
		res.status(200).json(produto);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Insert Produto */
router.post('/produtos', async (req, res) => {
	const { nome, preco } = req.body;

	/* Creates a new Produto */
	const newProd = new Produto({
		nome,
		preco,
	});

	try {
		const insertedProd = await newProd.save();
		/* Successful insertion */
		res.status(201).json(insertedProd);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Update Produto */
router.put('/produtos/:id', async (req, res) => {
	try {
		const updatedProd = await Produto.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);

		res.status(500).json(updatedProd);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Delete Produto */
router.delete('/produtos/:id', async (req, res) => {
	try {
		await Produto.findByIdAndDelete(req.params.id);
		res.status(200).json('Produto deleted');
	} catch (e) {
		res.status(500).json(e);
	}
});

module.exports = router;
