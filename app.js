/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { createFreshness, createListItem, getList, getProfile, getUser } from './fetch-utils.js';
import { renderList } from './render-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.createForm');
const listEl = document.querySelector('.produce-list');
const error = document.querySelector('#error');

const user = getUser();
/* State */

/* Events */
window.addEventListener('load', async () => {
    await displayList();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const quantity = data.get('quantity');
    const date = data.get('date');

    const newItem = await createListItem(name, quantity);
    console.log('newItem', newItem);
    const freshness = await createFreshness(date, newItem[0].id);
    if (newItem && freshness) {
        displayList();
        // } else {
        //     error.textContent = 'Something went wrong while adding your item';
    }
    form.reset();
});

/* Display Functions */

async function displayList() {
    listEl.textContent = '';

    const profileId = await getProfile(user.id);
    const list = await getList(profileId.data.id);
    console.log('list', list);
    if (list) {
        for (let name of list) {
            const listItemEl = renderList(name);
            listItemEl.addEventListener('click', async () => {
                await displayList();
            });
            listEl.append(listItemEl);
        }
    }
}
