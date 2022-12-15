import '../auth/user.js';
import { getProfile, uploadImage, getUser, upsertProfile } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = document.getElementById('update-profile-btn');
const userNameInput = document.querySelector('[name=username]');
const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const fav_food = document.querySelector('[name=fav-food]');

let error = null;
let profile = null;

const user = getUser();

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;

    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        if (profile) {
            userNameInput.value = profile.username;
            if (profile.avatar) {
                preview.src = profile.avatar;
            }
            if (profile.fav_food) {
                fav_food.value = profile.fav_food;
            }
        }
    }
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    updateBtn.disabled = true;
    updateBtn.textContent = 'Saving...';

    const formData = new FormData(profileForm);

    const profileObj = {
        username: formData.get('username'),
        fav_food: formData.get('fav-food'),
        avatar: formData.get('avatar'),
    };

    const imageFile = formData.get('avatar-input');

    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;

        const url = await uploadImage(imagePath, imageFile);

        profileObj.avatar = url;
    }

    const response = await upsertProfile(profileObj);
    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Profile';
    } else {
        location.assign('../profile');
    }
});
