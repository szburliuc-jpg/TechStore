import * as comenziService from '../services/comenzi.service.js';
import { validateComanda, validateStatus } from '../validators/comanda.validator.js';
import { parseId } from '../utils/parseId.js';

export const list = async (req, res) => {
  res.json(await comenziService.list(req.query));
};

export const getOne = async (req, res) => {
  res.json(await comenziService.getById(parseId(req.params.id)));
};

export const create = async (req, res) => {
  const data = validateComanda(req.body);
  res.status(201).json(await comenziService.create(data));
};

export const updateStatus = async (req, res) => {
  const id = parseId(req.params.id);
  const status = validateStatus(req.body);
  res.json(await comenziService.updateStatus(id, status));
};
