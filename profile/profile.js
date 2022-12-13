async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';
    const profile = await getProfile(user.data);
    console.log(profile);
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
