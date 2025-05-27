#!/usr/bin/env node

import fs from 'fs'
import readline from 'readline'

const originalProjectName = 'fcp-sfd-accelerator'

const processInput = (args) => {
  const [, , projectName] = args

  if (args.length !== 3 || !projectName || projectName.split('-').length < 3) {
    const errorMessage = [
      'Please enter a new name for this repository (it should match the repository name)',
      'The name must contain at least two hyphens and be in the form of <program>-<team>-<purpose> e.g. fcp-sfd-accelerator'
    ]

    console.error(errorMessage.join('\n'))
    process.exit(1)
  }

  return { projectName }
}

const confirmRename = async (projectName) => {
  const affirmativeAnswer = 'y'
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve, reject) => {
    rl.question(`Do you want to rename this project to ${projectName}?\nType ${affirmativeAnswer} for yes to confirm\n`, (answer) => {
      rl.close()
      resolve(answer === affirmativeAnswer)
    })
  })
}

const getRootFiles = () => {
  return [
    'compose.yaml',
    'compose.debug.yaml',
    'compose.test.yaml',
    'compose.test.watch.yaml',
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

const updateProjectName = async (projectName) => {
  const rootFiles = getRootFiles()
  const githubActions = getGitHubActions()
  const sonarlintFiles = getSonarlintFiles()

  const filesToUpdate = [
    ...rootFiles,
    ...githubActions,
    ...sonarlintFiles
  ]

  console.log(`Updating project name from ${originalProjectName} to ${projectName} in the following files:`)
  await Promise.all(filesToUpdate.map(async (file) => {
    console.log(file)
    const content = await fs.promises.readFile(file, 'utf8')
    const projectNameRegex = new RegExp(originalProjectName, 'g')
    const updatedContent = content.replace(projectNameRegex, projectName)
    return await fs.promises.writeFile(file, updatedContent)
  }))

  console.log(`Project name has been successfully updated to ${projectName}`)
}

const rename = async () => {
  const { projectName } = processInput(process.argv)
  const rename = await confirmRename(projectName)

  if (rename) {
    await updateProjectName(projectName)
  } else {
    console.log('Unable to update project name')
  }
}

rename()
