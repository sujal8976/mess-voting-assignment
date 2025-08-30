# Hostel Mess Menu Voting — Frontend

This is a minimal HTML/CSS/JS frontend that works with your existing Node/Express backend.

## Files
- `public/index.html` — voting UI (students)
- `public/admin.html` — admin UI to add/update items
- `public/styles.css` — styles
- `public/app.js` — voting page logic
- `public/admin.js` — admin page logic

All requests send the header `Content-Type: application/json` (and `Accept: application/json`).

## Expected backend routes
These match your repo structure:
- `GET /api/menu/all` — list of all pre-approved items (with availability)
- `GET /api/menu/top?limit=3` — top items by votes
- `POST /api/vote` — body: `{ studentRoll, menuItemId }`
- `POST /api/admin/addItem` — body: `{ name, isAvailable, adminPass }`
- `POST /api/admin/updateItem` — body: `{ name, isAvailable, adminPass }`

## Serving the frontend
Put the `public` folder next to `index.js` in your backend, then add **one** line to serve static files:

```js
app.use(express.static('public'));
```

Mount your routers (if not already):

```js
app.use('/api/vote', voteRouter);
app.use('/api/menu', menuRouter);
app.use('/api/admin', adminRouter);
app.use(errorMiddleware);
```

## Run
```
npm start
# open http://localhost:<PORT>/
```

> Tip: If your API runs on a different origin, either enable CORS on the server (already included) or set `const API_BASE = 'http://localhost:<PORT>/api'` at the top of `app.js` and `admin.js`.
