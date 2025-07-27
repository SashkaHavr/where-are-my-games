# *WHERE ARE MY GAMES?*

## About

Lost in a jungle of game launchers? This handy little app remembers where you bought your games, so you don't have to!

This is a demo [TypeScript](https://www.typescriptlang.org/) monorepo. For more information see https://github.com/SashkaHavr/reactlith

## Prepare application

1. Create [Twitch OAuth app](https://dev.twitch.tv/docs/authentication/register-app/) with:
  - OAuth Redirect URLs: http://localhost:3000/auth/callback/twitch and http://localhost:5240/auth/callback/twitch 
  - Client Type: Confidential
2. Create and remember client secret

## Fast local startup

1. Create [.env](./.env) file in the root directory
2. Set **TWITCH_CLIENT_ID** and **TWITCH_CLIENT_SECRET**
3. Run `docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build -d`
