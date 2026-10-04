# NexusHost Deployment — BC TRUCK WORKS

## Repository
- Repository: `dospatch/truckWorks`
- Branch: `main`
- Runtime: Node.js 22+
- Main file: `index.js`
- Start command: `npm start`

## NexusHost Variables

Set these in NexusHost. Never put the real Discord token in GitHub.

- `DISCORD_TOKEN` — your Discord bot token
- `DISCORD_CLIENT_ID` — `1556044045195935775`
- `DISCORD_GUILD_ID` — `1546265801500266611`
- `TRUCKWORKS_WEBSITE_URL` — `https://truck-works.vercel.app`

## Production entry point

NexusHost must run the repository-root `index.js`.

Do not use:
- `bot/src/index.js`
- `require("./bot/src/index.js")`
- `./commands/status`

The production bot is self-contained in the root `index.js`.

## After deployment

Expected startup includes:

```
BC TRUCK WORKS DISCORD BOT
Logged in as: ...
Registered 4 Discord slash commands.
BC TRUCK WORKS BOT IS ONLINE
```

Test in Discord in this order:

1. `/status`
2. `/truckworks`
3. `/telemetry`
4. `/setup` last
