const Accounts = require('./accounts-model');

async function checkAccountId(req, res, next) {
  try {
    const account = await Accounts.getById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "account not found" });
    }
    req.account = account;
    next();
  } catch (err) {
    next(err);
  }
}

function checkAccountPayload(req, res, next) {
  let { name, budget } = req.body;

  if (typeof name !== 'string' || name.trim().length === 0 || budget === undefined) {
    return res.status(400).json({ message: "name and budget are required" });
  }

  const trimmedName = name.trim();
  const numericBudget = Number(budget);

  if (
    budget === null ||
    typeof budget === 'boolean' ||
    budget === '' ||
    Number.isNaN(numericBudget)
  ) {
    return res.status(400).json({ message: "budget must be a number" });
  }

  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return res.status(400).json({ message: "name must be between 3 and 100 chars" });
  }

  if (numericBudget < 0 || numericBudget > 1000000) {
    return res.status(400).json({ message: "budget cannot be negative or too large or too small" });
  }

  req.body.name = trimmedName;
  req.body.budget = numericBudget;
  next();
}

async function checkAccountNameUnique(req, res, next) {
  try {
    const { name } = req.body;
    const currentId = req.params.id ? parseInt(req.params.id) : null;

    const existingAccount = await Accounts.getByName(name);

    if (existingAccount && existingAccount.id !== currentId) {
      return res.status(400).json({ message: "name is taken" });
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkAccountId,
  checkAccountPayload,
  checkAccountNameUnique,
};