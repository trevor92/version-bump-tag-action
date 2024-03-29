const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

const semver = require('semver')
const semverSort = require('semver-sort')

const run = async () => {
    try {
        const token = core.getInput('token')
        const defaultBump = core.getInput('default-bump') || 'patch'
        const withV = core.getInput('with-v')
        const { GITHUB_SHA } = process.env
    
        const octokit = getOctokit(token)
        const repoTags = await octokit.rest.repos.listTags({ ...context.repo, per_page: 1000, page: 1 })
       
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
    
        // Check array to see if it is an array and is not empty
        if (Array.isArray(commitsSinceLastTag) && !arr.length) {
            core.setFailed('No commits since last tag')
        }
        let requestedBump
        let savedBump = 0

        // Parse commits since last time to determine what the next semver bump should be
        const commitMessages = commitsSinceLastTag.data.commits.map(commitData => { return commitData.commit.message })
        
        for(const c of commitMessages) {
            let currentBump
            if(c.includes('#patch')) {
                currentBump = 1
                if(currentBump > savedBump) {
                    savedBump = 1
                    requestedBump = 'patch'
                }
            }
            if(c.includes('#minor')) {
                currentBump = 2
                if(currentBump > savedBump) {
                    savedBump = 2
                    requestedBump = 'minor'
                }
            }
            if(c.includes('#major')) {
                currentBump = 3
                if(currentBump > savedBump) {
                    savedBump = 3
                    requestedBump = 'major'
                }
            }
        }

        console.log('REQUESTED BUMP is:', requestedBump)
        
        // Determine what new tag will be based on bump
        let newTag = semver.inc(latestTag, (requestedBump || defaultBump))
        if(withV) {
            newTag = 'v'+ newTag
        }

        // Create tag on repository
        await octokit.rest.git.createRef({
            ...context.repo, 
            ref: `refs/tags/${newTag}`,
            sha: GITHUB_SHA 
        })

        console.log('New tag created:', newTag)
        // Set action output(s)
        core.setOutput('new-tag', newTag)
        
    } catch (error) {
        core.setFailed('ERROR:', error);
    }
}

run();