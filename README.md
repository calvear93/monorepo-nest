<h2 align="center"><b>NestJS Skeleton</b></h2>
<h3 align="center"><b>Monorepo REST</b></h3>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://github.com/calvear93/nestjs-template" target="_blank">
	<img src="https://img.shields.io/github/license/calvear93/nestjs-template" alt="Package License" />
  </a>
</p>

## ⛩ **Structure**

```bash
├── README.md
├── env/
│   └── appsettings.json
├── src/
│   ├── apps/
│   │   └── core/
│   └── libs/
│       └── http/
├── tsconfig.json
├── pnpm-workspace.yaml # monorepo packages config
└── package.json
```

## 📥 **Getting Started**

-   Install [NodeJS](https://nodejs.org/es/).
-   Install [PNPM](https://pnpm.io/installation)
-   Execute `pnpm install` command.
-   Run either `pnpm apps:core start` or `pnpm test` commands.

## 🧪 **Executing**

| Command                | Action                      |
| ---------------------- | --------------------------- |
| pnpm apps:core `<cmd>` | executes a api core command |
| pnpm test              | executes tests              |
