document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const userList = document.getElementById('user-list');
    const repositories = document.getElementById('repositories');
  
    const baseURL = 'https://api.github.com';
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = searchInput.value.trim();
      if (username === '') {
        alert('Please enter a GitHub username');
        return;
      }
      searchUsers(username);
      searchInput.value = '';
    });
  
    function searchUsers(username) {
      const searchURL = `${baseURL}/search/users?q=${username}`;
      fetch(searchURL, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayUsers(data.items);
      })
      .catch(error => {
        console.error('Error fetching GitHub users:', error);
        alert('Failed to fetch GitHub users. Please try again.');
      });
    }
  
    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.innerHTML = `
          <img src="${user.avatar_url}" alt="Avatar of ${user.login}">
          <h4>${user.login}</h4>
          <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        userDiv.addEventListener('click', function() {
          getUserRepositories(user.login);
        });
        userList.appendChild(userDiv);
      });
    }
  
    function getUserRepositories(username) {
      const reposURL = `${baseURL}/users/${username}/repos`;
      fetch(reposURL, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(repos => {
        displayRepositories(repos);
      })
      .catch(error => {
        console.error('Error fetching GitHub repositories:', error);
        alert('Failed to fetch GitHub repositories. Please try again.');
      });
    }
  
    function displayRepositories(repos) {
      repositories.innerHTML = '';
      const repoList = document.createElement('ul');
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.textContent = repo.full_name;
        repoList.appendChild(repoItem);
      });
      repositories.appendChild(repoList);
    }
  });
  