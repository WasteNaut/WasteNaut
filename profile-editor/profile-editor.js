import '../auth/user.js';
import { getProfileById, getProfile, uploadImage, getUser } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');
const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const fav_food = profileForm.querySelector('[profile=fav-food]');
const profileDetailEl = document.getElementById('profile-display');
const imgEl = document.querySelector('#avatar-img');
const usernameHeaderEl = document.querySelector('.username-header');
const headerTitle = document.querySelector('.title');

const params = new URLSearchParams(location.search);
const id = params.get('id');

let error = null;
let profile = null;

const user = getUser();
console.log(user, 'user');

window.addEventListener('load', async () => {
    if (!id) {
        location.assign('/');
        return;
    }
    fetchAndDisplayProfile();
});

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
