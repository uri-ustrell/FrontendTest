(()=>{
	const searchButton = document.querySelector('#searchButton');
	const searchInput = document.querySelector('#searchInput');
	const searchResults = document.querySelector('#searchResults');
	const resultsTable = document.querySelector('#resultsTable');
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
		
		var avatar = document.createElement('img');
		avatar.setAttribute('src', user.avatar_url);
		avatar.setAttribute('alt', 'user\'s avatar image');
		avatar.setAttribute('width', '90px');
		avatar.setAttribute('height', '90px');

		var info = document.createElement('div');
		info.classList.add('d-inline-flex','flex-column','ml-3');

		var login = document.createElement('h6');
		login.classList.add('m-0');
		login.textContent = '@' + user.login;

		var name = document.createElement('h2');
		name.classList.add('m-0');
		name.textContent = user.name;

		var bio = document.createElement('p');
		bio.classList.add('m-0');
		bio.textContent = (user.bio === null) ? 'This user doesn\'t have bio' : user.bio ;

		info.appendChild(login);
		info.appendChild(name);
		info.appendChild(bio);
		
		resultProfile.appendChild(avatar);
		resultProfile.appendChild(info);
	}
	//print repos
	const printRepos = (repos) => {
	
		var reposHeader = document.createElement('b');
		reposHeader.id = 'reposHeader';
		reposHeader.classList.add('d-block', 'my-1');
		reposHeader.textContent = 'Repositories';

		resultsTable.before(reposHeader);

		repos.forEach((repo) => {
			
			var tr = document.createElement('tr');
			var th = document.createElement('th');
			var td = document.createElement('td');
			var i_star = document.createElement('i');
			var span_star = document.createElement('span');
			var i_fork = document.createElement('i');
			var span_fork = document.createElement('span');

			th.textContent = repo.name;
			td.classList.add('text-right','d-flex','blablacar');
			i_star.classList.add('fas', 'fa-star');
			span_star.textContent = repo.stargazers_count;
			i_fork.classList.add('fas', 'fa-code-branch');
			span_fork.textContent = repo.forks_count;

			td.appendChild(i_star);
			td.appendChild(span_star);
			td.appendChild(i_fork);
			td.appendChild(span_fork);
			tr.appendChild(th);
			tr.appendChild(td);
			resultRepos.appendChild(tr);
		});
	}
	//print error
	const printError = (error) => {
		var div = document.createElement('div');
		div.classList.add('alert','alert-danger','mt-3');
		div.textContent = error;

		resultRepos.appendChild(div);
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

		while (resultRepos.firstChild){
			resultRepos.removeChild(resultRepos.firstChild);
		}

		var b = document.getElementById('reposHeader');
		if ( b )
			searchResults.removeChild(document.getElementById('reposHeader'));

		while (resultProfile.firstChild){
			resultProfile.removeChild(resultProfile.firstChild);
		}

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