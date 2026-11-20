import * as produseService from '../services/produse.service.js';
import { validateProdus } from '../validators/produs.validator.js';
import { parseId } from '../utils/parseId.js';

// Express 5 prinde automat erorile din funcțiile async și le trimite la errorHandler

export const list = async (req, res) => {
  res.json(await produseService.list(req.query));
};

export const getOne = async (req, res) => {
  res.json(await produseService.getById(parseId(req.params.id)));
};

export const create = async (req, res) => {
  const data = validateProdus(req.body);
  res.status(201).json(await produseService.create(data));
};

// PUT = înlocuire completă (toate câmpurile obligatorii)
export const replace = async (req, res) => {
  const id = parseId(req.params.id);
  const data = validateProdus(req.body);
  res.json(await produseService.update(id, data));
};

// PATCH = modificare parțială
export const patch = async (req, res) => {
  const id = parseId(req.params.id);
  const changes = validateProdus(req.body, { partial: true });
  res.json(await produseService.update(id, changes));
};

export const remove = async (req, res) => {
  await produseService.remove(parseId(req.params.id));
  res.status(204).end();
};
