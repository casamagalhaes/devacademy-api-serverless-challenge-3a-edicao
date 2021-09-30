const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema(
	{
		nome: { type: String, required: true },
		preco: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Produtos', ProdutoSchema);
