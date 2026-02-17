import { nanoid } from 'nanoid';

// Menghasilkan ID unik pendek (10 karakter) yang aman untuk database
export const generateId = () => nanoid(10);