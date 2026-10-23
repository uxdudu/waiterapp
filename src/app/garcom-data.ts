import chickenImage from "../assets/figma/garcom-raw-6.jpeg";
import cheeseImage from "../assets/figma/garcom-raw-3.jpeg";
import margaritaImage from "../assets/figma/garcom-raw-2.jpeg";
import type { CategoryOption, OrderSummaryData } from "../components/blocks";
import { orderStatus } from "../lib/order-status";

export type ProductCategory = "pizzas" | "bebidas" | "lanches" | "sobremesas" | "promocoes";

export type Product = {
  id: string;
  category: ProductCategory;
  icon?: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  image?: string;
};

export const products: Product[] = [
  {
    id: "quatro-queijos",
    category: "pizzas",
    name: "Quatro Queijos",
    description: "Pizza de Quatro Queijos com borda tradicional",
    ingredients: ["Prato", "Cheddar", "Mussarela", "Parmesão", "Cebola"],
    price: 40,
    image: cheeseImage,
  },
  {
    id: "frango-catupiry",
    category: "pizzas",
    name: "Frango com Catupiry",
    description: "Pizza de Frango com Catupiry e borda tradicional",
    ingredients: ["Frango", "Catupiry", "Mussarela", "Orégano"],
    price: 45,
    image: chickenImage,
  },
  {
    id: "marguerita",
    category: "pizzas",
    name: "Marguerita",
    description: "Pizza de Marguerita no melhor estilo italiano",
    ingredients: ["Tomate", "Mussarela", "Manjericão", "Azeite"],
    price: 50,
    image: margaritaImage,
  },
  {
    id: "calabresa",
    category: "pizzas",
    name: "Calabresa Especial",
    description: "Calabresa fatiada, cebola roxa e azeitonas",
    ingredients: ["Calabresa", "Cebola roxa", "Azeitona", "Mussarela"],
    price: 42,
    image: cheeseImage,
  },
  {
    id: "portuguesa",
    category: "pizzas",
    name: "Portuguesa",
    description: "Presunto, ovo, cebola, ervilha e mussarela",
    ingredients: ["Presunto", "Ovo", "Cebola", "Ervilha", "Mussarela"],
    price: 46,
    image: chickenImage,
  },
  {
    id: "pepperoni",
    category: "pizzas",
    name: "Pepperoni",
    description: "Pepperoni artesanal e mussarela cremosa",
    ingredients: ["Pepperoni", "Mussarela", "Orégano"],
    price: 49,
    image: margaritaImage,
  },
  {
    id: "coca-cola",
    category: "bebidas",
    name: "Coca-Cola 350ml",
    description: "Refrigerante gelado em lata",
    ingredients: ["Coca-Cola"],
    price: 6,
    icon: "🥤",
  },
  {
    id: "guarana",
    category: "bebidas",
    name: "Guaraná Antarctica 350ml",
    description: "Refrigerante gelado em lata",
    ingredients: ["Guaraná Antarctica"],
    price: 6,
    icon: "🥤",
  },
  {
    id: "agua",
    category: "bebidas",
    name: "Água mineral",
    description: "Água mineral sem gás 500ml",
    ingredients: ["Água mineral"],
    price: 4,
    icon: "💧",
  },
  {
    id: "suco-laranja",
    category: "bebidas",
    name: "Suco de laranja",
    description: "Suco natural preparado na hora",
    ingredients: ["Laranja", "Gelo"],
    price: 9,
    icon: "🍊",
  },
  {
    id: "hamburguer",
    category: "lanches",
    name: "Burger da Casa",
    description: "Pão brioche, blend da casa, queijo e molho especial",
    ingredients: ["Pão brioche", "Blend 160g", "Queijo", "Molho especial"],
    price: 28,
    icon: "🍔",
  },
  {
    id: "batata",
    category: "lanches",
    name: "Batata com cheddar",
    description: "Batata frita crocante com cheddar cremoso",
    ingredients: ["Batata", "Cheddar", "Cebolinha"],
    price: 22,
    icon: "🍟",
  },
  {
    id: "frango-frito",
    category: "lanches",
    name: "Tiras de frango",
    description: "Tiras de frango crocantes com molho da casa",
    ingredients: ["Frango", "Farinha crocante", "Molho da casa"],
    price: 25,
    icon: "🍗",
  },
  {
    id: "brownie",
    category: "sobremesas",
    name: "Brownie com sorvete",
    description: "Brownie de chocolate servido com sorvete de creme",
    ingredients: ["Chocolate", "Castanhas", "Sorvete de creme"],
    price: 18,
    icon: "🍫",
  },
  {
    id: "pudim",
    category: "sobremesas",
    name: "Pudim de leite",
    description: "Pudim cremoso com calda de caramelo",
    ingredients: ["Leite", "Ovos", "Caramelo"],
    price: 14,
    icon: "🍮",
  },
  {
    id: "sorvete",
    category: "sobremesas",
    name: "Sorvete artesanal",
    description: "Duas bolas de sorvete do dia",
    ingredients: ["Sorvete artesanal"],
    price: 12,
    icon: "🍨",
  },
  {
    id: "combo-familia",
    category: "promocoes",
    name: "Combo Família",
    description: "Pizza grande, refrigerante 2L e sobremesa",
    ingredients: ["Pizza grande", "Refrigerante 2L", "Sobremesa"],
    price: 79,
    icon: "🏷",
  },
  {
    id: "dupla-pizzas",
    category: "promocoes",
    name: "Dupla de pizzas",
    description: "Duas pizzas grandes com sabores à escolha",
    ingredients: ["Duas pizzas grandes", "Borda tradicional"],
    price: 89,
    icon: "🏷",
  },
];

export const categories: CategoryOption<ProductCategory>[] = [
  { id: "pizzas", icon: "🍕", label: "Pizzas" },
  { id: "bebidas", icon: "🥤", label: "Bebidas" },
  { id: "lanches", icon: "🍔", label: "Lanches" },
  { id: "sobremesas", icon: "🍰", label: "Sobremesas" },
  { id: "promocoes", icon: "🏷", label: "Promoções" },
];

export const tables = ["Mesa 1", "Mesa 2", "Mesa 3", "Mesa 4", "Mesa 5", "Mesa 6"];

/** Product photo for an order line, matched by name (stored orders keep only the name). */
export function productImage(name: string) {
  return products.find((product) => product.name === name)?.image;
}

const sampleItems = [
  { quantity: 1, name: "Frango com Catupiry" },
  { quantity: 2, name: "Quatro Queijos" },
].map((item) => ({ ...item, image: productImage(item.name) }));

export const sampleOrdersInProgress: OrderSummaryData[] = [
  { items: sampleItems, status: orderStatus.ready, title: "Mesa 123" },
  { items: sampleItems, status: orderStatus.production, title: "Mesa 122" },
];

export const previousOrders: OrderSummaryData[] = [
  { items: sampleItems, status: { label: "Finalizado em 07/12/2022", tone: "neutral" }, title: "Mesa 123" },
  { items: sampleItems, status: { label: "Finalizado em 07/12/2022", tone: "neutral" }, title: "Mesa 123" },
];
