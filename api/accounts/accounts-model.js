const db = require('../../data/db-config');

const getAll = () => {
  return db('accounts');
};

const getById = async id => {
  return db('accounts').where('id', id).first();
};

const getByName = async name => {
  return db('accounts').where('name', name).first();
};

const create = async account => {
  const [id] = await db('accounts').insert(account);
  if (!id) throw new Error('Insert failed');
  return getById(id);
};

const updateById = async (id, account) => {
  const count = await db('accounts').where('id', id).update(account);
  if (count === 0) return null;
  return getById(id);
};

const deleteById = async id => {
  const deleted = await getById(id);
  if (!deleted) return null;

  const count = await db('accounts').where('id', id).delete();
  if (count === 0) return null;

  return deleted;
};

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  updateById,
  deleteById,
};