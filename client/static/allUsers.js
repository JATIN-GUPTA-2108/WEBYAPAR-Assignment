const url = 'https://assignment-webyapar.onrender.com/api/v1/allUser';

const fetchUsers = () => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			setUsers(data.data.data);
		})
		.catch((error) => console.error('Error:', error));
};

const fetchAccept = (userId) => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}/accept-user/${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			window.location.reload();
		})
		.catch((error) => console.error('Error:', error));
};

const resetUser = (userId) => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}/reset-user/${userId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			window.location.reload();
		})
		.catch((error) => console.error('Error:', error));
};

const setUsers = (user) => {
	const table = document.getElementById('table');
	const smTable = document.getElementById('small-table');

	const tableELements = user.map((i) => {
		return `
      <tr>
          <th scope="row">${i.userId}</th>
          <td>${i.username === null ? '-' : i.username}</td>
          <td>${
						i.image === null
							? '<img width="70px" height="70px" src="../public/image.png" class="rounded d-block" alt="image">'
							: `<img width="70px" height="70px" src="${i.image}" class="rounded d-block" alt="image">`
					}</td>
          <td>
					${
						i.accepted
							? `
						<div class="btn-flex">
							<button type="button" class="btn btn-outline-primary" id="delete" data-user-id="${i._id}">Delete</button>
						</div>
						`
							: `
						<div class="btn-flex">
							<button type="button" class="btn btn-primary accept" id="accept" data-user-id="${i._id}">Accept</button>
							<button type="button" class="btn btn-outline-primary" id="delete" data-user-id="${i._id}">Delete</button>
						</div>
						`
					}
					</td>
        </tr>
      `;
	});

	const smallTableElements = user.map((i) => {
		return `
		<div class="table2">
			<div class="upper">
				<div class="upper-left">UserId: ${i.userId}</div>
				<div class="upper-right">Name: ${i.username === null ? '-' : i.username}</div>
			</div>
			<div class="lower">
				<div class="lower-left">
					<span>photo: </span>
					<img src=${
						i.image === null ? '../public/image.png' : i.image
					} alt="image" width=50 height=50 />
				</div>
				<div class="lower-right">
					<span>Action: </span>
					<div class="btn-box2">
						${
							i.accepted
								? `
							<div class="btn-flex">
								<button 
									type="button" 
									class="btn btn-outline-primary btn-sm small" 
									id="delete" data-user-id="${i._id}">
									Delete
									</button>
							</div>
							`
								: `
							<div class="btn-flex">
								<button type="button" class="btn btn-primary accept btn-sm small" id="accept" data-user-id="${i._id}">Accept</button>
								<button type="button" class="btn btn-outline-primary btn-sm small" id="delete" data-user-id="${i._id}">Delete</button>
							</div>
							`
						}
					</div>
				</div>
			</div>
		</div>
		`;
	});

	table.innerHTML = `
    <table class="table table-striped table-bordered border-primary">
      <thead>
        <tr>
          <th scope="col">User Id</th>
          <th scope="col">Name</th>
          <th scope="col">Photo</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        ${tableELements.join('')}
      </tbody>
    </table>
      `;

	smTable.innerHTML = `${smallTableElements.join('')}`;
};

const accept = () => {
	const table = document.getElementById('table');
	const smTable = document.getElementById('small-table');

	table.addEventListener('click', (event) => {
		if (event.target.id === 'accept') {
			const userId = event.target.getAttribute('data-user-id');
			fetchAccept(userId);
		}
	});

	smTable.addEventListener('click', (event) => {
		if (event.target.id === 'accept') {
			const userId = event.target.getAttribute('data-user-id');
			fetchAccept(userId);
		}
	});
};

const reset = () => {
	const table = document.getElementById('table');
	const smTable = document.getElementById('small-table');

	table.addEventListener('click', (event) => {
		if (event.target.id === 'delete') {
			const userId = event.target.getAttribute('data-user-id');
			resetUser(userId);
		}
	});

	smTable.addEventListener('click', (event) => {
		if (event.target.id === 'delete') {
			const userId = event.target.getAttribute('data-user-id');
			resetUser(userId);
		}
	});
};

fetchUsers();
accept();
reset();
