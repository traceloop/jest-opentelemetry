# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/traceloop/jest-opentelemetry/compare/v0.4.1...v0.5.0) (2023-03-17)

### Features

- go server backend ([#42](https://github.com/traceloop/jest-opentelemetry/issues/42)) ([a543845](https://github.com/traceloop/jest-opentelemetry/commit/a543845445617bd321c7cee793e23caf2c651844))
- gRPC matchers ([#48](https://github.com/traceloop/jest-opentelemetry/issues/48)) ([fe893e2](https://github.com/traceloop/jest-opentelemetry/commit/fe893e2068286b014d20fe9f25335c5e02f341c8))
- traceloop proto ([#52](https://github.com/traceloop/jest-opentelemetry/issues/52)) ([53e9e68](https://github.com/traceloop/jest-opentelemetry/commit/53e9e68ab34bf79ab52adb82be219d48fef64acb))

## [0.4.1](https://github.com/traceloop/jest-opentelemetry/compare/v0.4.0...v0.4.1) (2023-02-23)

### Bug Fixes

- publish on public packages ([7ecb00a](https://github.com/traceloop/jest-opentelemetry/commit/7ecb00aff9b376195c3b04a2f65dcd26321ba186))
- tracing enabled only if OTEL_EXPORTER_OTLP_ENDPOINT is specified ([80f74ce](https://github.com/traceloop/jest-opentelemetry/commit/80f74ce6c06ea1b6740faa5cf8499ea70d284cdf))

# 0.4.0 (2023-02-22)

### Bug Fixes

- adaptations for minimal working js project ([57c94a4](https://github.com/traceloop/jest-opentelemetry/commit/57c94a448045ac00a1c01788a8439489a2ca6fe2))
- adaptations for usage with minimal js project ([7a7771e](https://github.com/traceloop/jest-opentelemetry/commit/7a7771e165b8924778e82758504ee38b1cdd93bc))
- added delay in tests to avoid race conditon in our CI ([3d24398](https://github.com/traceloop/jest-opentelemetry/commit/3d24398d65fc39a917ab455223a15298841966ff))
- compilation & tests ([4e8698f](https://github.com/traceloop/jest-opentelemetry/commit/4e8698f254bad209becf2bd260679831fb25c0a6))
- created a separate package for protobuf code ([b445f6f](https://github.com/traceloop/jest-opentelemetry/commit/b445f6fb7a32989b44253d813c4f92ad5dfffd2f))
- dont use axios (server was working the whole time) ([#12](https://github.com/traceloop/jest-opentelemetry/issues/12)) ([e409767](https://github.com/traceloop/jest-opentelemetry/commit/e4097679a5ae5a981f20312eb48cef183d69ac0b))
- **expect:** remove async matcher creation ([#18](https://github.com/traceloop/jest-opentelemetry/issues/18)) ([e54fd9d](https://github.com/traceloop/jest-opentelemetry/commit/e54fd9dd5a2330fbd5eac6c04c4be9830c9390fa))
- **expect:** type exports ([#21](https://github.com/traceloop/jest-opentelemetry/issues/21)) ([85f6481](https://github.com/traceloop/jest-opentelemetry/commit/85f6481501c5018a4e1a717f6cd8221deb2ab1f1))
- export matchers and resources ([17f6655](https://github.com/traceloop/jest-opentelemetry/commit/17f66552f6e969e3ca14e7ab3736d0e5c3d4b207))
- import paths of proto package ([466e8b1](https://github.com/traceloop/jest-opentelemetry/commit/466e8b13521f77d4d1893b86b438f488a8ade0e7))
- imports from dist ([#16](https://github.com/traceloop/jest-opentelemetry/issues/16)) ([230849d](https://github.com/traceloop/jest-opentelemetry/commit/230849d617887d53b85a012cd1878dbdfca19e7b))
- **integration:** integration test dsl with test servers ([#4](https://github.com/traceloop/jest-opentelemetry/issues/4)) ([6b4b7f7](https://github.com/traceloop/jest-opentelemetry/commit/6b4b7f7c43f7f450b615bf46635a817df708517e))
- jest preset references ([2665c1a](https://github.com/traceloop/jest-opentelemetry/commit/2665c1a0f301d0f0df8979a64c8fdfeea367dbc4))
- **lint:** linting issues ([#11](https://github.com/traceloop/jest-opentelemetry/issues/11)) ([c74ca77](https://github.com/traceloop/jest-opentelemetry/commit/c74ca77896c35a8ff72500451d41cc0c53d1c8b1))
- moved dependncies to packages that need them ([60dc5ae](https://github.com/traceloop/jest-opentelemetry/commit/60dc5ae524920f9efea717034ae64152a180c69b))
- new proto ([c2e7b77](https://github.com/traceloop/jest-opentelemetry/commit/c2e7b77910ed58e296fc4eef96a7d8acb725f2a9))
- npm imports ([a44d388](https://github.com/traceloop/jest-opentelemetry/commit/a44d38823da0d295680547ff19b94bce3b43ff96))
- npm publish files ([02afb0b](https://github.com/traceloop/jest-opentelemetry/commit/02afb0b6f6054d3570d2160d667f05033243401d))
- otel receiver timeouts ([#17](https://github.com/traceloop/jest-opentelemetry/issues/17)) ([8c99815](https://github.com/traceloop/jest-opentelemetry/commit/8c998151a7a30c1a401aa1403587f35026d4814b))
- otel-receiver can be executed ([4360cdb](https://github.com/traceloop/jest-opentelemetry/commit/4360cdb3970835142c35f3eb28d7355f909a165b))
- package references ([029cfc9](https://github.com/traceloop/jest-opentelemetry/commit/029cfc9815403487a25dd780e26d92900378b66d))
- **postgresql-matchers:** test describe & matchers interface declaration ([#27](https://github.com/traceloop/jest-opentelemetry/issues/27)) ([71d5324](https://github.com/traceloop/jest-opentelemetry/commit/71d532498c9173be8c3276df91c823329250759e))
- separate expect() function ([e704f43](https://github.com/traceloop/jest-opentelemetry/commit/e704f43b5c5877c254c901825c446eeaea2f1258))
- span filtering ([#26](https://github.com/traceloop/jest-opentelemetry/issues/26)) ([25cc18d](https://github.com/traceloop/jest-opentelemetry/commit/25cc18d74d8c8e291bfba87707bf8c515810c2e0))
- timeout on test setup ([2b3fc15](https://github.com/traceloop/jest-opentelemetry/commit/2b3fc15b2cfae8e46471c3d11531bff40bf7c834))
- type definitions ([7fb5242](https://github.com/traceloop/jest-opentelemetry/commit/7fb5242d47a97c8c1e5f496b82492989bb1ef008))
- typescript adaptations ([ec0ad8e](https://github.com/traceloop/jest-opentelemetry/commit/ec0ad8e40c799f70881ae7ac3b441c7f6eb6c9cd))
- typescript types generation ([863643f](https://github.com/traceloop/jest-opentelemetry/commit/863643ff718fab1d266487ff21514c2a88fda9af))
- wrong export for setup/teardown of jest ([3979c3f](https://github.com/traceloop/jest-opentelemetry/commit/3979c3f01a0286175c2f1a52bd117b1fee9b6d76))

### Features

- 2 test servers ([0191781](https://github.com/traceloop/jest-opentelemetry/commit/01917812668fd8d31c1962fdefbb539ae3cf7774))
- basic integration with otel-receiver ([10f4a4e](https://github.com/traceloop/jest-opentelemetry/commit/10f4a4e274079620f8461eb64b09c73e9a609077))
- compare types ([ff0bb90](https://github.com/traceloop/jest-opentelemetry/commit/ff0bb906128d130cc92fdc434c8b31c352b5451e))
- **database-matchers:** support postgres matchers ([#24](https://github.com/traceloop/jest-opentelemetry/issues/24)) ([8b86a4b](https://github.com/traceloop/jest-opentelemetry/commit/8b86a4b7c926498c00a3eaa3da326d45eeda8d77))
- http matchers ([#29](https://github.com/traceloop/jest-opentelemetry/issues/29)) ([9c436c8](https://github.com/traceloop/jest-opentelemetry/commit/9c436c894e08c443404e842c5dbdf40845cd664c))
- k8s init-container ([c05bda4](https://github.com/traceloop/jest-opentelemetry/commit/c05bda437b9b11e5097e482f6a7885e58789cc5b))
- kuberneteized test-servers ([5d3283d](https://github.com/traceloop/jest-opentelemetry/commit/5d3283d98779a9fba4321fdafda5bdd5ac5f71c7))
- matcher utils ([599d113](https://github.com/traceloop/jest-opentelemetry/commit/599d113634882b1b4fcc44cd3c5268d7cba41655))
- more filters ([#25](https://github.com/traceloop/jest-opentelemetry/issues/25)) ([e8c3193](https://github.com/traceloop/jest-opentelemetry/commit/e8c31936dc6ed3ba5057ff01fa022eb15b6c0c21))
- **opentelemetry-expect:** service & http request matchers ([#1](https://github.com/traceloop/jest-opentelemetry/issues/1)) ([4ce773b](https://github.com/traceloop/jest-opentelemetry/commit/4ce773be6a68be1a1d2cb1f8da24c44a2d058a23))
- otel orchestartion on k8s ([dc19417](https://github.com/traceloop/jest-opentelemetry/commit/dc194173a2c2d7c7a892d437ee0d2101c6ac1605))
- **postgres-matchers:** add statement matcher ([#28](https://github.com/traceloop/jest-opentelemetry/issues/28)) ([9485210](https://github.com/traceloop/jest-opentelemetry/commit/94852101c9fc6a0d5c85d9f6bfccf7cc68dcbe25))
- separate otel instrumentation into a new package ([dfe7586](https://github.com/traceloop/jest-opentelemetry/commit/dfe758613c5e17c4e92144023c82d91526aca786))
- service matchers ([#23](https://github.com/traceloop/jest-opentelemetry/issues/23)) ([ef4c111](https://github.com/traceloop/jest-opentelemetry/commit/ef4c1110127bae5277aa82dfa8c804cea88a94d5))
- TraceLoop ([#19](https://github.com/traceloop/jest-opentelemetry/issues/19)) ([ab17a91](https://github.com/traceloop/jest-opentelemetry/commit/ab17a91601ff8643ed99a6e2adaced491ab0743d))

# [0.3.0](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.7...v0.3.0) (2023-02-21)

### Bug Fixes

- import paths of proto package ([466e8b1](https://github.com/traceloop/jest-opentelemetry/commit/466e8b13521f77d4d1893b86b438f488a8ade0e7))

### Features

- compare types ([ff0bb90](https://github.com/traceloop/jest-opentelemetry/commit/ff0bb906128d130cc92fdc434c8b31c352b5451e))
- matcher utils ([599d113](https://github.com/traceloop/jest-opentelemetry/commit/599d113634882b1b4fcc44cd3c5268d7cba41655))

## [0.2.7](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.6...v0.2.7) (2023-02-21)

### Bug Fixes

- moved dependncies to packages that need them ([60dc5ae](https://github.com/traceloop/jest-opentelemetry/commit/60dc5ae524920f9efea717034ae64152a180c69b))

## [0.2.6](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.5...v0.2.6) (2023-02-21)

### Bug Fixes

- created a separate package for protobuf code ([b445f6f](https://github.com/traceloop/jest-opentelemetry/commit/b445f6fb7a32989b44253d813c4f92ad5dfffd2f))

## [0.2.5](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.4...v0.2.5) (2023-02-21)

### Bug Fixes

- otel-receiver can be executed ([4360cdb](https://github.com/traceloop/jest-opentelemetry/commit/4360cdb3970835142c35f3eb28d7355f909a165b))

## [0.2.4](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.3...v0.2.4) (2023-02-21)

### Bug Fixes

- separate expect() function ([e704f43](https://github.com/traceloop/jest-opentelemetry/commit/e704f43b5c5877c254c901825c446eeaea2f1258))

## [0.2.3](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.2...v0.2.3) (2023-02-21)

### Bug Fixes

- wrong export for setup/teardown of jest ([3979c3f](https://github.com/traceloop/jest-opentelemetry/commit/3979c3f01a0286175c2f1a52bd117b1fee9b6d76))

## [0.2.2](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.1...v0.2.2) (2023-02-21)

### Bug Fixes

- adaptations for usage with minimal js project ([7a7771e](https://github.com/traceloop/jest-opentelemetry/commit/7a7771e165b8924778e82758504ee38b1cdd93bc))

## [0.2.1](https://github.com/traceloop/jest-opentelemetry/compare/v0.2.0...v0.2.1) (2023-02-21)

### Bug Fixes

- adaptations for minimal working js project ([57c94a4](https://github.com/traceloop/jest-opentelemetry/commit/57c94a448045ac00a1c01788a8439489a2ca6fe2))
- type definitions ([7fb5242](https://github.com/traceloop/jest-opentelemetry/commit/7fb5242d47a97c8c1e5f496b82492989bb1ef008))

# [0.2.0](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.8...v0.2.0) (2023-02-21)

### Bug Fixes

- **expect:** type exports ([#21](https://github.com/traceloop/jest-opentelemetry/issues/21)) ([85f6481](https://github.com/traceloop/jest-opentelemetry/commit/85f6481501c5018a4e1a717f6cd8221deb2ab1f1))

### Features

- TraceLoop ([#19](https://github.com/traceloop/jest-opentelemetry/issues/19)) ([ab17a91](https://github.com/traceloop/jest-opentelemetry/commit/ab17a91601ff8643ed99a6e2adaced491ab0743d))

## [0.1.10](https://github.com/expect-dev/jest-opentelemetry/compare/v0.1.9...v0.1.10) (2023-02-21)

**Note:** Version bump only for package jest-opentelemetry

## [0.1.9](https://github.com/expect-dev/jest-opentelemetry/compare/v0.1.8...v0.1.9) (2023-02-21)

**Note:** Version bump only for package jest-opentelemetry

## [0.1.8](https://github.com/expect-dev/jest-opentelemetry/compare/v0.1.7...v0.1.8) (2023-02-21)

### Bug Fixes

- **expect:** remove async matcher creation ([#18](https://github.com/expect-dev/jest-opentelemetry/issues/18)) ([e54fd9d](https://github.com/expect-dev/jest-opentelemetry/commit/e54fd9dd5a2330fbd5eac6c04c4be9830c9390fa))

## [0.1.7](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.6...v0.1.7) (2023-02-21)

### Bug Fixes

- export matchers and resources ([17f6655](https://github.com/traceloop/jest-opentelemetry/commit/17f66552f6e969e3ca14e7ab3736d0e5c3d4b207))

## [0.1.6](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.5...v0.1.6) (2023-02-21)

### Bug Fixes

- npm publish files ([02afb0b](https://github.com/traceloop/jest-opentelemetry/commit/02afb0b6f6054d3570d2160d667f05033243401d))

## [0.1.5](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.4...v0.1.5) (2023-02-21)

### Bug Fixes

- npm imports ([a44d388](https://github.com/traceloop/jest-opentelemetry/commit/a44d38823da0d295680547ff19b94bce3b43ff96))

## [0.1.4](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.3...v0.1.4) (2023-02-21)

### Bug Fixes

- typescript types generation ([863643f](https://github.com/traceloop/jest-opentelemetry/commit/863643ff718fab1d266487ff21514c2a88fda9af))

## [0.1.3](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.2...v0.1.3) (2023-02-21)

### Bug Fixes

- package references ([029cfc9](https://github.com/traceloop/jest-opentelemetry/commit/029cfc9815403487a25dd780e26d92900378b66d))

## [0.1.2](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.1...v0.1.2) (2023-02-21)

**Note:** Version bump only for package jest-opentelemetry

## [0.1.1](https://github.com/traceloop/jest-opentelemetry/compare/v0.1.0...v0.1.1) (2023-02-21)

**Note:** Version bump only for package jest-opentelemetry

# 0.1.0 (2023-02-21)

### Bug Fixes

- compilation & tests ([4e8698f](https://github.com/traceloop/jest-opentelemetry/commit/4e8698f254bad209becf2bd260679831fb25c0a6))
- dont use axios (server was working the whole time) ([#12](https://github.com/traceloop/jest-opentelemetry/issues/12)) ([e409767](https://github.com/traceloop/jest-opentelemetry/commit/e4097679a5ae5a981f20312eb48cef183d69ac0b))
- imports from dist ([#16](https://github.com/traceloop/jest-opentelemetry/issues/16)) ([230849d](https://github.com/traceloop/jest-opentelemetry/commit/230849d617887d53b85a012cd1878dbdfca19e7b))
- **integration:** integration test dsl with test servers ([#4](https://github.com/traceloop/jest-opentelemetry/issues/4)) ([6b4b7f7](https://github.com/traceloop/jest-opentelemetry/commit/6b4b7f7c43f7f450b615bf46635a817df708517e))
- jest preset references ([2665c1a](https://github.com/traceloop/jest-opentelemetry/commit/2665c1a0f301d0f0df8979a64c8fdfeea367dbc4))
- **lint:** linting issues ([#11](https://github.com/traceloop/jest-opentelemetry/issues/11)) ([c74ca77](https://github.com/traceloop/jest-opentelemetry/commit/c74ca77896c35a8ff72500451d41cc0c53d1c8b1))
- new proto ([c2e7b77](https://github.com/traceloop/jest-opentelemetry/commit/c2e7b77910ed58e296fc4eef96a7d8acb725f2a9))
- otel receiver timeouts ([#17](https://github.com/traceloop/jest-opentelemetry/issues/17)) ([8c99815](https://github.com/traceloop/jest-opentelemetry/commit/8c998151a7a30c1a401aa1403587f35026d4814b))
- typescript adaptations ([ec0ad8e](https://github.com/traceloop/jest-opentelemetry/commit/ec0ad8e40c799f70881ae7ac3b441c7f6eb6c9cd))

### Features

- 2 test servers ([0191781](https://github.com/traceloop/jest-opentelemetry/commit/01917812668fd8d31c1962fdefbb539ae3cf7774))
- basic integration with otel-receiver ([10f4a4e](https://github.com/traceloop/jest-opentelemetry/commit/10f4a4e274079620f8461eb64b09c73e9a609077))
- kuberneteized test-servers ([5d3283d](https://github.com/traceloop/jest-opentelemetry/commit/5d3283d98779a9fba4321fdafda5bdd5ac5f71c7))
- **opentelemetry-expect:** service & http request matchers ([#1](https://github.com/traceloop/jest-opentelemetry/issues/1)) ([4ce773b](https://github.com/traceloop/jest-opentelemetry/commit/4ce773be6a68be1a1d2cb1f8da24c44a2d058a23))
- otel orchestartion on k8s ([dc19417](https://github.com/traceloop/jest-opentelemetry/commit/dc194173a2c2d7c7a892d437ee0d2101c6ac1605))
