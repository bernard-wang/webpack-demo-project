import { createRoot } from 'react-dom/client';
import { App } from '@/app';

const container = document.getElementById('main');
if (!container) throw new Error('element main not found');

const root = createRoot(container);
root.render(<App />);
