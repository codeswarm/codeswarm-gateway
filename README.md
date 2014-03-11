# codeswarm-gateway

## Install

```bash
$ npm install codeswarm-gateway --global
```

## Usage

```bash
$ codeswarm-gateway --type=php --type=ruby --port=8081 --docroot=/path/to/my/docroot
```

## Injection

You can inject qunit results handling code like this:

```bash
$ codeswarm-gateway --inject=/test/index.html:qunit --inject=/test/index2.html:qunit ...
```

## License

MIT