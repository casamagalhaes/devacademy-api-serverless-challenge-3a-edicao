const { BSONType } = require('mongodb');
const moongose = require('mongoose');

const ProdutosSchema = new moongose.Schema(
	{
		id: { type: String, required: true, unique: true },
		nome: { type: String, required: true },
		preco: { type: BSONType, required: true },
	},
	{ timestamps: true }
);

module.exports = moongose.model('Produtos', ProdutosSchema);
