// Popup script for RepoRuler extension

document.addEventListener('DOMContentLoaded', () => {
  const patInput = document.getElementById('patInput');
  const linkButton = document.getElementById('linkButton');
  const helpButton = document.getElementById('helpButton');
  const helpText = document.getElementById('helpText');
  const status = document.getElementById('status');

  // Load existing PAT
  chrome.storage.sync.get(['githubPAT'], (result) => {
    if (result.githubPAT) {
      patInput.value = result.githubPAT;
    }
  });

  // Save PAT when input changes
  patInput.addEventListener('blur', () => {
    const pat = patInput.value.trim();
    if (pat) {
      chrome.storage.sync.set({ githubPAT: pat }, () => {
        status.textContent = 'PAT saved!';
        status.classList.add('show');
        setTimeout(() => {
          status.classList.remove('show');
        }, 2000);
      });
    } else {
      chrome.storage.sync.remove('githubPAT', () => {
        status.textContent = 'PAT removed!';
        status.classList.add('show');
        setTimeout(() => {
          status.classList.remove('show');
        }, 2000);
      });
    }
  });

  // Open PAT creation page
  linkButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/settings/personal-access-tokens/new' });
  });

  // Toggle help text
  helpButton.addEventListener('click', () => {
    helpText.classList.toggle('show');
  });
});

