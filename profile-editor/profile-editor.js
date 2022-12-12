import '../auth/user.js';
import { getProfileById, getProfile, uploadImage, getUser } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');
const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');
const fav_food = profileForm.querySelector('[profile=fav-food]');

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
});
