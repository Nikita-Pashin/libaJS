import { App } from "./app";
import { Liba } from "../../src/liba/Liba";

const rootElement = document.getElementById('root')

const appComponent = Liba.create(App);

rootElement?.append(appComponent.element)


