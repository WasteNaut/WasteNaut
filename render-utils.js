export function renderList(nameObject) {
    const listItemEl = document.createElement('li');
    listItemEl.textContent = `${nameObject.name}: ${nameObject.quantity}, ${nameObject.expiration[0].freshness}`;
    return listItemEl;
}
