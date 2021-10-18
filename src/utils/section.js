import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';

// let request = {
//     sectionName: null,
//     isEdit: false
// }
const section = proxy({
    currentSection: null
});

export { section };