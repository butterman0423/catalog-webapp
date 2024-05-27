(async () => {
    const { body } = document;

    const addBtn = body.querySelector("button.add-btn");
    addBtn.addEventListener("click", async () => {
        addBtn.disabled = true;

        const formRaw = await fetch("/ui/form");
        if(!formRaw.ok) {
            addBtn.disabled = false;
            return;
        }

        body.insertAdjacentHTML("beforeend", await formRaw.text());

        const formEl = body.querySelector(`form#db-add-form`);
        const cancelEl = formEl.querySelector(`button.form-cancel`);

        formEl.addEventListener("submit", async (e) => {
            e.preventDefault();

            const inputs = formEl.querySelectorAll(`input.form-input`);
            const dat = {};

            inputs.forEach(el => {
                const key = el.getAttribute("name");
                const val = el.value;
                dat[key] = val;
            });

            const res = await fetch( formEl.getAttribute("action"), { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                mode: "cors",
                body: JSON.stringify(dat),
                redirect: "follow" 
            })

            if(res.ok && res.redirected) {
                window.location.replace(res.url);
                return;
            }

            console.log("Failed to send data.");
            formEl.remove();
        })

        cancelEl.addEventListener("click", () => {
            formEl.remove();
            addBtn.disabled = false;
        });
    });
})()