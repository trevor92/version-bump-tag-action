const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')
const semverSort = require('semver-sort')

const run = async () => {
    try {
        const token = core.getInput('token')
        const defaultBump = core.getInput('default-bump')
        const withV = core.getInput('with-v')
        const ownerrepository = core.getInput('repository')
    
        const repoOwner = (ownerrepository.substring(0, ownerrepository.indexOf('/')))
        const repository = ownerrepository.substring(ownerrepository.indexOf('/') + 1)
        const octokit = github.getOctokit(token)
        const results = await octokit.rest.repos.listTags({ owner: repoOwner, repo: repository, })
        // const repoTagsValues = results.data.map(tag => tag.name)
        const semverTags = results.data.map(tag => {
            if(semver.valid(tag.name)){
                return tag.name
            }
        })
        console.log(semverTags)
        const latestTag = semverSort.desc(semverTags)[0]
        console.log(latestTag)
        const newTag = semver.inc(latestTag, 'patch')
        console.log(newTag)
        // console.log('OCTOKIT:', results.data)
        
    } catch (error) {
        console.log('ERROR:', error)
      core.setFailed(error.message);
    }
}

run();