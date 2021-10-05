import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';

const content = proxy({ obj: null });

export { content };
