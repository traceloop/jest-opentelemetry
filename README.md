<p align="center">
<a href="https://www.traceloop.dev/">
<img width="300" src="https://raw.githubusercontent.com/traceloop/jest-opentelemetry/main/img/logo.png">
</a>
</p>
<h1 align="center">Jest OpenTelemetry</h1>
<p align="center">
  <p align="center">End to end tests with 10 lines of code</p>
</p>
<h4 align="center">
    <a href="https://docs.traceloop.dev/jest-otel/getting-started"><strong>Get started »</strong></a>
    <br />
    <br />
  <a href="https://join.slack.com/t/traceloopcommunity/shared_invite/zt-1plpfpm6r-zOHKI028VkpcWdobX65C~g">Slack</a> |
  <a href="https://docs.traceloop.dev/jest-otel/introduction">Docs</a> |
  <a href="https://docs.traceloop.dev/jest-otel/syntax/overview">Examples</a> |
  <a href="https://www.traceloop.dev">Website</a>
</h4>

<h4 align="center">
   <a href="https://github.com/traceloop/jest-opentelemetry/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache 2.0-blue.svg" alt="Jest OpenTelemetry is released under the Apache-2.0 License">
  </a>
  <a href="https://www.ycombinator.com/companies/traceloop"><img src="https://img.shields.io/website?color=%23f26522&down_message=Y%20Combinator&label=Backed&logo=ycombinator&style=flat-square&up_message=Y%20Combinator&url=https%3A%2F%2Fwww.ycombinator.com"></a>
  <a href="https://github.com/traceloop/jest-opentelemetry/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/traceloop/jest-opentelemetry/issues">
    <img src="https://img.shields.io/github/commit-activity/m/traceloop/jest-opentelemetry" alt="git commit activity" />
  </a>
  <a href="/">
    <img src="https://img.shields.io/badge/chat-on%20Slack-blueviolet" alt="Slack community channel" />
  </a>
  <a href="https://twitter.com/traceloopdev">
    <img src="https://img.shields.io/badge/follow-%40traceloopdev-1DA1F2?logo=twitter&style=social" alt="Traceloop Twitter" />
  </a>
</h4>

Jest OpenTelemetry allows you to write, build and run end to end tests based on OpenTelemetry traces with [Jest-like](https://jestjs.io/) syntax. You can:

- 🕵️ Test any side-effect in your system: an email was sent, a database was updated, a BI event was reported, etc.
- 👩‍💻 Run your tests and connect to a local or remote test environment.

All with just a few lines of code.

It's built and maintained by Traceloop under the Apache 2.0 license.

## 🚀 Getting Started

```js
npm i --save-dev @traceloop/jest-opentelemetry
```

Then, you can start testing your microservices:

```js
const traceloop = new TraceLoop();

await traceloop.axiosInstance.post('http://my.awesome.website/orders/create');
await traceloop.fetchTraces();

expectTrace(traceloop.serviceByName('emails-service'))
  .toReceiveHttpRequest()
  .ofMethod('POST')
  .withBody({ emailTemplate: 'orderCreated', itemId: '123' });
```

More info can be found in our [docs](https://docs.traceloop.dev/jest-otel/getting-started).

## What can you test?

Jest OpenTelemetry can be used to test anything that's happening in your system.
We're constantly adding more, and you're welcome to [suggest yours](https://github.com/traceloop/jest-opentelemetry/issues).

### Service Assertions

- [x] [REST](http://docs.traceloop.dev/jest-otel/syntax/services-rest)
- [ ] GraphQL
- [x] GRPC

### Database Assertions

- [x] [PostgreSQL](http://docs.traceloop.dev/jest-otel/syntax/db-pg)
- [ ] MongoDB
- [ ] Redis
- [ ] S3

### Analytics Reporting Assertions

- [ ] Segment
- [ ] Snowflake
- [ ] BigQuery
- [ ] Posthog

### External Systems Assertions

- [ ] SendGrid
- [ ] Stripe

## 🌱 Contributing

Whether it's big or small, we love contributions ❤️ Check out our guide to see how to [get started](https://docs.traceloop.dev/contributing/overview).

Not sure where to get started? You can:

- [Book a free pairing session with one of our teammates](mailto:nir@traceloop.dev?subject=Pairing%20session&body=I'd%20like%20to%20do%20a%20pairing%20session!)!
- Join our <a href="https://join.slack.com/t/traceloopcommunity/shared_invite/zt-1plpfpm6r-zOHKI028VkpcWdobX65C~g">Slack</a>, and ask us any questions there.

## 💚 Community & Support

- [Slack](https://join.slack.com/t/traceloopcommunity/shared_invite/zt-1plpfpm6r-zOHKI028VkpcWdobX65C~g) (For live discussion with the community and the Traceloop team)
- [GitHub Discussions](https://github.com/traceloop/jest-opentelemetry/discussions) (For help with building and deeper conversations about features)
- [GitHub Issues](https://github.com/traceloop/jest-opentelemetry/issues) (For any bugs and errors you encounter using Jest OpenTelemetry)
- [Twitter](https://twitter.com/traceloop) (Get news fast)
