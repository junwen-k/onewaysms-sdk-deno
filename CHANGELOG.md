# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `buildRequestURL` function to generate request URL to access OneWaySMS API.
- `deps.ts` to manage dependencies.
- `.gitignore` to ignore vscode settings.

### Updated

- Improve README.md formatting.
- Improve type for request URL params.
- Client to include `User-Agent` header to indicate SDK's request.

## [0.1.1] - 2020-05-29

### Added

- Status code for `OneWayError`.

### Updated

- Tests to include request failure assertion.
- README.md URL example when importing module.

## [0.1.0] - 2020-05-25

- Initial release
