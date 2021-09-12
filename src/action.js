const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')

const run = async () => {
    try {
        const token = core.getInput('token')
        const defaultBump = core.getInput('default-bump')
        const withV = core.getInput('with-v')
        const ownerrepository = core.getInput('repository')
    
        const owner = ownerrepository.substring(0, ownerrepository.indexOf('/') + 1)
        const repository = ownerrepository.substring(ownerrepository.indexOf('/') + 1)
        const octokit = github.getOctokit(token)
        // console.log(octokit)
        // const { context = {} } = github
        // console.log(context.repository)
        // const { owner: currentOwner, name: currentRepo } = context.repository
    
        console.log('OCTOKIT:', await octokit.rest.repos.listTags(owner, repository))
        
        console.log(token, defaultBump, withV)
    } catch (error) {
      core.setFailed(error.message);
    }
}

run();