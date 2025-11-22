// RepoRuler - Chrome Extension
// Displays repository size on GitHub repo pages

(function() {
  'use strict';

  // Check if we're on a GitHub repo page (main page, not sub-pages)
  function isRepoPage() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    
    // Should be exactly 2 parts: owner and repo name
    if (parts.length !== 2) {
      return false;
    }
    
    // Exclude common sub-pages
    const excludedPaths = ['tree', 'blob', 'pull', 'issues', 'pulls', 'actions', 'projects', 'wiki', 'security', 'settings', 'commits', 'branches', 'tags', 'releases', 'compare'];
    const pathLower = path.toLowerCase();
    
    for (const excluded of excludedPaths) {
      if (pathLower.includes(`/${excluded}/`) || pathLower.endsWith(`/${excluded}`)) {
        return false;
      }
    }
    
    return true;
  }

  // Extract owner and repo from URL
  function getRepoInfo() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    if (parts.length >= 2) {
      return {
        owner: parts[0],
        repo: parts[1]
      };
    }
    return null;
  }

  // Format size from KB to human-readable format
  function formatSize(kb) {
    if (kb === 0) {
      return { value: '<1', unit: 'KB' };
    } else if (kb < 1024) {
      return { value: kb, unit: 'KB' };
    } else if (kb < 1024 * 1024) {
      return { value: (kb / 1024).toFixed(1), unit: 'MB' };
    } else if (kb < 1024 * 1024 * 1024) {
      return { value: (kb / (1024 * 1024)).toFixed(1), unit: 'GB' };
    } else {
      return { value: (kb / (1024 * 1024 * 1024)).toFixed(1), unit: 'TB' };
    }
  }

  // Fetch repository size from GitHub API
  // Returns: size in KB, null for other errors, or false for 404 (don't display)
  async function fetchRepoSize(owner, repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!response.ok) {
        // 404 means repository not found or no access - don't display anything
        if (response.status === 404) {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.size; // Size is in KB
    } catch (error) {
      console.error('RepoRuler: Error fetching repo size:', error);
      return null;
    }
  }

  // Find the forks stat div to insert after it
  function findForksStat() {
    // Best method: look for the "Forks" heading and get the next div
    const forksHeading = Array.from(document.querySelectorAll('h3.sr-only')).find(
      h => h.textContent.trim() === 'Forks'
    );
    if (forksHeading) {
      // Get the next sibling that is a div with class "mt-2"
      let nextSibling = forksHeading.nextElementSibling;
      while (nextSibling) {
        if (nextSibling.tagName === 'DIV' && nextSibling.classList.contains('mt-2')) {
          return nextSibling;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    }
    
    // Fallback: look for the forks link and find its parent div.mt-2
    const forkLink = document.querySelector('a[href*="/forks"]') || 
                     document.querySelector('a[href*="/network/members"]');
    
    if (forkLink) {
      // Find the parent div with class "mt-2" that contains the forks link
      let parent = forkLink.parentElement;
      while (parent && parent !== document.body) {
        if (parent.tagName === 'DIV' && parent.classList.contains('mt-2') && parent.contains(forkLink)) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }
    
    return null;
  }

  // Get the ruler SVG icon (vertical line with caps and two middle marks)
  function getRulerIcon() {
    // Vertical line: x=7.25, y=2, width=1.5, height=12 (no rounded edges)
    // Top cap: x=5, y=2, width=6, height=1.5, rx=0.3, ry=0.3
    // Bottom cap: x=5, y=12.5, width=6, height=1.5, rx=0.3, ry=0.3
    // Two middle lines: x=6, width=4, height=1.0, rx=0.3, ry=0.3
    //   - First: y=5.833
    //   - Second: y=9.167
    return `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-ruler mr-2">
  <rect x="7.25" y="2" width="1.5" height="12" fill="currentColor"/>
  <rect x="5" y="2" width="6" height="1.5" rx="0.3" ry="0.3" fill="currentColor"/>
  <rect x="5" y="12.5" width="6" height="1.5" rx="0.3" ry="0.3" fill="currentColor"/>
  <rect x="6" y="5.833" width="4" height="1.0" rx="0.3" ry="0.3" fill="currentColor"/>
  <rect x="6" y="9.167" width="4" height="1.0" rx="0.3" ry="0.3" fill="currentColor"/>
</svg>`;
  }

  // Inject the size display
  function injectSizeDisplay(size, owner, repo) {
    // Remove any existing size display
    const existing = document.querySelector('[data-reporuler="size"]');
    if (existing) {
      existing.remove();
    }

    const rulerIcon = getRulerIcon();
    
    // Find the forks stat div
    const forksStat = findForksStat();
    
    if (forksStat && forksStat.parentElement) {
      // Create the size stat div matching GitHub's structure
      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'mt-2';
      sizeDiv.setAttribute('data-reporuler', 'size');
      
      // Create the link element pointing to the GitHub API endpoint
      const sizeLink = document.createElement('a');
      sizeLink.className = 'Link Link--muted';
      sizeLink.setAttribute('data-view-component', 'true');
      sizeLink.href = `https://api.github.com/repos/${owner}/${repo}`;
      
      // Check if size is available, otherwise show "unknown size"
      if (size === null || size === undefined) {
        sizeLink.innerHTML = `
          ${rulerIcon}
          unknown size
        `;
      } else {
        const formatted = formatSize(size);
        sizeLink.innerHTML = `
          ${rulerIcon}
          <strong>${formatted.value}</strong>
          ${formatted.unit}
        `;
      }
      
      sizeDiv.appendChild(sizeLink);
      
      // Insert after the forks stat
      const nextSibling = forksStat.nextSibling;
      if (nextSibling) {
        forksStat.parentElement.insertBefore(sizeDiv, nextSibling);
      } else {
        forksStat.parentElement.appendChild(sizeDiv);
      }
    }
  }

  // Main function to run on page load
  async function init() {
    if (!isRepoPage()) {
      return;
    }

    const repoInfo = getRepoInfo();
    if (!repoInfo) {
      return;
    }

    // Wait for page to load and retry if needed
    let retries = 5;
    while (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const size = await fetchRepoSize(repoInfo.owner, repoInfo.repo);
      
      // If 404, don't display anything
      if (size === false) {
        break;
      }
      
      // Check if already injected
      if (document.querySelector('[data-reporuler="size"]')) {
        break; // Already displayed
      }
      
      // Try to inject, retry if the section isn't found yet
      const forksStat = findForksStat();
      if (forksStat) {
        // Inject with size (can be null for "unknown size")
        injectSizeDisplay(size, repoInfo.owner, repoInfo.repo);
        break;
      } else if (retries > 1) {
        // Wait longer and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      retries--;
    }
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also run when navigating (GitHub uses SPA navigation)
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(init, 1500); // Wait for navigation to complete
    }
  });
  urlObserver.observe(document, { subtree: true, childList: true });
  
  // Also observe the main content area for changes
  let contentTimeout;
  const mainContent = document.querySelector('main, [role="main"], .application-main');
  if (mainContent) {
    const contentObserver = new MutationObserver(() => {
      // Debounce: wait a bit before checking
      clearTimeout(contentTimeout);
      contentTimeout = setTimeout(() => {
        if (isRepoPage() && !document.querySelector('[data-reporuler="size"]')) {
          init();
        }
      }, 1000);
    });
    contentObserver.observe(mainContent, { subtree: true, childList: true });
  }
})();

