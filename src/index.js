import Button from '../components/currency/button'
import Icon from '../components/currency/icon'
import Collapse from '../components/Exhibition/collapse'
import CollapseItem from '../components/Exhibition/collapse-item'
const components = [
    Button,
    Icon,
    Collapse,
    CollapseItem
]

const install = function (Vue) {
    components.forEach(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    version: '0.0.1',
    install,
    Button,
    Icon
}

