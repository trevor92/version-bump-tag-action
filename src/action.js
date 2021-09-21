const core = require('@actions/core')
// const github = require('@actions/github')
const { context, getOctokit } = require('@actions/github')
const { analyzeCommits } = require('@semantic-release/commit-analyzer')

const semver = require('semver')
const semverSort = require('semver-sort')
const { exec } = require('child_process')

const run = async () => {
    try {
        const token = core.getInput('token')
        const defaultBump = core.getInput('default-bump')
        const withV = core.getInput('with-v')
        const ownerrepository = core.getInput('repository')
        const { GITHUB_SHA } = process.env
    
        const octokit = getOctokit(token)
        const repoTags = await octokit.rest.repos.listTags({ ...context.repo, per_page: 1000, page: 1 })
        // Get the owner and repository from environment variable
        // const repoOwner = (ownerrepository.substring(0, ownerrepository.indexOf('/')))
        // const repository = ownerrepository.substring(ownerrepository.indexOf('/') + 1)
        // const octokit = github.getOctokit(token)
        // const results = await octokit.rest.repos.listTags({ owner: repoOwner, repo: repository, })
       
        //Get semver tags
        const semverTags = repoTags.data.map(tag => {
            if(semver.valid(tag.name) !== null || undefined) {
                return tag.name
            }
        })

        // Sort semver tags to get the latest tag
        const sortedTags = semverSort.desc(semverTags)
        const latestTag = sortedTags[0]
        console.log('Latest tag is:', latestTag)

        const commitsSinceLastTag = await octokit.rest.repos.compareCommits({ ...context.repo, base: latestTag, head: 'HEAD' })
        // console.log(commitsSinceLastTag.data.commits)
        // Parse commits since last time to determine
        // what the next semver bump should be
        // const commitResults = await octokit.rest.repos.compareCommits({ owner: repoOwner, repo: repository, base: latestTag, head: 'HEAD'})
        let requestedBump = null
        let savedBump = 0
        // console.log(commitsSinceLastTag.data.commits[0])

        for( c of commitsSinceLastTag.data.commits) {
            console.log(c.commit.message)
            requestedBump = await analyzeCommits([{type: 'PATCH', release: 'patch'}, {type: 'MINOR', release: 'minor'}, {type: 'MAJOR', release: 'major'}], c.commit.message)
            // const message = c.commit.message
            // console.log(message)
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
        
        // Create new tag on repository and set output
        // as new tag
        let newTag = semver.inc(latestTag, requestedBump || defaultBump)
        if(withV) {
            newTag = 'v'+ newTag
        }

        // const createdTag = await octokit.rest.git.createRef({
        //     ...context.repo,
        //     ref: `refs/tags/${newTag}`,
        //     sha: GITHUB_SHA
        // })

        const runShellCommand = async (cmd) => {
            return new Promise((resolve, reject) => {
                exec(cmd, (err, stdout, stderr) => {
                    if(err) {
                        reject()
                        return
                    }
                    if(stderr) {
                        console.log(stderr)
                        reject(stderr)
                        return
                    }
                    resolve(stdout)
                })
            })
        }
        // const tagCreated = await runShellCommand(`git tag ${latestTag}`)
        // console.log(tagCreated)
        const tagPushed = await runShellCommand(`git push origin ${newTag}`)
        // console.log(tagPushed)
        console.log('New tag created:', newTag)
        core.setOutput(newTag)
        
    } catch (error) {
        console.log('ERROR:', error)
        core.setFailed(error.message);
    }
}

run();