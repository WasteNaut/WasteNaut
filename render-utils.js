export function renderList(nameObject) {
    const listItemEl = document.createElement('li');
    listItemEl.textContent = `${nameObject.name}: ${nameObject.quantity}`;
    return listItemEl;
}
