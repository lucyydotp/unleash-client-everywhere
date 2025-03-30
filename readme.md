# unleash-client-everywhere
An unofficial, lightweight, platform-agnostic Unleash client

[![NPM Version](https://img.shields.io/npm/v/unleash-client-everywhere)](https://www.npmjs.com/package/unleash-client-everywhere)
<hr/>

unleash-client-everywhere is an alternative to the official Unleash client libraries, designed to run on any ES2020 runtime.

# Supported features
- [x] Most strategies: 
  - [x] `default`
  - [x] `userWithId`
  - [x] `gradualRolloutUserId`
  - [x] `gradualRolloutSessionId`
  - [x] `gradualRolloutRandom`
  - [x] `flexibleRollout`
  - [ ] `applicationHostname`
  - [ ] `remoteAddress`
- [x] Strategy constraints
  - [x] Array constraints (`IN`, `NOT_IN`)
  - [x] Numeric constraints (`NUM_EQ`, `NUM_GT` etc)
  - [x] Date constraints (`DATE_BEFORE`, `DATE_AFTER`)
  - [x] String constraints (`STR_CONTAINS`, `STR_STARTS_WITH`, `STR_ENDS_WITH`)
  - [ ] Semver constraints
  - [ ] Strategy variants
  - [ ] Segments
  - [ ] Dependencies
  - [ ] Client usage metrics
