import {BackButtonComponent} from "../../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {ProductComponent} from "../../../components/product/index.js";
export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return (
            `
                <div id="product-page"></div>
            `
        )
    }
    
    clickBack() {
        var del = document.getElementsByClassName("popover bs-popover-auto fade show")
    
        del.id = "del"
       
        for (var i = 0; i <del.length; i++) {
            del[i].id = "del" + i; 
            del[i].remove();
        }
        

        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }
 

    
    render(item) {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const stock = new ProductComponent(this.pageRoot)
        stock.render(item)
    }
}