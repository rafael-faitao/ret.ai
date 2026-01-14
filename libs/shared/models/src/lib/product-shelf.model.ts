export class ProductShelf {
    id: string = crypto.randomUUID();
    name: string = '';
    orientation: number = 0; // degrees
    color: string = '#597DA9';
    width: number = 100; // meters
    height: number = 30; // meters
    x: number = 0;
    y: number = 0;
    averageTicket: number = 0;
}
