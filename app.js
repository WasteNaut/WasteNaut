/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import {
    // CheckEx,
    createFreshness,
    createListItem,
    deleteList,
    getList,
    getProfile,
    getUser,
} from './fetch-utils.js';
import { renderList } from './render-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.createForm');
const listEl = document.querySelector('.produce-list');
const error = document.querySelector('#error');
const deleteEl = document.querySelector('#delete-button');
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
    // console.log('newItem', newItem);
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
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'delete item';
            deleteBtn.addEventListener('click', async () => {
                await deleteList(name.id);
                console.log('name.id', name.id);
                displayList();
            });
            listEl.append(listItemEl, deleteBtn);
        }
    }
}

export async function CheckEx(produce_id, freshness) {
    timeEl.textContent = '';
    const expiration = await getList(produce_id.data.id, freshness.data.date);
    if (expiration) {
        const timeRemaining = freshness - Date.now();
        if (timeRemaining < 86400000) {
            // 24 hrs * 60 min/hour * 60 sec/min * 1000 milli/sec
            sendAlert();
        }
        console.log('timeRemaining', timeRemaining);
    }
}

export async function sendAlert() {
    console.log('Expiration alert: 24 hours remaining for one or more items in your tracker!');
}

deleteEl.addEventListener('click', async () => {
    await deleteList();

    await displayList();
});

// TEST COMMENT
