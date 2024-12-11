const { spawnSync } = require('child_process')
const { existsSync, writeFileSync } = require('fs')

const SESSION_ID = 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZU9uYlBZZzE5V3QxcUlXZDlBUnVLaUJzclNMRVBLSjl3UTZjRGM4N1BXUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaktubEZ3aWJGUFBRdG16b1dPSTIzUmZrYWNHMGxsTjNkMGdnTlFZTkxFRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpRWhaajBmTWJhelNFOVNoTGFhNExjNTdtZGJFakllZ3VnbVVZMEkrZm5zPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrRzFFOUlSKzRtTFUxNjVJd2o1MHlBeE4xNHNhamVwYTA4WVYzV21QdXhzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IitNZVlNWXdYSWhuYll5QlpuTFVpb3BzMTRwV3BnNjExTmpXV2VoYVd0bms9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkhZL0ZBQ2EyaDlrYXF3YWdSbi9NanZRZnRGbnMwYmRaclNkdGQwZVpJeXc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0d6a0tHYys4UDNLRHlFK1F4UC9ZMm1NWGZ0T2t0WjNhLzZXRTN2WFRXaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZWJ3RU1WNE5YekhKWk9IVno3ajNhUmM1UURoUUxZUHJsZk9YbFJ0WXdYQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlZTV2xCb0JQVEYwdEZQd1NLM2hyS2F0U1RKL1FtT3FBNllhWHJBNGwzSzRJUTk2VUtFVHhPM0MrV0dyUFl2Wnd1ZGxQa1VoanZzY3praFVJZUhtNkFRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjMwLCJhZHZTZWNyZXRLZXkiOiJXY1c3eHhsN1NaUTBjT2xLdVhlWm9NK1BjQW1OZ0x1a2RVc2FUYkVmQ1JnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjUwOTMxNDM0NTM1QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkMxOTk0RjEwNDc3RjFBMkYyNzMxQ0U1NDNGMzUxMjcwIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MjU4NzQ4MDd9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Im5qUWZOSmhnUUVpVjB6OUV4MUw5QnciLCJwaG9uZUlkIjoiMThhNmEzMmYtZmQ5Yi00YzRiLWFjOTQtODdmMTljMjBiN2E1IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ikd5d3ZmQlp3RTJGV1pqUnhMVWlYcHdFbDRjUT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJUQzJ2QVd0eVRnOFNuTDU1ZTU0dVR3Y3NaK2s9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiV1I0R0JWOUsiLCJtZSI6eyJpZCI6IjUwOTMxNDM0NTM1OjlAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ1BYano5MEVFT2FFKzdZR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6ImpKSEwyL2xaTk5RUzA4UnJRVGJCWEMxWGlkNWNvWmxqcFc3STQrL1o5d009IiwiYWNjb3VudFNpZ25hdHVyZSI6IkdzR1pSUnlSQXNZellydmJXeStYbjVHbmFJVXpzVzAyeUFwd3JWcmdnN1lFbU9MS01Na25FZEpiMU0waldQV2tEQUd1L1NXUzNtSm1BZWZWdStuZ0RnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiIzd2hTWGc2MUN4eFZlZktFcFN4NkpqSCsydFJnR0dyT1pjT2pnbkc2eEFVeHRCVlJzb08xbU5WS1o2d3JFM0V6VCsvR2J1QkpTTlRTUzEzTnBMT1FEUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjUwOTMxNDM0NTM1OjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCWXlSeTl2NVdUVFVFdFBFYTBFMndWd3RWNG5lWEtHWlk2VnV5T1B2MmZjRCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNTg3NDgwMywibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFHT3IifQ==' // Edit this line only, don't remove ' <- this symbol

if (!existsSync('levanter')) {
  console.log('Cloning the repository...')
  const cloneResult = spawnSync(
    'git',
    ['clone', 'https://github.com/lyfe00011/levanter.git', 'levanter'],
    {
      stdio: 'inherit',
    }
  )

  if (cloneResult.error) {
    throw new Error(`Failed to clone the repository: ${cloneResult.error.message}`)
  }

  const configPath = 'levanter/config.env'
  try {
    console.log('Writing to config.env...')
    writeFileSync(configPath, `VPS=true\nSESSION_ID=${SESSION_ID}`)
  } catch (err) {
    throw new Error(`Failed to write to config.env: ${err.message}`)
  }

  console.log('Installing dependencies...')
  const installResult = spawnSync('yarn', ['install', '--network-concurrency', '3'], {
    cwd: 'levanter',
    stdio: 'inherit',
  })

  if (installResult.error) {
    throw new Error(`Failed to install dependencies: ${installResult.error.message}`)
  }
}

spawnSync('yarn', ['start'], { cwd: 'levanter', stdio: 'inherit' })
