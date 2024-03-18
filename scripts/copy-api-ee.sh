#!/bin/sh
set -euf

cp  "$RIVET_EE_PATH/sdks/full/typescript/archive.tgz" vendor/rivet-gg-api-ee.tgz

# HACK: Workaround to ensure the integrity hash is updated
rm -rf node_modules
rm yarn.lock
yarn install

