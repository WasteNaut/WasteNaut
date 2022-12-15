import '../auth/user.js';
import { getProfile, getProfileById, getUser } from '../fetch-utils.js';

const profileDetailEl = document.querySelector('#profile-display');
const usernameHeaderEl = document.querySelector('.username-header');
// const imgEl = document.getElementById('img-input');

const user = getUser();

window.addEventListener('load', async () => {
    fetchAndDisplayProfile();
});

async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';

    const profile = await getProfile(user.id);
    console.log(profile.data, 'profile');

    const username = document.createElement('h2');
    username.classList.add('head-user');
    username.textContent = `${profile.data.username}'s profile`;
    const imgEl = document.createElement('img');
    imgEl.classList.add('profile-pic');
    imgEl.src = profile.data.avatar;
    const fav_food = document.createElement('p');
    fav_food.classList.add('food-tag');
    fav_food.textContent = `Your favorite food is ${profile.data.fav_food}`;

    if (!profile.data.avatar) {
        imgEl.src =
            '../assets/DALL_E_2022-12-09_13.00.00_-_astronaut_coming_out_of_a_galactic_refrigerator_with_produce__modern_logo__bright_design__colorful-removebg-preview.png';
    }
    profileDetailEl.classList.add('profile');
    profileDetailEl.append(username, imgEl, fav_food);
}
