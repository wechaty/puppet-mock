#!/usr/bin/env ts-node

// tslint:disable:arrow-parens
// tslint:disable:max-line-length
// tslint:disable:member-ordering
// tslint:disable:no-shadowed-variable
// tslint:disable:unified-signatures
// tslint:disable:no-console

import {
  FileBox,
}                 from 'file-box'
import {
  MemoryCard,
}                 from 'memory-card'

import {
  PuppetMock,
}                 from 'wechaty-puppet-mock'

async function main () {
  const puppet = new PuppetMock({ memory: new MemoryCard() })
  console.log(`Puppet v${puppet.version()} smoking test passed.`)
  return 0
}

main()
.then(process.exit)
.catch(e => {
  console.error(e)
  process.exit(1)
})
