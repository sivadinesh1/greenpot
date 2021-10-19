import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';

let initialValue = {
    sectionName: null,
    isEdit: false,
}
const section = proxy({
    currentSection: null,
    isEdit: false,
    mode: ""

});

export { section };