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
        let requestedBump = null
        // let savedBump = 0

        for( c of commits.data.commits) {
            console.log(c)
            let message = c.message
            console.log(typeof message)
            // let currentBump

            // if(message.includes('#patch')) {
            //     currentBump = 1
            //     if(currentBump > savedBump) {
            //         savedBump = 1
            //         requestedBump = 'patch'
            //     }
            // }
            // if(message.includes('#minor')) {
            //     currentBump = 2
            //     if(currentBump > savedBump) {
            //         savedBump = 2
            //         requestedBump = 'minor'
            //     }
            // }
            // if(message.includes('#major')) {
            //     currentBump = 3
            //     if(currentBump > savedBump) {
            //         savedBump = 3
            //         requestedBump = 'major'
            //     }
            // }
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