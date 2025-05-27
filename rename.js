#!/usr/bin/env node

import fs from 'fs'
import readline from 'readline'

const originalProjectName = 'fcp-sfd-accelerator'
const originalDescription = 'CDP Node.js Backend Template'
const originalPort = 3000

const processInput = (args) => {
  const [, , projectName, description, port] = args

  if (args.length === 2) {
    console.error('Please enter a new name, description, and port for this project e.g. fcp-sfd-object-processor "The object processor for SFD" 3008')
    process.exit(1)
  }

  if (args.length !== 5 || !projectName || projectName.split('-').length < 3 || !description || !port) {
    const errorMessage = [
      'Please enter a new name, description, and port for this project',
      'The name must contain at least two hyphens and be in the form of <program>-<team>-<purpose> e.g. fcp-sfd-object-processor'
    ]

    console.error(errorMessage.join('\n'))
    process.exit(1)
  }

  return {
    projectName,
    description,
    port
  }
}

const confirmRename = async (projectName, description, port) => {
  const affirmativeAnswer = 'y'
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve, reject) => {
    rl.question(
      `Please check the following changes are correct:\n
      Project name: ${projectName}
      Description: ${description}
      Port: ${port}
      \nType ${affirmativeAnswer} for yes to confirm\n`,
      (answer) => {
        rl.close()
        resolve(answer === affirmativeAnswer)
      }
    )
  })
}

const getRootFiles = () => {
  return [
    'compose.yaml',
    'compose.debug.yaml',
    'compose.test.yaml',
    'compose.test.watch.yaml',
    'Dockerfile',
    'package.json',
    'package-lock.json',
    'README.md',
    'sonar-project.properties'
  ]
}

const getGitHubActions = () => {
  const dir = '.github/workflows'

  const files = [
    'check-pull-request.yaml',
    'publish.yaml',
    'publish-hotfix.yaml'
  ]

  return files.map(file => `${dir}/${file}`)
}

const getSonarlintFiles = () => {
  const dir = '.sonarlint'
  const files = ['connectedMode.json']

  return files.map(file => `${dir}/${file}`)
}

const getConfigFiles = () => {
  const dir = 'src'
  const files = ['config.js']

  return files.map(file => `${dir}/${file}`)
}

const getPortFiles = () => {
  return [
    'compose.yaml',
    'compose.test.yaml',
    'Dockerfile',
    'README.md'
  ]
}

const updateProjectName = async (projectName) => {
  const rootFiles = getRootFiles()
  const githubActions = getGitHubActions()
  const sonarlintFiles = getSonarlintFiles()

  const filesToUpdate = [
    ...rootFiles,
    ...githubActions,
    ...sonarlintFiles
  ]

  console.log(`\nUpdating project name in the following files:`)
  await Promise.all(filesToUpdate.map(async (file) => {
    console.log(file)
    const content = await fs.promises.readFile(file, 'utf8')
    const projectNameRegex = new RegExp(originalProjectName, 'g')
    const updatedContent = content.replace(projectNameRegex, projectName)
    return await fs.promises.writeFile(file, updatedContent)
  }))

  console.log(`Project name has been successfully updated to ${projectName}`)
}

const updateProjectDescription = async (description) => {
  const filesToUpdate = ['package.json']

  console.log(`\nUpdating project description in the package.json`)
  await Promise.all(filesToUpdate.map(async (file) => {
    const content = await fs.promises.readFile(file, 'utf8')
    const updatedContent = content.replace(originalDescription, description)
    return await fs.promises.writeFile(file, updatedContent)
  }))

  console.log(`Project description has been updated to "${description}"`)
}

const updatePort = async (port) => {
  const portFiles = getPortFiles()
  const configFiles = getConfigFiles()

  const filesToUpDate = [
    ...portFiles,
    ...configFiles
  ]

  console.log(`\nUpdating the port in the following files:`)
  await Promise.all(filesToUpDate.map(async (file) => {
    console.log(file)
    const content = await fs.promises.readFile(file, 'utf8')
    const portRegex = new RegExp(originalPort, 'g')
    const updatedContent = content.replace(portRegex, port)
    return await fs.promises.writeFile(file, updatedContent)
  }))
}

const rename = async () => {
  const { projectName, description, port } = processInput(process.argv)
  const rename = await confirmRename(projectName, description, port)

  if (rename) {
    await updateProjectName(projectName)
    await updateProjectDescription(description)
    await updatePort(port)
  } else {
    console.log('Unable to update project name and port')
  }
}

rename()
