import { ProductCardComponent } from "./components/index.js";


const root = document.getElementById('root');

const PCC = new ProductCardComponent(root)
PCC.render()