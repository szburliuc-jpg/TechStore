import * as mesajeService from '../services/mesaje.service.js';
import { validateMesaj } from '../validators/mesaj.validator.js';
import { parseId } from '../utils/parseId.js';

export const list = async (req, res) => {
  res.json(await mesajeService.list());
};

export const getOne = async (req, res) => {
  res.json(await mesajeService.getById(parseId(req.params.id)));
};

export const create = async (req, res) => {
  const data = validateMesaj(req.body);
  res.status(201).json(await mesajeService.create(data));
};
