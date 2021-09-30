const router = require('express').Router();
const cryptoJs = require('crypto-js');
const Cliente = require('../models/Cliente');

/* Get All Clientes */
router.get('/clientes', async (req, res) => {
	const filterName = req.query.filter;
	let clientes = [];

	const regex = new RegExp(`.*${filterName}.*`, 'i');
	const query = filterName ? { nome: regex } : null;

	try {
		if (filterName) {
			const clienteFound = await Cliente.find(query);
			clientes = clienteFound;
		} else {
			clientes = await Cliente.find();
		}

		res.status(200).json(clientes);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Get Cliente by Id */
router.get('/clientes/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const cliente = await Cliente.findById(id);
		res.status(200).json(cliente);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Insert Cliente */
router.post('/clientes', async (req, res) => {
	const { nome, email, password } = req.body;

	/* Creates a new Cliente */
	const newCliente = new Cliente({
		nome,
		email,
		password: cryptoJs.AES.encrypt(
			password,
			process.env.SECRET_PASS
		).toString(),
	});

	try {
		const insertedCliente = await newCliente.save();
		/* Successful insertion */
		res.status(201).json(insertedCliente);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Update Cliente */
router.put('/clientes/:id', async (req, res) => {
	try {
		const updatedCliente = await Cliente.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);

		res.status(500).json(updatedCliente);
	} catch (e) {
		res.status(500).json(e);
	}
});

/* Delete Cliente */
router.delete('/clientes/:id', async (req, res) => {
	try {
		await Cliente.findByIdAndDelete(req.params.id);
		res.status(200).json('Cliente deleted');
	} catch (e) {
		res.status(500).json(e);
	}
});

module.exports = router;
