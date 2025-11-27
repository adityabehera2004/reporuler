// Popup script for RepoRuler extension

document.addEventListener('DOMContentLoaded', () => {
  const patInput = document.getElementById('patInput');
  const linkButton = document.getElementById('linkButton');
  const helpButton = document.getElementById('helpButton');
  const helpText = document.getElementById('helpText');
  const indicatorBox = document.getElementById('indicatorBox');
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeSlashIcon = document.getElementById('eyeSlashIcon');
  
  let isVisible = false;
  let originalValue = '';

  // Load existing PAT
  chrome.storage.sync.get(['githubPAT'], (result) => {
    if (result.githubPAT) {
      patInput.value = result.githubPAT;
      originalValue = result.githubPAT;
    }
  });

  // Toggle password visibility
  indicatorBox.addEventListener('click', () => {
    isVisible = !isVisible;
    if (isVisible) {
      patInput.type = 'text';
      eyeIcon.style.display = 'block';
      eyeSlashIcon.style.display = 'none';
    } else {
      patInput.type = 'password';
      eyeIcon.style.display = 'none';
      eyeSlashIcon.style.display = 'block';
    }
  });

  // Save PAT when input changes and loses focus
  patInput.addEventListener('blur', () => {
    const pat = patInput.value.trim();
    const hasChanged = pat !== originalValue;
    
    if (hasChanged) {
      if (pat) {
        chrome.storage.sync.set({ githubPAT: pat }, () => {
          originalValue = pat;
        });
      } else {
        chrome.storage.sync.remove('githubPAT', () => {
          originalValue = '';
        });
      }
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

