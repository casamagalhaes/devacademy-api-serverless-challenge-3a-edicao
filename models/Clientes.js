const { BSONType } = require('mongodb');
const moongose = require('mongoose');

const ClientesSchema = new moongose.Schema(
	{
		id: { type: String, required: true, unique: true },
		nome: { type: String, required: true },
		preco: { type: BSONType, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = moongose.Schema('Clientes', ClientesSchema);
