document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('search').addEventListener('keyup', searchCard);
});

let searchCard = (event) => {
    let input = document.getElementById('search');
    let filter = input.value.toUpperCase();
    let collection = document.getElementsByClassName('card-content');

    switch (event.key) {
        case "Enter":
            document.getElementById("search").blur();
            break;

        case "Escape":
            document.getElementById("search").blur();
            break;

        default:
            for (let i = 0; i < collection.length; i++) {
                let text = collection[i].textContent || collection[i].innerText;
                let parentElement = collection[i].parentElement;
                let container = parentElement.closest(".col");

                if (searchCard.oldClassList === undefined) {
                    searchCard.oldClassList = Array.from(container.classList);
                }

                if (text.toUpperCase().indexOf(filter) > -1) {
                    let small = searchCard.oldClassList.find(e => /s\d\d?/.test(e));
                    let medium = searchCard.oldClassList.find(e => /m\d\d?/.test(e));

                    container.classList.remove("m0");
                    container.classList.add(small);
                    container.classList.add(medium);

                    parentElement.classList.add("scale-in");
                } else {
                    let small = searchCard.oldClassList.find(e => /s\d\d?/.test(e));
                    let medium = searchCard.oldClassList.find(e => /m\d\d?/.test(e));

                    parentElement.classList.remove("scale-in");
                    parentElement.classList.add("scale-out");

                    container.style.transition = "all 0.3s cubic-bezier(0.53, 0.36, 0.01, 0.53)";
                    container.classList.remove(small);
                    container.classList.remove(medium);
                    container.classList.add("m0");
                }
            }
    }
};
