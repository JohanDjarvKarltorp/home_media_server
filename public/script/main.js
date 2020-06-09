document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('search').addEventListener('keyup', searchMatch);
});

let searchMatch = () => {
    let input = document.getElementById('search');
    let filter = input.value.toUpperCase();
    let collection = document.getElementsByClassName('card-content');

    for (let i = 0; i < collection.length; i++) {
        let text = collection[i].textContent || collection[i].innerText;

        if (text.toUpperCase().indexOf(filter) > -1) {
            collection[i].parentElement.parentElement.parentElement.style.display = "";
        } else {
            collection[i].parentElement.parentElement.parentElement.style.display = "none";
        }
    }
};
