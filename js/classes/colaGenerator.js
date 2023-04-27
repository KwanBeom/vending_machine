class ColaGenerator {
    constructor() {
        this.itemList = document.querySelector(".left-content ul");
    }

    async setup() {
        const response = await this.loadData();
        this.colaFactory(response)
    }

    async loadData() {
        try {
            const response = await fetch("../items.json");

            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    colaFactory(data) {
        const docFrag = document.createDocumentFragment();
        data.forEach((el) => {
            const item = document.createElement("li");
            const itemTemplate = `
            <button type="button" class="drink-box" data-item="${el.name}" data-count="${el.count}" data-cost="${el.cost}" data-img="${el.img}"">
                <p class="soldout-text bold">품절</p>
                <img src="./images/${el.img}" alt="기본 콜라">
                <h2 class="drink-text">${el.name}</h2>
                <p class="price-text">${el.cost}원</p>
            </button>
            `;

            item.innerHTML = itemTemplate
            docFrag.append(item)
        });

        this.itemList.append(docFrag)
    }
}

export default ColaGenerator;
