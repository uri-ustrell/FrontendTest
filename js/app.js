(()=>{
	const searchButton = document.querySelector('#searchButton');
	const searchInput = document.querySelector('#searchInput');
	const searchResults = document.querySelector('#searchResults');
	var resultRepos = document.querySelector('#resultRepos');
	var resultProfile = document.querySelector('#resultProfile');
	var user;
	var repos;
	//fetch user
	//I decided to do it with no authentication to amke it quicker
		//if exists user --> return repos's url
		//if not exists --> return error
	const fetchUser = async (userToFetch) => {
		await fetch(`https://api.github.com/users/${userToFetch}`)
			.then( (response) => (!response.ok) ? 404 : response.json() )
			.then( (data) => { user = data })
			.catch( (error) => console.error );
	};

	//fetch repos
		//return array of repos
	const fetchRepos = async (reposUrl)=> {
		await fetch(reposUrl)
			.then( (response) => (!response.ok) ? 404 : response.json() )
			.then( (data) => { repos = data })
			.catch( (error) => console.error );
	}
	//print profile
	const printProfile = (user) => {
		var profileView = `
			<img src="${user.avatar_url}" alt="user profile photo" with="90px" height="90px">
			<div class="d-inline-flex  flex-column  ml-3">
				<h4 class="m-0">@${user.login}</h4>
				<h2 class="m-0">${user.name}</h2>
				<p class="m-0">${user.bio}</p>
			</div>
		`;
		
		resultProfile.innerHTML = profileView;
	}
	//print repos
	const printRepos = (repos) => {
		var reposTable = '<b class="d-block my-1">Repositories</b>';
		var reposInfo = [];

		repos.map((repo) => reposInfo.push([repo.name, repo.stargazers_count, repo.forks_count]));
		
		reposInfo.forEach((repo) => {
			reposTable += `
				<tr>
					<th>${repo[0]}</th>
					<td class="text-right">
						<i class="fas fa-star"></i> ${repo[1]} 
						<i class="fas fa-code-branch"></i> ${repo[2]}
					</td>
				</tr>
			`;
		})

		resultRepos.innerHTML = reposTable;
	}
	//print error
	const printError = (error) => {
		resultRepos.innerHTML = `
			<div class="alert alert-danger mt-3" role="alert">
				${error}
			</div>
		`;
	}
	//search Repos
		//clean previows search
		//display results box
		//fetch user
		//display info user or error
		//fetch repos
		//display repos or error
		//clean and reFocus search value
	const searchRepos = async (userToFetch) => {

		resultRepos.innerHTML = '';
		resultProfile.innerHTML = '';

		searchResults.removeAttribute("hidden");

		await fetchUser(userToFetch);

		if (user === 404)
			return printError('This user doesn\'t exist');
		else
			printProfile(user);

		await fetchRepos(user.repos_url);

		if (!repos.length)
			return printError('This user have no repositories');
		else
			printRepos(repos);

		searchInput.value = '';
		searchInput.focus();
	}

	//listeners 
		//--> trigger action since search button is clicked
		//--> trigger action since enter is clicked
	searchButton.addEventListener('click', () => {
		var inputValue = searchInput.value;
		searchRepos(inputValue);
	});

	searchInput.addEventListener('keyup', (ev) => {
		if (ev.which === 13){
			var inputValue = searchInput.value;
			searchRepos(inputValue);
		}
	});
	

})();