require('express-async-errors');
const express = require('express');
const cors = require('cors');
const produtosRoutes = require('./src/routes/produtos');
const clientesRoutes = require('./src/routes/clientes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  return res.status(403).json({ error: err.message });
});

app.use('/clientes', clientesRoutes);
app.use('/produtos', produtosRoutes);

module.exports = { app };
