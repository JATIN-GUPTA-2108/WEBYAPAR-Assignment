const url = 'https://assignment-webyapar.onrender.com/api/v1/allUser';

const viewBtn = document.getElementById('view');
const closeBtn = document.getElementById('close');
const offcanvasElement = document.getElementById('offcanvas');

viewBtn.addEventListener('click', () => {
	offcanvasElement.classList.add('show');
});

closeBtn.addEventListener('click', () => {
	offcanvasElement.classList.remove('show');
});

const fetchUser = () => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			const userData = data.data.data;
			if (userData.image !== null && userData.username !== null) {
				setProfile(userData);
			}
		})
		.catch((error) => console.error('Error:', error));
};

const setProfile = (data) => {
	const body = document.getElementById('offcanvas-body');

	body.innerHTML = `
		<div class="side-bar">
			<div class="name-section">
				<label>Name: </label>
				<div class="box">
					<span>${data.username}</span>
				</div>
			</div>
			<img src="${data.image}" alt="image" width=300 height=300 />
			<div class="bellow-txt">
				${
					data.accepted
						? '<span class="green-txt">Accepted By Admin</span>'
						: '<span class="red-txt">Not Accepted By Admin</span>'
				}
			</div>
		</div>
	`;
};

const updateUser = (userDetails) => {
	const token = JSON.parse(localStorage.getItem('Token'))?.value;

	fetch(`${url}/me`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: userDetails,
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			window.location.reload();
		})
		.catch((error) => console.error('Error:', error));
};

const update = () => {
	const upload = document.getElementById('upload-btn');
	const fileInput = document.getElementById('formFile');
	const preview = document.getElementById('preview');
	const username = document.getElementById('username');

	const formData = new FormData();

	let cropper;

	fileInput.addEventListener('change', function () {
		if (fileInput.files.length > 0) {
			const reader = new FileReader();

			reader.onload = function (e) {
				fileInput.classList.add('hide');
				preview.innerHTML = `
					<div class="show-img">
						<img src="${e.target.result}" width=200 height=200 id="image" />
					</div>
				`;

				const image = document.getElementById('image');
				cropper = new Cropper(image, {
					aspectRatio: 1,
					crop(event) {},
				});
			};

			reader.readAsDataURL(fileInput.files[0]);
		} else {
			preview.innerHTML = '';
			cropper.destroy();
		}
	});

	upload.addEventListener('click', () => {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob((blob) => {
				formData.append('image', blob, 'cropped-image.jpg');
				formData.append('username', username.value);
				updateUser(formData);
			});
		} else {
			console.error('No image selected or cropped.');
		}
	});
};

fetchUser();
update();
