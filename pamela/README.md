# Pamela

## Overview

This is a REST proxy for the Console

## Prerequisites

- Node.js v12
- npm or Yarn

## Installation

To install Pamela together with the Console, run the `npm run bootstrap` in the root directory.

## Usage

One of:

- `npm run watch` (described below; KUBECONFIG env variable must be provided)
- `npm start` ( KUBECONFIG env variable must be provided)
- `docker build` and use it as an image of a Kubernetes pod

## Development

Use `npm run watch` command to run Pamela in the unsafe mode (no TLS certificate) and with the _watch_ mode on.
`KUBECONFIG` environment variable **must be provided**.
