const { getPool, sql } = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM productos');
    res.json(result.recordset);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM productos WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById };
