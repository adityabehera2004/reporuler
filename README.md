# RepoRuler
Chrome extension that displays GitHub repository size in the About section next to forks and stars. I created this because one time I accidentally cloned a repo that was 40GB.

## Get Extension
`insert chrome extenstion link after i register it`

## GitHub
Works for public repos. Private repos need a PAT.

## GitLab
Repos you own or are a contributor to (private or public) already have the size displayed in the Project Information section. Public repos need to have statistics publically enabled for non-contributors to get the size (most don't).

This extension will likely not be updated to include a GitLab integration because it is unnecessary for repos you contribute to (GitLab already displays it) and usually does not work for repos you don't contribute to (GitLab requires project statistics to be set to public).

## How to Test
1. Clone the repo
2. Go to `chrome://extensions/`
3. Toggle "Developer mode" switch in the top-right corner
4. Click "Load unpacked" button and select the repo