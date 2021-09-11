const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')



try {
    const token = core.getInput('token')
    const defaultBump = core.getInput('default-bump')
    const withV = core.getInput('with-v')

    const client = github.getOctokit(core.getInput('token'))
    const tags = client.rest.repos.listTags()
    console.log(tags)
    console.log(token, defaultBump, withV)
} catch (error) {
  core.setFailed(error.message);
}