import '../auth/user.js';
import { getProfileById, getProfile, uploadImage, getUser, upsertProfile } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = document.getElementById('update-profile-btn');
const userNameInput = document.querySelector('[name=username]');
const avatarInput = document.querySelector('[name=avatar]');
const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const fav_food = document.querySelector('[profile=fav-food]');
const profileDetailEl = document.querySelector('.profile-display');
const imgEl = document.getElementById('img-input');
const usernameHeaderEl = document.querySelector('.username-header');
const headerTitle = document.querySelector('.title');

const params = new URLSearchParams(location.search);
const id = params.get('id');

let error = null;
let profile = null;

const user = getUser();
console.log(user, 'user');

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;
    console.log(response, 'response');

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
    fetchAndDisplayProfile();
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    updateBtn.disabled = true;
    updateBtn.textContent = 'Saving...';

    const formData = new FormData(profileForm);

    const profileObj = {
        username: formData.get('username'),
        fav_food: formData.get('fav-food'),
        // avatar: formData.get('avatar'),
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

    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Profile';
    } else {
        location.assign('/');
    }
});

async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';
    const profile = await getProfileById(id);
    headerTitle.textContent = `${profile.username}'s profile`;

    const fav_food = document.createElement('p');
    fav_food.textContent = profile.fav_food;

    if (profile.avatar === null) {
        imgEl.src =
            '../assets/DALL_E_2022-12-09_13.00.00_-_astronaut_coming_out_of_a_galactic_refrigerator_with_produce__modern_logo__bright_design__colorful-removebg-preview.png';
    } else {
        imgEl.src = profile.avatar;
        usernameHeaderEl.textContent = profile.username;
    }
    profileDetailEl.append(imgEl, usernameHeaderEl, fav_food);
}
