export enum StructureObjectType {
  ENTRANCE = 'entrance',
  EXIT = 'exit',
  CASH_COUNTER = 'cash_counter',
  ENTRANCE_EXIT = 'entrance_exit',
  STRUCTURAL_BLOCKER = 'blocker'
}

export class StructureObject {
  id: string = crypto.randomUUID();
  name: string = '';
  type: StructureObjectType = StructureObjectType.STRUCTURAL_BLOCKER;
  x: number = 0;
  y: number = 0;
  orientation: number = 0; // degrees
  width: number = 50;
  height: number = 50;
}
