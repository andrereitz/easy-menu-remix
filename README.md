# Easy Menu Remix

This is a frontend for the [easy-menu-go](https://github.com/andrereitz/easy-menu-go) project. Same implementation from [python](https://github.com/andrereitz/easy-menu) but in a go server.

## About this project

This is just an experimentation project with Remix since I`ve never used it. Remix is a server side render ready React framework that brings the mental model closer to web standards.
It offers a great and simple experience for developing SSR applications, and is a great alternative to NextJS

## Node

Node should be v20+ since previous node versions have default resoluton for IPV6 first (localhost tries to access ::1)
This makes the development with secure cookies simplier since you can make serverside requests with localhost that would be mapped to 127.0.0.1 on the go server

Alternativly you can set dns resolution to IPV4 using the following code in a the entry file:
```
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
```

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
