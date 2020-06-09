document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('search').addEventListener('keyup', searchMatch);
});

let searchMatch = (event) => {
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
                let container = parentElement.parentElement.parentElement;

                if (text.toUpperCase().indexOf(filter) > -1) {
                    container.classList.remove("m0");
                    container.classList.add("m4");
                    container.classList.add("s6");

                    parentElement.classList.add("scale-in");
                } else {
                    parentElement.classList.remove("scale-in");
                    parentElement.classList.add("scale-out");

                    container.style.transition = "all 0.3s cubic-bezier(0.53, 0.36, 0.01, 0.53)";
                    container.classList.remove("m4");
                    container.classList.remove("s6");
                    container.classList.add("m0");
                }
            }
    }
};
