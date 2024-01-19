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
				'https://assignment-webyapar-client.onrender.com/pages/uploadPhotoPage.html'
			);
		})
		.catch((error) => console.error('Error:', error));
};

const userLoginFunctionality = () => {
	const loginBtnUser = document.getElementById('login-btn-user');

	const userFormUserId = document.getElementById('user-form-userId');
	const userFormPassword = document.getElementById('user-form-password');

	loginBtnUser?.addEventListener('click', function (event) {
		event.preventDefault();

		const postData = {
			userId: userFormUserId.value,
			password: userFormPassword.value,
		};
		login(postData);
	});
};

userLoginFunctionality();
