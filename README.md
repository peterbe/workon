[![What's deployed on prod?](https://img.shields.io/badge/whatsdeployed-prod-green.svg)](https://whatsdeployed.io/s/58R)

## Local development

**To start the Node dev server run:**

```bash
yarn
yarn start
```

Now open `http://localhost:3000`

**Kinto server**

You need to create a PostgreSQL database. Call it `workon` for example.
You also need to create a `virtualenv` and run:

```bash
pip install -r requirements.txt
kinto migrate --ini kinto.ini
```

But for this to work you need to have set the following environment variables:

- `KINTO_MULTIAUTH_POLICY_AUTH0_CLIENT_ID` (get it from your Auth0.com settings)
- `KINTO_MULTIAUTH_POLICY_AUTH0_CLIENT_SECRET` (get it from your Auth0.com settings)

To change the database URL set these three too:

- `KINTO_STORAGE_URL` (default is `postgres://localhost/workon`)
- `KINTO_PERMISSION_URL` (default is `postgres://localhost/workon`)
- `KINTO_CACHE_URL` (default is `postgres://localhost/workon`)

Now you can run:

```bash
kinto start --ini kinto.ini
```

When you've done these once you just need:

```bash
yarn start
```

in on terminal and:
```bash
kinto start --ini kinto.ini
```
in another.

## Artwork

Icon by [Iconshock](http://www.iconshock.com/)
