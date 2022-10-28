import '@polkadot/api-augment'
import { describe, expect, it } from 'vitest'

import { api, delay, dev, expectJson, mockCallback } from './helper'

describe('storage', () => {
  it('getStorage', async () => {
    await expectJson(api.query.timestamp.now()).toMatchSnapshot()
    await expectJson(api.query.system.account('5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn')).toMatchSnapshot()

    const apiAt = await api.at('0x7fbf942ac7a197ed6c9ecb7733bb1d42347b7b88c32973857cc13bd98febbbab')

    await expectJson(apiAt.query.timestamp.now()).toMatchSnapshot()
    await expectJson(apiAt.query.system.account('5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn')).toMatchSnapshot()
  })

  it('getStorageMulti', async () => {
    await expectJson(
      api.query.system.account.multi([
        '5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn',
        '5Fe3jZRbKes6aeuQ6HkcTvQeNhkkRPTXBwmNkuAPoimGEv45',
        '5GBc9povce1rJR4Zcp2dfM2TciM6MjFRMq6apRBATUicBU7q',
      ])
    ).toMatchSnapshot()

    const apiAt = await api.at('0x7fbf942ac7a197ed6c9ecb7733bb1d42347b7b88c32973857cc13bd98febbbab')

    await expectJson(
      apiAt.query.system.account.multi([
        '5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn',
        '5Fe3jZRbKes6aeuQ6HkcTvQeNhkkRPTXBwmNkuAPoimGEv45',
        '5GBc9povce1rJR4Zcp2dfM2TciM6MjFRMq6apRBATUicBU7q',
      ])
    ).toMatchSnapshot()
  })

  it('getKeysPaged', async () => {
    const entries = await api.query.tokens.accounts.entriesPaged({ args: [], pageSize: 10 })
    expect(entries).toMatchSnapshot()

    const entries2 = await api.query.tokens.accounts.entriesPaged({
      args: [],
      pageSize: 10,
      startKey: entries[entries.length - 1][0].toHex(),
    })
    expect(entries2).toMatchSnapshot()
  })

  it('getKeysPagedAt', async () => {
    const apiAt = await api.at('0x7fbf942ac7a197ed6c9ecb7733bb1d42347b7b88c32973857cc13bd98febbbab')

    const entries = await apiAt.query.tokens.accounts.entriesPaged({ args: [], pageSize: 10 })
    expect(entries).toMatchSnapshot()

    const entries2 = await apiAt.query.tokens.accounts.entriesPaged({
      args: [],
      pageSize: 10,
      startKey: entries[entries.length - 1][0].toHex(),
    })
    expect(entries2).toMatchSnapshot()
  })

  it('subscription', async () => {
    const { callback, next } = mockCallback()
    const unsub = await api.query.timestamp.now(callback)

    await next()

    expect(callback.mock.calls).toMatchSnapshot()
    callback.mockClear()

    expect(await dev.newBlock()).toMatchInlineSnapshot(
      '"0x5e29ae2538ffa601a9da913b75de8c95d0ce0bc7458756a094348d7f7e9b146a"'
    )

    await next()

    expect(callback.mock.calls).toMatchSnapshot()
    callback.mockClear()

    unsub()

    expect(await dev.newBlock()).toMatchInlineSnapshot(
      '"0xe300c88d4790076560300b914c7a742929121cb2812fd931f859aa97e38b9393"'
    )

    await delay(100)

    expect(callback).not.toHaveBeenCalled()
  })
})