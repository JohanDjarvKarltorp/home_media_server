/* global M */

document.addEventListener('DOMContentLoaded', () => {
    let elements = document.querySelectorAll('.materialboxed');
    let listener;
    let options = {
        onOpenEnd: (target) => {
            let index = Array.prototype.indexOf.call(elements, target);

            listener = navigation.bind(null, target, index, elements);

            document.addEventListener('keyup', listener, {once: true});
        },
        onCloseStart: () => {
            document.removeEventListener('keyup', listener);
        }
    };

    M.Materialbox.init(elements, options);
});


let navigation = (target, index, elements, event) => {
    switch (event.key) {
        case "ArrowLeft":
            M.Materialbox.getInstance(target).close();

            if (index > 0) {
                M.Materialbox.getInstance(elements.item(index - 1)).open();
            }

            break;

        case "ArrowRight":
            M.Materialbox.getInstance(target).close();

            if (index < elements.length - 1) {
                M.Materialbox.getInstance(elements.item(index + 1)).open();
            }
            break;
    }
};
