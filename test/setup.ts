import { rm } from 'fs/promises'
import { join } from 'path'
import { getConnection } from 'typeorm'

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch (error) {
    console.log('test.sqlite - already removed')
  }
})

global.afterEach(async () => {
  const conn = getConnection()
  await conn.close()
})
