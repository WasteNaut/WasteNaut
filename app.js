/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { createListItem, getList } from './fetch-utils.js';
import { renderList } from './render-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.createForm');
const listEl = document.querySelector('.produce-list');
const error = document.querySelector('#error');
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

    form.reset();
    const newItem = await createListItem(name, quantity);
    if (newItem) {
        displayList();
        // } else {
        //     error.textContent = 'Something went wrong while adding your item';
    }
});

/* Display Functions */

async function displayList() {
    listEl.textContent = '';
    const list = await getList();
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
