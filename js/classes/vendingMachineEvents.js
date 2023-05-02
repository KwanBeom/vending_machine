class VendingMachineEvents {
    constructor() {
        const vMachine = document.querySelector(".left-content");
        this.balance = vMachine.querySelector(".money-box p span");
        this.itemList = vMachine.querySelector("#get-drink");
        this.inputCostEl = vMachine.querySelector(".write-money");
        this.btnReturn = vMachine.querySelector("button[form='left-money'");
        this.btnPut = vMachine.querySelector("button[form='deposit']");
        this.btnGet = vMachine.querySelector(".get-btn");
        this.stagedList = vMachine.querySelector(".scroll-box");

        const myInfo = document.querySelector(".right-content");
        this.myMoney = myInfo.querySelector(".money-box p span");
        this.getList = myInfo.querySelector(".scroll-box");
        this.totalCost = myInfo.querySelector(".total-money");
    }
    stagedItemGenerator(target) {
        const stagedItem = document.createElement("li");
        stagedItem.classList.add("scroll-item");
        stagedItem.dataset.item = target.dataset.item;
        stagedItem.dataset.cost = target.dataset.cost;

        stagedItem.innerHTML = `
            <img src="../../images/${target.dataset.img}" alt=""> 
                ${target.dataset.item}
            <strong class="count">1</strong>
        `;

        this.stagedList.append(stagedItem);
    }

    bindEvent() {
        /**
         * 1. 입금 버튼 기능
         * 입금 버튼 눌렀을 시
         * 1) 소지금 === 소지금 - 입금액
         * 2) 잔액 === 기존 잔액 + 입금액
         * 3) 입금액이 소지금보다 많으면 아무 동작 X
         * 4) 입금액이 정상적으로 입금되면 입금창은 초기화
         */
        this.btnPut.onclick = () => {
            // 입력값
            const inpCost = parseInt(this.inputCostEl.value);
            // 소지금
            const myMoneyVal = parseInt(
                this.myMoney.textContent.replaceAll(",", "")
            );
            // 잔액
            const balanceVal = parseInt(
                this.balance.textContent.replaceAll(",", "")
            );
            if (inpCost) {
                if (inpCost <= myMoneyVal && inpCost > 0) {
                    // 입금액 <= 소지금
                    this.myMoney.textContent =
                        new Intl.NumberFormat().format(myMoneyVal - inpCost) + "원";
                    this.balance.textContent =
                        new Intl.NumberFormat().format(balanceVal + inpCost) + "원";
                    this.inputCostEl.value = ''                            
                } else {
                    // 입금액 > 소지금
                    alert("잔액이 부족합니다.");
                }
            }
        };
        /**
         * 2. 거스름돈 반환 버튼
         * 1) 반환버튼 누르면 소지금 === 잔액 + 소지금
         * 2) 반환버튼 누르면 잔액창 초기화
         */

        this.btnReturn.onclick = () => {
            // 소지금
            const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));
            // 잔액
            const balanceVal = parseInt(this.balance.textContent.replaceAll(",", ""));

            if (balanceVal) {
                this.myMoney.textContent = new Intl.NumberFormat().format(balanceVal + myMoneyVal) + "원";
                this.balance.textContent = 0 + "원";
            }
        };
        /**
         * 3. 자판기 장바구니 채우기
         * 1) 아이템 클릭시 잔액 === 잔액 - 아이템 가격
         * 2) 아이템 가격 > 잔액일 시 경고창
         * 3) 아이템의 count -1, 장바구니에 들어가게
         * 4) 아이템 count 0이 되면 품절
         */
        this.colaBtns = document.querySelectorAll(".left-content .drink-box");
        this.colaBtns.forEach((item) => {
            item.onclick = (event) => {
                const balanceVal = parseInt(
                    this.balance.textContent.replaceAll(",", "")
                );
                const targetEl = event.currentTarget
                const targetCost = parseInt(targetEl.dataset.cost);
                const stagedListItem = this.stagedList.querySelectorAll("li")
                let isStaged = false;

                if (balanceVal >= targetCost) {
                    this.balance.textContent =
                        new Intl.NumberFormat().format(balanceVal - targetCost) + "원";

                    for (const item of stagedListItem) {
                        if(targetEl.dataset.item === item.dataset.item){
                            item.querySelector("strong").firstChild.textContent = parseInt(item.querySelector("strong").firstChild.textContent) + 1

                            isStaged = true;
                            break;
                        }
                    }
                    if(!isStaged) {
                        this.stagedItemGenerator(event.currentTarget)
                    }

                    // 자판기 콜라 갯수 차감
                    targetEl.dataset.count--;
                    if(parseInt(targetEl.dataset.count) === 0){
                        targetEl.classList.add("soldout")
                        targetEl.disabled = true;
                    }
                } else {
                    alert("잔액이 부족합니다");
                }
            };
        });
                /**
     * 4. 획득 버튼 기능
     * 1) 장바구니에 있는 음료수 목록 => 획득한 음료 목록 이동
     * 2) 획득한 음료 금액 합산해 총금액에 input
     */
    this.btnGet.onclick = () => {
        const itemStagedList = this.stagedList.querySelectorAll("li")
        const itemGetList = this.getList.querySelectorAll("li")
        let totalPrice = 0

        for(const itemStaged of itemStagedList){
            let isGet = false;
            for(const itemGet of itemGetList){
                // 장바구니의 item과 획득 목록의 item과 비교
                if(itemStaged.dataset.item === itemGet.dataset.item){
                    itemGet.querySelector("strong").firstChild.textContent = 
                        parseInt(itemGet.querySelector("strong").firstChild.textContent) + parseInt(itemStaged.querySelector("strong").firstChild.textContent);
                    isGet = true
                    break;
                }
            }
            if(!isGet){
                this.getList.append(itemStaged);
            }
        }
        this.stagedList.innerHTML = null

        this.getList.querySelectorAll("li").forEach(item => {
            totalPrice += parseInt(item.dataset.cost) * parseInt(item.querySelector(".count").firstChild.textContent)
        })
        this.totalCost.textContent = new Intl.NumberFormat().format(totalPrice)
    }
    }
}
export default VendingMachineEvents;
