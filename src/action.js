const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')
const { execSync } = require('child_process')

const run = async () => {
    try {
        const token = core.getInput('token')
        const defaultBump = core.getInput('default-bump')
        const withV = core.getInput('with-v')
        const ownerrepository = core.getInput('repository')
    
        const owner = ('/'+ ownerrepository.substring(0, ownerrepository.indexOf('/')))
        const repository = ownerrepository.substring(ownerrepository.indexOf('/') + 1)
        const octokit = github.getOctokit(token)
        const latestTag = execSync('git describe --tags --abbrev=0', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            return;
            // console.log(`stdout: ${stdout}`);
        })

        const commitsSinceLastTag = execSync(`git log ${latestTag}..HEAD --pretty=format:"%s"'`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            return stdout;
        })

        console.log(commitsSinceLastTag)
        // console.log(octokit)
        // const { context = {} } = github
        // console.log(context.repository)
        // const { owner: currentOwner, name: currentRepo } = context.repository
        const results = await octokit.rest.repos.listTags({ owner, repository})
        console.log('OCTOKIT:', results)
        console.log(token, defaultBump, withV)
    } catch (error) {
        console.log('ERROR:', error)
      core.setFailed(error.message);
    }
}

run();