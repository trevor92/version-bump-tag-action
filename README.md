# Version Bump Tag Action

This action automatically bumps up the version of the tag based on the default bump specified or explicitly from tag triggers in the commit messages.

# Usage
```
name: Bump version and push tag
on: 
    push: 
        branches: 
            - main
            - master
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v3
          with: 
            fetch-depth: '0'
        - name: Bump version and push tag
        uses: trevor92/version-bump-tag-action@v0.0.2
        with: 
          token: ${{ secrets.TOKEN }}
          with-v: true
          default-bump: patch
```
## Options
Environment Variables

* token (required) - Required for permission to tag the repo.

* default-bump (optional) - Which type of bump to use when none explicitly provided (default: patch).

* with-v (optional) - Tag version with v character.

## Outputs
* new_tag - Value of the newly created tag.

## Version Bumping
Manual Bumping: This will be triggered by commit messages that include #major, #minor, and #patch.

Automatic Bumping: If #major, #minor, and #patch are not present in any of the commit messages then the tag bumping will be based on the default bump (default is patch).