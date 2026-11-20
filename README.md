# TechStore – Backend (Laboratorul 3)

API REST în **Node.js + Express + MongoDB (Mongoose)**, pentru frontend-ul Angular din `../client`.

## Cerințe

- Node.js 20+
- MongoDB (local, pe portul 27017) **sau** un cluster gratuit MongoDB Atlas

## Pornire

```bash
cd server
npm install
cp .env.example .env     # (Windows: copy .env.example .env) – apoi verifică MONGODB_URI
npm start                # http://localhost:3000/api
```

La prima pornire, dacă colecția `produse` e goală, se adaugă automat cele 3 produse din frontend.
`npm run seed` șterge toate datele (produse, comenzi, mesaje) și reia de la zero.

### MongoDB local sau Atlas?

- **Local:** instalează MongoDB Community și pornește serviciul `mongod`. `MONGODB_URI=mongodb://127.0.0.1:27017/techstore`
- **Atlas:** creează un cluster gratuit, un utilizator, permite IP-ul tău în *Network Access*, apoi pune în `.env` string-ul `mongodb+srv://...`
- **Docker:** `docker run -d -p 27017:27017 --name mongo mongo:7`

## Structura

```
src/
  server.js              conectare MongoDB + pornire server
  app.js                 middleware global + rute + erori
  config.js              port, CORS, MONGODB_URI (din .env)
  db/connection.js       conectarea Mongoose
  db/seed.js             produsele inițiale
  models/                scheme Mongoose: Produs, Comanda, Mesaj
  routes/                URL-uri -> controllere
  controllers/           citesc cererea, validează, răspund cu status HTTP
  validators/            validarea datelor primite
  services/              logica de business + interogări MongoDB
  middleware/            tratarea erorilor (format unic de răspuns)
  utils/                 HttpError, parseId
```

## Endpoint-uri

| Metodă | URL | Descriere | Status |
|---|---|---|---|
| GET | `/api/health` | verificare server + MongoDB | 200 |
| GET | `/api/produse` | listă (`?q=&minPret=&maxPret=&sort=pret_asc\|pret_desc\|nume`) | 200 |
| GET | `/api/produse/:id` | un produs | 200 / 400 / 404 |
| POST | `/api/produse` | creare produs | 201 / 400 |
| PUT | `/api/produse/:id` | înlocuire completă | 200 / 400 / 404 |
| PATCH | `/api/produse/:id` | modificare parțială | 200 / 400 / 404 |
| DELETE | `/api/produse/:id` | ștergere | 204 / 400 / 404 |
| POST | `/api/comenzi` | comandă nouă (butonul „Cumpără") | 201 / 400 / 404 |
| GET | `/api/comenzi` | listă (`?status=`) | 200 |
| GET | `/api/comenzi/:id` | o comandă | 200 / 400 / 404 |
| PATCH | `/api/comenzi/:id/status` | `noua, confirmata, expediata, livrata, anulata` | 200 / 400 / 404 |
| POST | `/api/mesaje` | mesaj din secțiunea Contact | 201 / 400 |
| GET | `/api/mesaje` | listă mesaje | 200 |
| GET | `/api/mesaje/:id` | un mesaj | 200 / 400 / 404 |

**Id-uri:** MongoDB folosește `ObjectId`, deci `id` este un string de 24 de caractere (ex. `"6b00ad3ba0b62b38c9a6c97c"`),
nu un număr. În răspunsuri `_id` apare ca `id`. Restul câmpurilor produsului sunt identice cu modelul Angular
(`nume, descriere, pret, imagine, alt`).

Erorile au mereu formatul: `{ "error": { "status": 400, "message": "...", "details": { ... } } }`.

## Testare cu curl

Mai întâi ia un id real:

```bash
curl http://localhost:3000/api/produse
```

Apoi (înlocuiește `ID_PRODUS` cu un `id` din răspuns):

```bash
curl http://localhost:3000/api/produse/ID_PRODUS
curl "http://localhost:3000/api/produse?sort=pret_desc&minPret=1000"

curl -X POST http://localhost:3000/api/produse \
  -H "Content-Type: application/json" \
  -d '{"nume":"Mouse Gaming","descriere":"Mouse precis, 16000 DPI.","pret":450,"imagine":"https://example.com/mouse.jpg"}'

curl -X POST http://localhost:3000/api/comenzi \
  -H "Content-Type: application/json" \
  -d '{"produsId":"ID_PRODUS","cantitate":2,"nume":"Ion Popescu","email":"ion@mail.com","adresa":"Str. Stefan cel Mare 1, Chisinau"}'

curl -X POST http://localhost:3000/api/mesaje \
  -H "Content-Type: application/json" \
  -d '{"nume":"Ana","email":"ana@mail.com","mesaj":"Buna, vreau detalii despre livrare."}'
```

(Pe Windows CMD folosește ghilimele duble și escape: `-d "{\"nume\":\"Ana\", ...}"`.)

## Testare cu Postman

`File → Import` → `postman/TechStore.postman_collection.json`. Rulează cererile în ordine:
id-urile (`produsId`, `comandaId` etc.) se salvează automat în variabile după „Lista produse", „Creare produs" ș.a.m.d.

## Pentru Laboratorul 4 (doar ca idee)

- CORS e deja activat pentru `http://localhost:4200`.
- În Angular: `provideHttpClient()` în `app.config.ts`, iar `Products` citește `GET /api/produse`.
- În `core/models/produs.ts` se schimbă `id: number` în `id: string` (din cauza ObjectId).
