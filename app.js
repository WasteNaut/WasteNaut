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

    var GivenDate = date;
    var CurrentDate = new Date();

    GivenDate = new Date(GivenDate);

    function getDaysDiff(date1, date2) {
        const diff = Math.abs(date1 - date2);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days;
    }

    // const date1 = GivenDate;
    // const date2 = CurrentDate;

    const diff = getDaysDiff(GivenDate, CurrentDate);
    console.log(diff); // Output: 4

    if (GivenDate > CurrentDate) {
        alert(`Your ${name} have ${diff} days before they expire! `);
    } else {
        alert('Given date is not greater than the current date.');
    }
    console.log('GivenDate', GivenDate);
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

// deleteEl.addEventListener('click', async () => {
//     await deleteList();

//     await displayList();
// });

// var GivenDate = '12-29-2022';
// var CurrentDate = new Date();
// GivenDate = new Date(GivenDate);

// if (GivenDate > CurrentDate) {
//     alert('Given date is greater than the current date.');
// } else {
//     alert('Given date is not greater than the current date.');
// }
// console.log('GivenDate', GivenDate);
