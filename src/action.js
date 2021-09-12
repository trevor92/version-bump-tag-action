const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')

const run = async () => {
    try {
        const token = core.getInput('token')
        const defaultBump = core.getInput('default-bump')
        const withV = core.getInput('with-v')
    
        const octokit = github.getOctokit(token)
        console.log(octokit)
        const { context = {} } = github
        console.log(context)
        // const { owner: currentOwner, repo: currentRepo } = context.repo
    
        // console.log(currentOwner, currentRepo);
        console.log('OCTOKIT:', await octokit.rest.repos.listTags())
        
        console.log(token, defaultBump, withV)
    } catch (error) {
      core.setFailed(error.message);
    }
}

run();