const url = 'https://assignment-webyapar.onrender.com/api/v1/allUser';

const fetchUsers = () => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}/getTwoUsers`, {
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

const createUserApi = (postData) => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(postData),
	})
		.then((response) => response.json())
		.then((data) => {
			window.location.reload();
		})
		.catch((error) => console.error('Error:', error));
};

const setUsers = (user) => {
	const userBox = document.getElementById('user');

	userBox.innerHTML = user.map((i) => {
		return `
      <div class="users">
				<div class="userId">${i.userId}</div>
			</div>
      `;
	});
};

const createUser = () => {
	const userId = document.getElementById('create-user-userId');
	const password = document.getElementById('create-user-password');
	const createBtn = document.getElementById('create-btn');

	createBtn.addEventListener('click', (event) => {
		event.preventDefault();

		const postData = {
			userId: userId.value,
			password: password.value,
		};

		createUserApi(postData);
	});
};

fetchUsers();
createUser();
