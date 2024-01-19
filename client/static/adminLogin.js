const url = 'https://assignment-webyapar.onrender.com/api/v1/allUser';

const login = (postData) => {
	fetch(`${url}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(postData),
	})
		.then((response) => response.json())
		.then((data) => {
			const expire = new Date().getTime() + 1296000000;
			typeof data.token !== 'undefined' &&
				localStorage.setItem(
					'Token',
					JSON.stringify({ value: `${data.token}`, expires: expire })
				);

			window.location.replace(
				'https://assignment-webyapar-client.onrender.com/pages/createUserPage.html'
			);
		})
		.catch((error) => console.error('Error:', error));
};

const adminLoginFunctionality = () => {
	const loginBtnAdmin = document.getElementById('login-btn-admin');
	const adminFormUserId = document.getElementById('admin-form-userId');
	const adminFormPassword = document.getElementById('admin-form-password');

	adminFormUserId.value = '1111';
	adminFormPassword.value = 'test1234';

	loginBtnAdmin?.addEventListener('click', function (event) {
		event.preventDefault();

		const postData = {
			userId: adminFormUserId.value,
			password: adminFormPassword.value,
		};

		login(postData);
	});
};

adminLoginFunctionality();
