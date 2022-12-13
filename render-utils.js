export function renderList(nameObject) {
    const listItemEl = document.createElement('li');
    listItemEl.textContent = `${nameObject.name}: ${nameObject.quantity}, ${nameObject.expiration[0].freshness}`;
    return listItemEl;
}

export function renderProfile(profileObject) {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const img = document.createElement('img');
    const p = document.createElement('p');

    div.classList.add('profile-list-item');
    h2.classList.add('username');
    img.classList.add('avatar');
    p.classList.add('fav-food');

    h2.textContent = `${profileObject.username}'s Profile`;
    img.src = profileObject.avatar;
    img.alt = 'avatar';
    p.textContent = `Your favorite food is ${profileObject.fav_food}`;

    div.append(h2, img, p);

    return div;
}
