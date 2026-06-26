import * as core from '@actions/core'
import {DefaultArtifactClient} from '@actions/artifact'
import {readdir} from 'fs/promises'
import {join, resolve} from 'path'

async function run(): Promise<void> {
  const name = core.getInput('name', {required: true})
  const basePath = resolve(core.getInput('path', {required: true}))
  const retentionDays = parseInt(core.getInput('retention-days')) || undefined

  const subdirs = await listSubdirectories(basePath)
  if (subdirs.length === 0) {
    core.warning(`No subdirectories found in ${basePath}`)
    return
  }

  core.info(`Found ${subdirs.length} subdirectories: ${subdirs.join(', ')}`)

  const uploaded = await uploadAll(subdirs, {name, basePath, retentionDays})
  core.setOutput('artifacts', JSON.stringify(uploaded))
}

async function listSubdirectories(basePath: string): Promise<string[]> {
  const entries = await readdir(basePath, {withFileTypes: true})
  return entries.filter(e => e.isDirectory()).map(e => e.name)
}

async function uploadAll(
  subdirs: string[],
  opts: {name: string; basePath: string; retentionDays?: number},
): Promise<string[]> {
  const client = new DefaultArtifactClient()
  const results = await Promise.all(
    subdirs.map(subdir => uploadSubdir(client, subdir, opts)),
  )
  return results.filter((r): r is string => r !== null)
}

async function uploadSubdir(
  client: DefaultArtifactClient,
  subdir: string,
  opts: {name: string; basePath: string; retentionDays?: number},
): Promise<string | null> {
  const artifactName = `${opts.name}-${subdir}`
  const rootDir = join(opts.basePath, subdir)
  const files = await findFiles(rootDir)

  if (files.length === 0) {
    core.warning(`No files found in ${rootDir}, skipping ${artifactName}`)
    return null
  }

  core.info(`Uploading ${artifactName}: ${files.length} files from ${rootDir}`)
  const result = await client.uploadArtifact(artifactName, files, rootDir, {
    retentionDays: opts.retentionDays,
  })
  core.info(`Uploaded ${artifactName} (id: ${result.id}, size: ${result.size})`)
  return artifactName
}

async function findFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {recursive: true, withFileTypes: true})
  return entries.filter(e => e.isFile()).map(e => join(e.parentPath, e.name))
}

run().catch(error => {
  core.setFailed((error as Error).message)
})
