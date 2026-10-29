# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Jobs API

The job finder requests `GET /jobs`, and job details request `GET /jobs/:id`.
Set `VITE_API_BASE_URL` to the base URL of the JSON Server API when it is not
running at `http://localhost:3000`. The backend should provide a `jobs` array
in `db.json`; this repository currently has no job records or JSON Server
configuration. The page shows an API error state rather than inventing jobs
when the endpoint is unavailable.

Authentication is not configured. The login page validates the form locally
but does not send credentials or create an authenticated session.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
