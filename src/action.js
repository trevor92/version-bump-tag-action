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
            if(semver.valid(tag.name) !== null) {
                return tag.name
            }
        })
        console.log(semverTags)
        const sortedTags = semverSort.desc(semverTags)
        const latestTag = sortedTags[0]
        // const previousTag = sortedTags[1]
        console.log(latestTag)
        const commits = await octokit.rest.repos.compareCommits({ owner: repoOwner, repo: repository, base: latestTag, head: 'HEAD'})
        console.log(commits.data.commits)
        let requestedBump = null
            if(commits.data.commits.includes('#patch')) {
                requestedBump =  'patch'
            }
            if(commits.data.commits.includes('#minor')) {
                requestedBump =  'minor'
            }
            if(commits.data.commits.includes('#major')) {
                requestedBump = 'major'
            }
            
        
        console.log(requestedBump)
        const newTag = semver.inc(latestTag, requestedBump || defaultBump)
        console.log(newTag)
        core.setOutput(newTag)
        // console.log('OCTOKIT:', results.data)
        
    } catch (error) {
        console.log('ERROR:', error)
      core.setFailed(error.message);
    }
}

run();