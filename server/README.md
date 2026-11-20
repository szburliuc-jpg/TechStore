# TechStore – Backend (Laboratorul 3)

API REST în **Node.js + Express + PostgreSQL** (gândit pentru **Neon**), pentru frontend-ul Angular din `../client`.

## Cerințe

- Node.js 20+
- O bază PostgreSQL: **Neon** (gratuit, în cloud) sau PostgreSQL local

## Pornire cu Neon

1. Intră pe https://neon.tech, creează un cont și un proiect nou (alege regiunea cea mai apropiată, ex. Frankfurt).
2. În dashboard apasă **Connect** și copiază *Connection string* (arată așa):
   `postgresql://utilizator:parola@ep-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
3. În `server/`:
   ```bash
   npm install
   cp .env.example .env       # Windows: copy .env.example .env
   ```
   Deschide `.env` și pune string-ul tău la `DATABASE_URL=`.
4. Pornește:
   ```bash
   npm start                  # http://localhost:3000/api
   ```

Tabelele (`produse`, `comenzi`, `mesaje`) se creează automat la pornire, iar dacă `produse` e goală se adaugă cele 3 produse din frontend.
`npm run seed` șterge toate datele, resetează id-urile și reia de la cele 3 produse.

Verificare: `http://localhost:3000/api/health` trebuie să arate `"postgres": "conectata"`. În Neon poți vedea datele la **Tables**.

### Probleme frecvente la Neon

- `password authentication failed` – parola din string e greșită (o poți reseta din dashboard).
- `connection timeout` – prima conexiune după o pauză poate dura câteva secunde (baza „adoarme"); repornește serverul.
- `channel_binding` – dacă string-ul are `&channel_binding=require` și primești eroare, șterge acea parte din `.env`.
- Nu pune `.env` pe GitHub (e deja în `.gitignore`).

### PostgreSQL local (alternativă)

`DATABASE_URL=postgresql://postgres:parola@127.0.0.1:5432/techstore` (baza `techstore` trebuie creată în prealabil: `CREATE DATABASE techstore;`).

## Structura

```
src/
  server.js              creare tabele + seed + pornire server
  app.js                 middleware global + rute + erori
  config.js              port, CORS, DATABASE_URL (din .env)
  db/pool.js             conexiunea pg (SSL pentru Neon)
  db/init.js             CREATE TABLE IF NOT EXISTS
  db/seed.js             produsele inițiale
  routes/                URL-uri -> controllere
  controllers/           citesc cererea, validează, răspund cu status HTTP
  validators/            validarea datelor primite
  services/              logica de business + interogări SQL (parametrizate)
  middleware/            tratarea erorilor (format unic de răspuns)
  utils/                 HttpError, parseId
```

## Endpoint-uri

| Metodă | URL | Descriere | Status |
|---|---|---|---|
| GET | `/api/health` | verificare server + bază de date | 200 |
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

Id-urile sunt numere întregi (1, 2, 3...), iar `GET /api/produse` returnează direct un `Produs[]`
identic cu modelul din Angular (`id, nume, descriere, pret, imagine, alt`).

Erorile au mereu formatul: `{ "error": { "status": 400, "message": "...", "details": { ... } } }`.

## Testare cu curl

```bash
curl http://localhost:3000/api/produse
curl "http://localhost:3000/api/produse?sort=pret_desc&minPret=1000"
curl http://localhost:3000/api/produse/1

curl -X POST http://localhost:3000/api/produse \
  -H "Content-Type: application/json" \
  -d '{"nume":"Mouse Gaming","descriere":"Mouse precis, 16000 DPI.","pret":450,"imagine":"https://example.com/mouse.jpg"}'

curl -X POST http://localhost:3000/api/comenzi \
  -H "Content-Type: application/json" \
  -d '{"produsId":1,"cantitate":2,"nume":"Ion Popescu","email":"ion@mail.com","adresa":"Str. Stefan cel Mare 1, Chisinau"}'

curl -X POST http://localhost:3000/api/mesaje \
  -H "Content-Type: application/json" \
  -d '{"nume":"Ana","email":"ana@mail.com","mesaj":"Buna, vreau detalii despre livrare."}'
```

(Pe Windows CMD folosește ghilimele duble și escape: `-d "{\"nume\":\"Ana\", ...}"`.)

## Testare cu Postman

`File → Import` → `postman/TechStore.postman_collection.json`. Rulează cererile în ordine:
id-urile (`produsId`, `comandaId` etc.) se salvează automat în variabile.

## Pentru Laboratorul 4 (doar ca idee)

CORS e deja activat pentru `http://localhost:4200`. În Angular se adaugă `provideHttpClient()` în `app.config.ts`,
iar `Products` citește `GET /api/produse`. Modelul `Produs` din Angular rămâne neschimbat (`id: number`).
