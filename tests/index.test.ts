import { resolve } from 'path'
import { promises as fs } from 'fs'
import ts2gas from 'ts2gas'

describe('Entrypoint', () => {
  it('Transpilable successfly', async () => {
    const code = await fs.readFile(resolve(__dirname, '../src/index.ts'), {
      encoding: 'utf-8',
    })
    ts2gas(code)
  })
})
