import '../auth/user.js';
import { getProfileById, getProfile, uploadImage, getUser, upsertProfile } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = document.getElementById('update-profile-btn');
const userNameInput = document.querySelector('[name=username]');
const avatarInput = document.querySelector('[name=avatar]');
const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const fav_food = document.querySelector('[name=fav-food]');
const profileDetailEl = document.querySelector('.profile-display');
const imgEl = document.getElementById('img-input');
const usernameHeaderEl = document.querySelector('.username-header');
const headerTitle = document.querySelector('.title');

// const params = new URLSearchParams(location.search);
// const id = params.get('id');

let error = null;
let profile = null;

const user = getUser();
console.log(user, 'user');

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;
    console.log(profile, 'profile');

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
    console.log(profileObj, 'profile Obj');
    const imageFile = formData.get('avatar-input');
    console.log(imageFile, 'image file');
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;

        const url = await uploadImage(imagePath, imageFile);

        profileObj.avatar = url;
    }

    const response = await upsertProfile(profileObj);
    console.log('response', response);
    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Profile';
    } else {
        location.assign('/');
    }
});
