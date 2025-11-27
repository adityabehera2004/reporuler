# Privacy Policy

## Data Collection

RepoRuler does not collect, track, or transmit any personal information or usage data.

## GitHub Personal Access Token (PAT)

If you choose to provide a GitHub Personal Access Token (PAT) through the extension popup:

- **Storage**: The PAT is stored locally on your device using Chrome's secure storage API (`chrome.storage.sync`)
- **Usage**: The PAT is only used to authenticate API requests to GitHub's official API endpoint: `https://api.github.com/repos/{owner}/{repo}`
- **Purpose**: The PAT is used solely to retrieve the `size` field from repository metadata for private repositories you have access to
- **Sharing**: The PAT is never shared with third parties, sent to any servers other than GitHub's official API, or used for any purpose other than fetching repository size information
- **Removal**: You can remove your PAT at any time by clearing the input field in the extension popup

## Public Repositories

For just getting the sizes of public repositories, no authentication is required and no data is stored. You do not need to provide a PAT for this extension to work on public repositories.

## No Analytics or Tracking

This extension does not:
- Collect analytics or usage statistics
- Track user behavior
- Send data to third-party services
- Use cookies or tracking technologies

## Contact

If you have questions about this privacy policy, please contact us through the Chrome Web Store listing.

